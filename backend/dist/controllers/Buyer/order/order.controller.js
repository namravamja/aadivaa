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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.cancelOrder = exports.getOrderById = exports.getBuyerOrders = exports.verifyRazorpayPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const orderService = __importStar(require("../../../services/Buyer/order/order.service"));
const cartService = __importStar(require("../../../services/Buyer/cart/cart.service"));
const cache_1 = require("../../../helpers/cache");
const razorpay_1 = require("../../../utils/razorpay");
const createOrder = async (req, res) => {
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
            const itemTotal = parseFloat(cartItem.product.sellingPrice) * cartItem.quantity;
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
                receipt: `rcpt_${Date.now()}`,
                notes: {
                    buyer_id: buyerId,
                    shippingAddressId: shippingAddressId.toString(),
                },
            };
            const razorOrder = await razorpay_1.razorpay.orders.create(razorpayOrderOptions);
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
        const order = await orderService.createOrderFromCart(buyerId, {
            shippingAddressId,
            paymentMethod,
            cartItems,
        });
        await cartService.clearCart(buyerId);
        await (0, cache_1.deleteCache)(`buyer_orders:${buyerId}:*`);
        await (0, cache_1.deleteCache)(`cart:${buyerId}`);
        // ✨ Manually set fresh orders in Redis to avoid stale delay
        const updatedOrders = await orderService.getBuyerOrders(buyerId, {
            page: 1,
            limit: 10,
        });
        await (0, cache_1.setCache)(`buyer_orders:${buyerId}:page:1:limit:10:status:all`, updatedOrders);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            data: order,
        });
    }
    catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create order.",
        });
    }
};
exports.createOrder = createOrder;
const verifyRazorpayPayment = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const hmac = crypto_1.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");
        if (generatedSignature !== razorpay_signature) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid signature" });
        }
        const razorpayOrder = await razorpay_1.razorpay.orders.fetch(razorpay_order_id);
        const shippingAddressId = parseInt(String(razorpayOrder.notes?.shippingAddressId || "0"));
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
            shippingAddressId,
            paymentMethod: "razorpay",
            cartItems,
        });
        await orderService.updatePaymentStatus(order.id, {
            paymentStatus: "paid",
        });
        await cartService.clearCart(buyerId);
        await (0, cache_1.deleteCache)(`buyer_orders:${buyerId}:*`);
        await (0, cache_1.deleteCache)(`cart:${buyerId}`);
        // ✨ Manually set fresh orders in Redis
        const updatedOrders = await orderService.getBuyerOrders(buyerId, {
            page: 1,
            limit: 10,
        });
        await (0, cache_1.setCache)(`buyer_orders:${buyerId}:page:1:limit:10:status:all`, updatedOrders);
        return res.status(200).json({
            success: true,
            message: "Payment verified and order created successfully.",
            data: order,
        });
    }
    catch (error) {
        console.error("Error in verifyRazorpayPayment:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Verification failed.",
        });
    }
};
exports.verifyRazorpayPayment = verifyRazorpayPayment;
const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
        const { page = "1", limit = "10", status } = req.query;
        const cacheKey = `buyer_orders:${buyerId}:page:${page}:limit:${limit}:status:${status || "all"}`;
        const cachedOrders = await (0, cache_1.getCache)(cacheKey);
        if (cachedOrders) {
            return res.status(200).json({
                success: true,
                source: "cache",
                data: cachedOrders,
            });
        }
        const orders = await orderService.getBuyerOrders(buyerId, {
            page: parseInt(page),
            limit: parseInt(limit),
            status: status,
        });
        await (0, cache_1.setCache)(cacheKey, orders);
        res.status(200).json({
            success: true,
            source: "db",
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
        const cacheKey = `buyer_order:${buyerId}:${orderId}`;
        const cachedOrder = await (0, cache_1.getCache)(cacheKey);
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
        await (0, cache_1.setCache)(cacheKey, order);
        res.status(200).json({
            success: true,
            source: "db",
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
        // Clear related caches after order cancellation
        await (0, cache_1.deleteCache)(`buyer_order:${buyerId}:${orderId}`);
        // Clear buyer orders list cache (all variations)
        const cachePattern = `buyer_orders:${buyerId}:*`;
        // Note: You might need to implement a pattern-based cache clearing function
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
        const { paymentStatus } = req.body;
        const order = await orderService.updatePaymentStatus(orderId, {
            paymentStatus,
        });
        // Clear order-related caches (we don't have buyerId here, so clear by orderId pattern)
        await (0, cache_1.deleteCache)(`buyer_order:*:${orderId}`);
        // Note: You might need to implement a pattern-based cache clearing function
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