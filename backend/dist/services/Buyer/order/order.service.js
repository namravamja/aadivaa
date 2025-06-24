"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuyerOrderStats = exports.updatePaymentStatus = exports.cancelOrder = exports.getOrderById = exports.getBuyerOrders = exports.createOrderFromCart = void 0;
const client_1 = require("@prisma/client");
const orderMailer_1 = require("../../../helpers/orderMailer");
const prisma = new client_1.PrismaClient();
const createOrderFromCart = async (buyerId, orderData) => {
    const { shippingAddressId, paymentMethod, cartItems } = orderData;
    // Calculate totals
    let totalAmount = 0;
    const orderItems = cartItems.map((item) => {
        const itemTotal = parseFloat(item.product.sellingPrice) * item.quantity;
        totalAmount += itemTotal;
        return {
            productId: item.product.id,
            quantity: item.quantity,
            priceAtPurchase: parseFloat(item.product.sellingPrice),
            artistId: item.product.artistId,
        };
    });
    const subtotal = totalAmount;
    const shipping = subtotal >= 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const finalAmount = subtotal + shipping + tax;
    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                buyer: {
                    connect: {
                        id: buyerId,
                    },
                },
                totalAmount: finalAmount, // Convert to paise
                shippingAddress: {
                    connect: {
                        id: shippingAddressId, // Single ID instead of array
                    },
                },
                paymentMethod,
                status: "pending",
                paymentStatus: paymentMethod === "cod" ? "pending" : "unpaid",
                orderItems: {
                    create: orderItems,
                },
            },
            include: {
                buyer: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                shippingAddress: true,
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
        return newOrder;
    }, {
        timeout: 20000, // increase from 10000
        maxWait: 10000,
    });
    // Send confirmation email
    await (0, orderMailer_1.sendOrderConfirmationEmail)(order.buyer.email, `${order.shippingAddress?.firstName ?? ""} ${order.shippingAddress?.lastName ?? ""}`, order.id, order.orderItems.map((item) => ({
        name: item.product.productName,
        quantity: item.quantity,
        price: item.priceAtPurchase,
    })), order.totalAmount, {
        name: `${order.shippingAddress?.firstName ?? ""} ${order.shippingAddress?.lastName ?? ""}`,
        address: `${order.shippingAddress?.street ?? ""} ${order.shippingAddress?.apartment || ""}`,
        city: order.shippingAddress?.city ?? "",
        state: order.shippingAddress?.state ?? "",
        zip: order.shippingAddress?.postalCode ?? "",
        country: order.shippingAddress?.country ?? "",
        phone: order.shippingAddress?.phone || "N/A",
    }, order.placedAt.toISOString(), order.paymentMethod);
    return order;
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
                buyer: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                shippingAddress: true,
                orderItems: {
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
                                availableStock: true,
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
    const { paymentStatus } = paymentData;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus,
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