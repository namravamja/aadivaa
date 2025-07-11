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
exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const wishlistService = __importStar(require("../../../services/Buyer/wishlist/wishlist.service"));
const cache_1 = require("../../../helpers/cache");
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { productId } = req.body;
        const item = await wishlistService.addToWishlist(userId, productId);
        // Clear wishlist cache after adding item
        await (0, cache_1.deleteCache)(`wishlist:${userId}`);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addToWishlist = addToWishlist;
const getWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const cacheKey = `wishlist:${userId}`;
        const cachedWishlist = await (0, cache_1.getCache)(cacheKey);
        if (cachedWishlist) {
            return res.json({ source: "cache", data: cachedWishlist });
        }
        const items = await wishlistService.getWishlistByBuyer(userId);
        await (0, cache_1.setCache)(cacheKey, items);
        res.json({ source: "db", data: items });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getWishlist = getWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { productId } = req.body;
        await wishlistService.removeFromWishlist(userId, productId);
        // Clear wishlist cache after removing item
        await (0, cache_1.deleteCache)(`wishlist:${userId}`);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=wishlist.controller.js.map