"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateOrderStatus = exports.getOrderItemsByArtist = exports.updateOrderPaymentStatus = exports.updateOrderStatus = exports.getArtistOrderById = exports.getArtistOrders = void 0;
const orderService = __importStar(require("../../../services/Artist/order/order.service"));
const getArtistOrders = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const { page = "1", limit = "10", status, paymentStatus } = req.query;
        const orders = await orderService.getArtistOrders(artistId, {
            page: parseInt(page),
            limit: parseInt(limit),
            status: status,
            paymentStatus: paymentStatus,
        });
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        console.error("Error fetching artist orders:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders",
        });
    }
};
exports.getArtistOrders = getArtistOrders;
const getArtistOrderById = async (req, res) => {
    try {
        const artistId = req.user?.id;
        const { orderId } = req.params;
        if (!artistId || !orderId)
            throw new Error("Unauthorized or missing order ID");
        const order = await orderService.getArtistOrderById(orderId, artistId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or you don't have access to this order",
            });
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order",
        });
    }
};
exports.getArtistOrderById = getArtistOrderById;
const updateOrderStatus = async (req, res) => {
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
                message: "Invalid status. Valid statuses are: " + validStatuses.join(", "),
            });
        }
        const order = await orderService.updateOrderStatus(orderId, artistId, status);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update order status",
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const updateOrderPaymentStatus = async (req, res) => {
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
                message: "Invalid payment status. Valid statuses are: " +
                    validPaymentStatuses.join(", "),
            });
        }
        const order = await orderService.updateOrderPaymentStatus(orderId, artistId, {
            paymentStatus,
            transactionId,
        });
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update payment status",
        });
    }
};
exports.updateOrderPaymentStatus = updateOrderPaymentStatus;
const getOrderItemsByArtist = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const { page = "1", limit = "10", status, paymentStatus } = req.query;
        const orderItems = await orderService.getOrderItemsByArtist(artistId, {
            page: parseInt(page),
            limit: parseInt(limit),
            status: status,
            paymentStatus: paymentStatus,
        });
        res.status(200).json({
            success: true,
            data: orderItems,
        });
    }
    catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order items",
        });
    }
};
exports.getOrderItemsByArtist = getOrderItemsByArtist;
const bulkUpdateOrderStatus = async (req, res) => {
    try {
        const artistId = req.user?.id;
        const { orderIds, status } = req.body;
        if (!artistId)
            throw new Error("Unauthorized");
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
                message: "Invalid status. Valid statuses are: " + validStatuses.join(", "),
            });
        }
        const updatedOrders = await orderService.bulkUpdateOrderStatus(orderIds, artistId, status);
        res.status(200).json({
            success: true,
            message: `${updatedOrders.length} orders updated successfully`,
            data: updatedOrders,
        });
    }
    catch (error) {
        console.error("Error bulk updating order status:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to bulk update order status",
        });
    }
};
exports.bulkUpdateOrderStatus = bulkUpdateOrderStatus;
//# sourceMappingURL=order.controller.js.map