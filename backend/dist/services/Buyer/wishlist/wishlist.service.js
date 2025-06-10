"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.getWishlistByBuyer = exports.addToWishlist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addToWishlist = async (buyerId, productId) => {
    const existing = await prisma.wishlist.findUnique({
        where: {
            buyerId_productId: {
                buyerId,
                productId,
            },
        },
    });
    if (existing) {
        throw new Error("Product is already in wishlist");
    }
    return await prisma.wishlist.create({
        data: {
            buyerId,
            productId,
        },
        include: {
            product: true,
        },
    });
};
exports.addToWishlist = addToWishlist;
const getWishlistByBuyer = async (buyerId) => {
    return await prisma.wishlist.findMany({
        where: { buyerId },
        include: { product: true },
    });
};
exports.getWishlistByBuyer = getWishlistByBuyer;
const removeFromWishlist = async (buyerId, productId) => {
    return await prisma.wishlist.delete({
        where: {
            buyerId_productId: {
                buyerId,
                productId,
            },
        },
    });
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=wishlist.service.js.map