"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            artist: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    storeName: true,
                },
            },
        },
    });
    return products;
};
exports.getAllProducts = getAllProducts;
//# sourceMappingURL=getAllProducts.service.js.map