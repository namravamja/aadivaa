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
exports.getCartByBuyerId = exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = void 0;
const cartService = __importStar(require("../../../services/Buyer/cart/cart.service"));
const cache_1 = require("../../../helpers/cache");
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { productId, quantity } = req.body;
        const item = await cartService.addToCart(userId, productId, quantity);
        // Clear cart cache after adding item
        await (0, cache_1.deleteCache)(`cart:${userId}`);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { productId } = req.body;
        const { quantity } = req.body;
        const item = await cartService.updateCartItem(userId, productId, quantity);
        // Clear cart cache after updating item
        await (0, cache_1.deleteCache)(`cart:${userId}`);
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { productId } = req.body;
        await cartService.removeFromCart(userId, productId);
        // Clear cart cache after removing item
        await (0, cache_1.deleteCache)(`cart:${userId}`);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        await cartService.clearCart(userId);
        // Clear cart cache after clearing cart
        await (0, cache_1.deleteCache)(`cart:${userId}`);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.clearCart = clearCart;
const getCartByBuyerId = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const cacheKey = `cart:${userId}`;
        const cachedCart = await (0, cache_1.getCache)(cacheKey);
        if (cachedCart) {
            return res.json({ source: "cache", data: cachedCart });
        }
        const cart = await cartService.getCartByBuyerId(userId);
        await (0, cache_1.setCache)(cacheKey, cart);
        res.json({ source: "db", data: cart });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getCartByBuyerId = getCartByBuyerId;
//# sourceMappingURL=cart.controller.js.map