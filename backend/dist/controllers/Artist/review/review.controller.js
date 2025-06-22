"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewByArtist = exports.updateReviewVerificationStatus = exports.getReviewsByArtist = void 0;
const client_1 = require("@prisma/client");
const cache_1 = require("../../../helpers/cache");
const prisma = new client_1.PrismaClient();
// Get all reviews written on products of the authenticated artist
const getReviewsByArtist = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const cacheKey = `reviews:artist:${artistId}`;
        const cachedReviews = await (0, cache_1.getCache)(cacheKey);
        if (cachedReviews) {
            return res.json({ source: "cache", data: cachedReviews });
        }
        const reviews = await prisma.review.findMany({
            where: { artistId },
            include: {
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        productName: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
        await (0, cache_1.setCache)(cacheKey, reviews);
        res.json({ source: "db", data: reviews });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getReviewsByArtist = getReviewsByArtist;
const updateReviewVerificationStatus = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const { reviewId } = req.body;
        const { verified } = req.body;
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review || review.artistId !== artistId)
            throw new Error("Review not found or unauthorized");
        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: { verified },
        });
        // Clear related caches
        await (0, cache_1.deleteCache)(`reviews:artist:${artistId}`);
        await (0, cache_1.deleteCache)(`review:${reviewId}`);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateReviewVerificationStatus = updateReviewVerificationStatus;
const deleteReviewByArtist = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const { reviewId } = req.body;
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review || review.artistId !== artistId)
            throw new Error("Review not found or unauthorized");
        await prisma.review.delete({
            where: { id: reviewId },
        });
        // Clear related caches
        await (0, cache_1.deleteCache)(`reviews:artist:${artistId}`);
        await (0, cache_1.deleteCache)(`review:${reviewId}`);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteReviewByArtist = deleteReviewByArtist;
//# sourceMappingURL=review.controller.js.map