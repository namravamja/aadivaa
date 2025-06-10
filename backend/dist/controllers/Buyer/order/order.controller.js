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
exports.updatePaymentStatus = exports.cancelOrder = exports.getOrderById = exports.getBuyerOrders = exports.createOrder = void 0;
const orderService = __importStar(require("../../../services/Buyer/order/order.service"));
const cartService = __importStar(require("../../../services/Buyer/cart/cart.service"));
const createOrder = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
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
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create order",
        });
    }
};
exports.createOrder = createOrder;
const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
        const { page = "1", limit = "10", status } = req.query;
        const orders = await orderService.getBuyerOrders(buyerId, {
            page: parseInt(page),
            limit: parseInt(limit),
            status: status,
        });
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        console.error("Error fetching buyer orders:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders",
        });
    }
};
exports.getBuyerOrders = getBuyerOrders;
const getOrderById = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        const { orderId } = req.params;
        if (!buyerId || !orderId)
            throw new Error("Unauthorized or missing order ID");
        const order = await orderService.getOrderById(orderId, buyerId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
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
exports.getOrderById = getOrderById;
const cancelOrder = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        const { orderId } = req.params;
        if (!buyerId || !orderId)
            throw new Error("Unauthorized or missing order ID");
        const order = await orderService.cancelOrder(orderId, buyerId);
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to cancel order",
        });
    }
};
exports.cancelOrder = cancelOrder;
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus, transactionId } = req.body;
        const order = await orderService.updatePaymentStatus(orderId, {
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
exports.updatePaymentStatus = updatePaymentStatus;
//# sourceMappingURL=order.controller.js.map