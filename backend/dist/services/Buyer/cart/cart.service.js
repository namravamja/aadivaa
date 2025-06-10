"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.clearCart = exports.getCartByBuyerId = exports.addToCart = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addToCart = async (buyerId, productId, quantity) => {
    const existing = await prisma.cart.findUnique({
        where: {
            buyerId_productId: {
                buyerId,
                productId,
            },
        },
    });
    if (existing) {
        return await prisma.cart.update({
            where: {
                buyerId_productId: {
                    buyerId,
                    productId,
                },
            },
            data: {
                quantity: existing.quantity + quantity,
            },
        });
    }
    return await prisma.cart.create({
        data: {
            buyerId,
            productId,
            quantity,
        },
        include: {
            product: true,
        },
    });
};
exports.addToCart = addToCart;
const getCartByBuyerId = async (buyerId) => {
    try {
        const items = await prisma.cart.findMany({
            where: { buyerId },
            include: {
                product: {
                    include: {
                        artist: {
                            select: {
                                id: true,
                                fullName: true,
                                storeName: true,
                            },
                        },
                    },
                },
            },
        });
        return items;
    }
    catch (error) {
        throw new Error("Failed to get cart items");
    }
};
exports.getCartByBuyerId = getCartByBuyerId;
const clearCart = async (buyerId) => {
    try {
        await prisma.cart.deleteMany({
            where: { buyerId },
        });
    }
    catch (error) {
        throw new Error("Failed to clear cart");
    }
};
exports.clearCart = clearCart;
const updateCartItem = async (buyerId, productId, quantity) => {
    return await prisma.cart.update({
        where: {
            buyerId_productId: {
                buyerId,
                productId,
            },
        },
        data: { quantity },
    });
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (buyerId, productId) => {
    return await prisma.cart.delete({
        where: {
            buyerId_productId: {
                buyerId,
                productId,
            },
        },
    });
};
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=cart.service.js.map