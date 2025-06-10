"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBuyers = exports.deleteBuyer = exports.updateBuyer = exports.getBuyerById = exports.createBuyer = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../../utils/jwt");
const prisma = new client_1.PrismaClient();
const createBuyer = async (data) => {
    const existing = await prisma.buyer.findUnique({
        where: { email: data.email },
    });
    if (existing)
        throw new Error("Email already registered");
    const hashedPassword = await (0, jwt_1.hashPassword)(data.password);
    const buyer = await prisma.buyer.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
    return buyer;
};
exports.createBuyer = createBuyer;
const getBuyerById = async (id) => {
    const buyer = await prisma.buyer.findUnique({
        where: { id },
        select: {
            password: false,
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            createdAt: true,
            addresses: true,
        },
    });
    if (!buyer)
        throw new Error("Buyer not found");
    return buyer;
};
exports.getBuyerById = getBuyerById;
const updateBuyer = async (id, data) => {
    const buyer = await prisma.buyer.update({
        where: { id },
        data,
        select: {
            password: false,
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            createdAt: true,
        },
    });
    return buyer;
};
exports.updateBuyer = updateBuyer;
const deleteBuyer = async (id) => {
    await prisma.buyer.delete({ where: { id } });
    return { message: "Buyer deleted" };
};
exports.deleteBuyer = deleteBuyer;
const listBuyers = async () => {
    return prisma.buyer.findMany({
        select: {
            password: false,
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            createdAt: true,
        },
    });
};
exports.listBuyers = listBuyers;
//# sourceMappingURL=buyer.service.js.map