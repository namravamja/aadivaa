"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuyerOrderStats = exports.updatePaymentStatus = exports.cancelOrder = exports.getOrderById = exports.getBuyerOrders = exports.createOrderFromCart = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrderFromCart = async (buyerId, orderData) => {
    const { paymentMethod, cartItems, addressIds } = orderData;
    try {
        let totalAmount = 0;
        const orderItemsData = [];
        for (const cartItem of cartItems) {
            const itemTotal = parseFloat(cartItem.product.sellingPrice) * cartItem.quantity;
            totalAmount += itemTotal;
            orderItemsData.push({
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                priceAtPurchase: parseFloat(cartItem.product.sellingPrice),
                artistId: cartItem.product.artistId,
            });
        }
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    buyer: { connect: { id: buyerId } },
                    totalAmount,
                    shippingAddress: { connect: { id: addressIds } },
                    paymentMethod,
                    status: "pending",
                    paymentStatus: "unpaid",
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: {
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
                    },
                },
            });
            for (const cartItem of cartItems) {
                const currentStock = parseInt(cartItem.product.availableStock);
                const newStock = currentStock - cartItem.quantity;
                if (newStock < 0) {
                    throw new Error(`Insufficient stock for product: ${cartItem.product.productName}`);
                }
                await tx.product.update({
                    where: { id: cartItem.productId },
                    data: { availableStock: newStock.toString() },
                });
            }
            return newOrder;
        }, {
            timeout: 10000,
        });
        return order;
    }
    catch (error) {
        console.error("Error creating order from cart:", error);
        throw new Error(error.message || "Failed to create order");
    }
};
exports.createOrderFromCart = createOrderFromCart;
const getBuyerOrders = async (buyerId, options = {}) => {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;
    try {
        const whereClause = { buyerId };
        if (status) {
            whereClause.status = status;
        }
        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    productName: true,
                                    productImages: true,
                                    category: true,
                                },
                            },
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
                orderBy: { placedAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.order.count({ where: whereClause }),
        ]);
        return {
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNext: page * limit < totalCount,
                hasPrev: page > 1,
            },
        };
    }
    catch (error) {
        console.error("Error fetching buyer orders:", error);
        throw new Error("Failed to fetch orders");
    }
};
exports.getBuyerOrders = getBuyerOrders;
const getOrderById = async (orderId, buyerId) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                buyerId,
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                artist: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        storeName: true,
                                        email: true,
                                        mobile: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return order;
    }
    catch (error) {
        console.error("Error fetching order by ID:", error);
        throw new Error("Failed to fetch order");
    }
};
exports.getOrderById = getOrderById;
const cancelOrder = async (orderId, buyerId) => {
    try {
        const existingOrder = await prisma.order.findFirst({
            where: {
                id: orderId,
                buyerId,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!existingOrder) {
            throw new Error("Order not found");
        }
        if (existingOrder.status !== "pending") {
            throw new Error("Only pending orders can be cancelled");
        }
        const cancelledOrder = await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: "cancelled",
                    updatedAt: new Date(),
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            for (const orderItem of existingOrder.orderItems) {
                const currentStock = parseInt(orderItem.product.availableStock);
                const restoredStock = currentStock + orderItem.quantity;
                await tx.product.update({
                    where: { id: orderItem.productId },
                    data: { availableStock: restoredStock.toString() },
                });
            }
            return updatedOrder;
        });
        return cancelledOrder;
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        throw new Error(error.message || "Failed to cancel order");
    }
};
exports.cancelOrder = cancelOrder;
const updatePaymentStatus = async (orderId, paymentData) => {
    const { paymentStatus, transactionId } = paymentData;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus,
                ...(transactionId && { transactionId }),
                updatedAt: new Date(),
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                productName: true,
                                productImages: true,
                            },
                        },
                    },
                },
            },
        });
        return updatedOrder;
    }
    catch (error) {
        console.error("Error updating payment status:", error);
        throw new Error("Failed to update payment status");
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
const getBuyerOrderStats = async (buyerId) => {
    try {
        const stats = await prisma.order.groupBy({
            by: ["status"],
            where: { buyerId },
            _count: {
                status: true,
            },
        });
        const totalSpent = await prisma.order.aggregate({
            where: {
                buyerId,
                paymentStatus: "paid",
            },
            _sum: {
                totalAmount: true,
            },
        });
        return {
            ordersByStatus: stats,
            totalSpent: totalSpent._sum.totalAmount || 0,
        };
    }
    catch (error) {
        console.error("Error fetching order stats:", error);
        throw new Error("Failed to fetch order statistics");
    }
};
exports.getBuyerOrderStats = getBuyerOrderStats;
//# sourceMappingURL=order.service.js.map