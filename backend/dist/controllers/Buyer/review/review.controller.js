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
exports.deleteReview = exports.updateReview = exports.getReviewsByProduct = exports.addReview = void 0;
const reviewService = __importStar(require("../../../services/Buyer/review/review.service"));
const cache_1 = require("../../../helpers/cache");
// Create a new review
const addReview = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
        const { productId } = req.params;
        const { rating, title, text } = req.body;
        const review = await reviewService.addReview(buyerId, productId, {
            rating,
            title,
            text,
        });
        // Clear related caches after adding review
        await (0, cache_1.deleteCache)(`reviews:product:${productId}`);
        await (0, cache_1.deleteCache)(`reviews:buyer:${buyerId}`);
        res.status(201).json(review);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addReview = addReview;
// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const cacheKey = `reviews:product:${productId}`;
        const cachedReviews = await (0, cache_1.getCache)(cacheKey);
        if (cachedReviews) {
            return res.json({ source: "cache", data: cachedReviews });
        }
        const reviews = await reviewService.getReviewsByProduct(productId);
        await (0, cache_1.setCache)(cacheKey, reviews);
        res.json({ source: "db", data: reviews });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getReviewsByProduct = getReviewsByProduct;
// Update a review
const updateReview = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
        const { reviewId, rating, title, text } = req.body;
        const updatedReview = await reviewService.updateReview(buyerId, reviewId, {
            rating,
            title,
            text,
        });
        // Clear related caches after updating review
        // Note: We need productId to clear product reviews cache
        // You might need to get the review first to know the productId
        await (0, cache_1.deleteCache)(`review:${reviewId}`);
        await (0, cache_1.deleteCache)(`reviews:buyer:${buyerId}`);
        // If you have productId available: await deleteCache(`reviews:product:${productId}`);
        res.json(updatedReview);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateReview = updateReview;
// Delete a review
const deleteReview = async (req, res) => {
    try {
        const buyerId = req.user?.id;
        if (!buyerId)
            throw new Error("Unauthorized");
        const { reviewId } = req.body;
        // You might want to get the review first to know the productId for cache clearing
        // const existingReview = await reviewService.getReviewById(reviewId);
        // const productId = existingReview?.productId;
        await reviewService.deleteReview(buyerId, reviewId);
        // Clear related caches after deleting review
        await (0, cache_1.deleteCache)(`review:${reviewId}`);
        await (0, cache_1.deleteCache)(`reviews:buyer:${buyerId}`);
        // If you have productId available: await deleteCache(`reviews:product:${productId}`);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteReview = deleteReview;
//# sourceMappingURL=review.controller.js.map