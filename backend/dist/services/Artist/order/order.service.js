"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateOrderStatus = exports.getOrderItemsByArtist = exports.updateOrderPaymentStatus = exports.updateOrderStatus = exports.getArtistOrderById = exports.getArtistOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getArtistOrders = async (artistId, filters) => {
    const { page, limit, status, paymentStatus } = filters;
    const skip = (page - 1) * limit;
    const whereCondition = {
        orderItems: {
            some: {
                artistId: artistId,
            },
        },
    };
    if (status) {
        whereCondition.status = status;
    }
    if (paymentStatus) {
        whereCondition.paymentStatus = paymentStatus;
    }
    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where: whereCondition,
            include: {
                buyer: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                orderItems: {
                    where: {
                        artistId: artistId,
                    },
                    include: {
                        product: {
                            select: {
                                id: true,
                                productName: true,
                                category: true,
                                productImages: true,
                                skuCode: true,
                            },
                        },
                    },
                },
                shippingAddress: true,
            },
            orderBy: {
                placedAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.order.count({
            where: whereCondition,
        }),
    ]);
    return {
        orders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNextPage: page < Math.ceil(totalCount / limit),
            hasPreviousPage: page > 1,
        },
    };
};
exports.getArtistOrders = getArtistOrders;
const getArtistOrderById = async (orderId, artistId) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            orderItems: {
                some: {
                    artistId: artistId,
                },
            },
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                },
            },
            orderItems: {
                where: {
                    artistId: artistId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            productName: true,
                            category: true,
                            shortDescription: true,
                            productImages: true,
                            skuCode: true,
                            weight: true,
                            length: true,
                            width: true,
                            height: true,
                        },
                    },
                },
            },
            shippingAddress: true,
        },
    });
    return order;
};
exports.getArtistOrderById = getArtistOrderById;
const updateOrderStatus = async (orderId, artistId, status) => {
    // First verify that the artist has items in this order
    const orderExists = await prisma.order.findFirst({
        where: {
            id: orderId,
            orderItems: {
                some: {
                    artistId: artistId,
                },
            },
        },
    });
    if (!orderExists) {
        throw new Error("Order not found or you don't have permission to update this order");
    }
    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status,
            updatedAt: new Date(),
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            },
            orderItems: {
                where: {
                    artistId: artistId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            productName: true,
                            category: true,
                            productImages: true,
                        },
                    },
                },
            },
        },
    });
    return updatedOrder;
};
exports.updateOrderStatus = updateOrderStatus;
const updateOrderPaymentStatus = async (orderId, artistId, paymentData) => {
    // First verify that the artist has items in this order
    const orderExists = await prisma.order.findFirst({
        where: {
            id: orderId,
            orderItems: {
                some: {
                    artistId: artistId,
                },
            },
        },
    });
    if (!orderExists) {
        throw new Error("Order not found or you don't have permission to update this order");
    }
    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            paymentStatus: paymentData.paymentStatus,
            updatedAt: new Date(),
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            },
            orderItems: {
                where: {
                    artistId: artistId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            productName: true,
                            category: true,
                            productImages: true,
                        },
                    },
                },
            },
        },
    });
    return updatedOrder;
};
exports.updateOrderPaymentStatus = updateOrderPaymentStatus;
const getOrderItemsByArtist = async (artistId, filters) => {
    const { page, limit, status, paymentStatus } = filters;
    const skip = (page - 1) * limit;
    const whereCondition = {
        artistId: artistId,
    };
    // Filter by order status and payment status if provided
    const orderWhereCondition = {};
    if (status) {
        orderWhereCondition.status = status;
    }
    if (paymentStatus) {
        orderWhereCondition.paymentStatus = paymentStatus;
    }
    if (Object.keys(orderWhereCondition).length > 0) {
        whereCondition.order = orderWhereCondition;
    }
    const [orderItems, totalCount] = await Promise.all([
        prisma.orderItem.findMany({
            where: whereCondition,
            include: {
                product: {
                    select: {
                        id: true,
                        productName: true,
                        category: true,
                        productImages: true,
                        skuCode: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        status: true,
                        paymentStatus: true,
                        totalAmount: true,
                        placedAt: true,
                        buyer: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        shippingAddress: true,
                    },
                },
            },
            orderBy: {
                order: {
                    placedAt: "desc",
                },
            },
            skip,
            take: limit,
        }),
        prisma.orderItem.count({
            where: whereCondition,
        }),
    ]);
    return {
        orderItems,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNextPage: page < Math.ceil(totalCount / limit),
            hasPreviousPage: page > 1,
        },
    };
};
exports.getOrderItemsByArtist = getOrderItemsByArtist;
const bulkUpdateOrderStatus = async (orderIds, artistId, status) => {
    // First verify that the artist has items in all these orders
    const validOrders = await prisma.order.findMany({
        where: {
            id: {
                in: orderIds,
            },
            orderItems: {
                some: {
                    artistId: artistId,
                },
            },
        },
        select: {
            id: true,
        },
    });
    const validOrderIds = validOrders.map((order) => order.id);
    if (validOrderIds.length === 0) {
        throw new Error("No valid orders found for bulk update");
    }
    if (validOrderIds.length !== orderIds.length) {
        throw new Error(`Only ${validOrderIds.length} out of ${orderIds.length} orders can be updated`);
    }
    const updatedOrders = await prisma.order.updateMany({
        where: {
            id: {
                in: validOrderIds,
            },
        },
        data: {
            status,
            updatedAt: new Date(),
        },
    });
    // Return the updated orders with full details
    const orders = await prisma.order.findMany({
        where: {
            id: {
                in: validOrderIds,
            },
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            },
            orderItems: {
                where: {
                    artistId: artistId,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            productName: true,
                            category: true,
                            productImages: true,
                        },
                    },
                },
            },
        },
    });
    return orders;
};
exports.bulkUpdateOrderStatus = bulkUpdateOrderStatus;
//# sourceMappingURL=order.service.js.map