"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewsByProduct = exports.addReview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addReview = async (buyerId, productId, { rating, title, text }) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { artist: true },
    });
    if (!product)
        throw new Error("Product not found");
    const existing = await prisma.review.findFirst({
        where: {
            buyerId,
            productId,
        },
    });
    if (existing)
        throw new Error("You have already reviewed this product");
    return await prisma.review.create({
        data: {
            buyerId,
            productId,
            artistId: product.artistId,
            rating,
            title,
            text,
        },
        include: {
            buyer: true,
            product: true,
            artist: true,
        },
    });
};
exports.addReview = addReview;
const getReviewsByProduct = async (productId) => {
    return await prisma.review.findMany({
        where: { productId },
        include: {
            buyer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });
};
exports.getReviewsByProduct = getReviewsByProduct;
const updateReview = async (buyerId, reviewId, { rating, title, text }) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review || review.buyerId !== buyerId)
        throw new Error("Review not found or unauthorized");
    return await prisma.review.update({
        where: { id: reviewId },
        data: {
            rating,
            title,
            text,
        },
    });
};
exports.updateReview = updateReview;
const deleteReview = async (buyerId, reviewId) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review || review.buyerId !== buyerId)
        throw new Error("Review not found or unauthorized");
    return await prisma.review.delete({
        where: { id: reviewId },
    });
};
exports.deleteReview = deleteReview;
//# sourceMappingURL=review.service.js.map