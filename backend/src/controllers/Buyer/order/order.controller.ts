import type { Request, Response } from "express";
import * as orderService from "../../../services/Buyer/order/order.service";
import * as cartService from "../../../services/Buyer/cart/cart.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";
import { razorpay } from "../../../utils/razorpay";
import crypto from "crypto";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

// Updated createOrder function with better Razorpay configuration
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Buyer ID is missing",
      });
    }

    const { addressIds, paymentMethod } = req.body;
    if (!addressIds || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Both addressIds and paymentMethod are required.",
      });
    }

    // Extract the first address ID (assuming single shipping address)
    const shippingAddressId = Array.isArray(addressIds)
      ? addressIds[0]
      : addressIds;

    const cartItems = await cartService.getCartByBuyerId(buyerId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot proceed.",
      });
    }

    let totalAmount = 0;
    for (const cartItem of cartItems) {
      const itemTotal =
        parseFloat(cartItem.product.sellingPrice) * cartItem.quantity;
      totalAmount += itemTotal;
    }

    const subtotal = totalAmount;
    const shipping = subtotal >= 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const finalAmount = subtotal + shipping + tax;

    if (paymentMethod === "razorpay") {
      const razorpayOrderOptions = {
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        receipt: `rcpt_${Date.now()}`, // must be under 40 chars
        notes: {
          buyer_id: buyerId,
          shippingAddressId: shippingAddressId.toString(),
        },
      };

      const razorOrder = await razorpay.orders.create(razorpayOrderOptions);

      return res.status(201).json({
        success: true,
        message: "Razorpay order created. Proceed with payment.",
        data: {
          razorpayOrderId: razorOrder.id,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
          totalAmount: finalAmount,
          currency: "INR",
        },
      });
    }

    // Handle other methods like COD
    const order = await orderService.createOrderFromCart(buyerId, {
      shippingAddressId, // Pass single address ID
      paymentMethod,
      cartItems,
    });

    await cartService.clearCart(buyerId);
    await deleteCache(`buyer_orders:${buyerId}:*`);
    await deleteCache(`cart:${buyerId}`);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to create order.",
    });
  }
};

export const verifyRazorpayPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    // Get single address ID from notes
    const shippingAddressId = parseInt(
      String(razorpayOrder.notes?.shippingAddressId || "0")
    );

    if (!shippingAddressId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid shipping address." });
    }

    const cartItems = await cartService.getCartByBuyerId(buyerId);
    if (!cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    const order = await orderService.createOrderFromCart(buyerId, {
      shippingAddressId, // Pass single address ID
      paymentMethod: "razorpay",
      cartItems,
    });

    await orderService.updatePaymentStatus(order.id, {
      paymentStatus: "paid",
    });

    await cartService.clearCart(buyerId);
    await deleteCache(`buyer_orders:${buyerId}:*`);
    await deleteCache(`cart:${buyerId}`);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in verifyRazorpayPayment:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Verification failed.",
    });
  }
};

export const getBuyerOrders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) throw new Error("Unauthorized");

    const { page = "1", limit = "10", status } = req.query;

    const cacheKey = `buyer_orders:${buyerId}:page:${page}:limit:${limit}:status:${
      status || "all"
    }`;
    const cachedOrders = await getCache(cacheKey);

    if (cachedOrders) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedOrders,
      });
    }

    const orders = await orderService.getBuyerOrders(buyerId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string | undefined,
    });

    await setCache(cacheKey, orders);

    res.status(200).json({
      success: true,
      source: "db",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id;
    const { orderId } = req.params;

    if (!buyerId || !orderId)
      throw new Error("Unauthorized or missing order ID");

    const cacheKey = `buyer_order:${buyerId}:${orderId}`;
    const cachedOrder = await getCache(cacheKey);

    if (cachedOrder) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedOrder,
      });
    }

    const order = await orderService.getOrderById(orderId, buyerId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await setCache(cacheKey, order);

    res.status(200).json({
      success: true,
      source: "db",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch order",
    });
  }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    const { orderId } = req.params;

    if (!buyerId || !orderId)
      throw new Error("Unauthorized or missing order ID");

    const order = await orderService.cancelOrder(orderId, buyerId);

    // Clear related caches after order cancellation
    await deleteCache(`buyer_order:${buyerId}:${orderId}`);
    // Clear buyer orders list cache (all variations)
    const cachePattern = `buyer_orders:${buyerId}:*`;
    // Note: You might need to implement a pattern-based cache clearing function

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to cancel order",
    });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const order = await orderService.updatePaymentStatus(orderId, {
      paymentStatus,
    });

    // Clear order-related caches (we don't have buyerId here, so clear by orderId pattern)
    await deleteCache(`buyer_order:*:${orderId}`);
    // Note: You might need to implement a pattern-based cache clearing function

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to update payment status",
    });
  }
};
