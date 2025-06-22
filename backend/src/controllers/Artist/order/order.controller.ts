import type { Request, Response } from "express";
import * as orderService from "../../../services/Artist/order/order.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const getArtistOrders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { page = "1", limit = "10", status, paymentStatus } = req.query;

    const cacheKey = `artist_orders:${artistId}:page:${page}:limit:${limit}:status:${
      status || "all"
    }:payment:${paymentStatus || "all"}`;
    const cachedOrders = await getCache(cacheKey);

    if (cachedOrders) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedOrders,
      });
    }

    const orders = await orderService.getArtistOrders(artistId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string | undefined,
      paymentStatus: paymentStatus as string | undefined,
    });

    await setCache(cacheKey, orders);

    res.status(200).json({
      success: true,
      source: "db",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching artist orders:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch orders",
    });
  }
};

export const getArtistOrderById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    const { orderId } = req.params;

    if (!artistId || !orderId)
      throw new Error("Unauthorized or missing order ID");

    const cacheKey = `artist_order:${artistId}:${orderId}`;
    const cachedOrder = await getCache(cacheKey);

    if (cachedOrder) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedOrder,
      });
    }

    const order = await orderService.getArtistOrderById(orderId, artistId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you don't have access to this order",
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

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!artistId || !orderId)
      throw new Error("Unauthorized or missing order ID");

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Validate status values
    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: " + validStatuses.join(", "),
      });
    }

    const order = await orderService.updateOrderStatus(
      orderId,
      artistId,
      status
    );

    // Clear related caches
    await deleteCache(`artist_order:${artistId}:${orderId}`);
    // Clear artist orders list cache (all variations)
    const cachePattern = `artist_orders:${artistId}:*`;
    // Note: You might need to implement a pattern-based cache clearing function

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to update order status",
    });
  }
};

export const updateOrderPaymentStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    const { orderId } = req.params;
    const { paymentStatus, transactionId } = req.body;

    if (!artistId || !orderId)
      throw new Error("Unauthorized or missing order ID");

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    // Validate payment status values
    const validPaymentStatuses = ["unpaid", "paid", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status. Valid statuses are: " +
          validPaymentStatuses.join(", "),
      });
    }

    const order = await orderService.updateOrderPaymentStatus(
      orderId,
      artistId,
      {
        paymentStatus,
        transactionId,
      }
    );

    // Clear related caches
    await deleteCache(`artist_order:${artistId}:${orderId}`);
    // Clear artist orders list cache (all variations)
    const cachePattern = `artist_orders:${artistId}:*`;
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

export const getOrderItemsByArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { page = "1", limit = "10", status, paymentStatus } = req.query;

    const cacheKey = `artist_order_items:${artistId}:page:${page}:limit:${limit}:status:${
      status || "all"
    }:payment:${paymentStatus || "all"}`;
    const cachedOrderItems = await getCache(cacheKey);

    if (cachedOrderItems) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedOrderItems,
      });
    }

    const orderItems = await orderService.getOrderItemsByArtist(artistId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string | undefined,
      paymentStatus: paymentStatus as string | undefined,
    });

    await setCache(cacheKey, orderItems);

    res.status(200).json({
      success: true,
      source: "db",
      data: orderItems,
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch order items",
    });
  }
};

export const bulkUpdateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    const { orderIds, status } = req.body;

    if (!artistId) throw new Error("Unauthorized");

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs array is required and cannot be empty",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Validate status values
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: " + validStatuses.join(", "),
      });
    }

    const updatedOrders = await orderService.bulkUpdateOrderStatus(
      orderIds,
      artistId,
      status
    );

    // Clear related caches for all updated orders
    for (const orderId of orderIds) {
      await deleteCache(`artist_order:${artistId}:${orderId}`);
    }
    // Clear artist orders list cache (all variations)
    const cachePattern = `artist_orders:${artistId}:*`;
    // Note: You might need to implement a pattern-based cache clearing function

    res.status(200).json({
      success: true,
      message: `${updatedOrders.length} orders updated successfully`,
      data: updatedOrders,
    });
  } catch (error) {
    console.error("Error bulk updating order status:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to bulk update order status",
    });
  }
};
