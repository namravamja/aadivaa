import type { Request, Response } from "express";
import * as orderService from "../../../services/Buyer/order/order.service";
import * as cartService from "../../../services/Buyer/cart/cart.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) throw new Error("Unauthorized");

    const { addressIds, paymentMethod } = req.body;

    if (!addressIds || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "add & payment method are required",
      });
    }

    const cartItems = await cartService.getCartByBuyerId(buyerId);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot create order.",
      });
    }

    const order = await orderService.createOrderFromCart(buyerId, {
      addressIds,
      paymentMethod,
      cartItems,
    });

    await cartService.clearCart(buyerId);

    // Clear related caches after order creation
    await deleteCache(`buyer_orders:${buyerId}:*`);
    await deleteCache(`cart:${buyerId}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to create order",
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
    const { paymentStatus, transactionId } = req.body;

    const order = await orderService.updatePaymentStatus(orderId, {
      paymentStatus,
      transactionId,
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
