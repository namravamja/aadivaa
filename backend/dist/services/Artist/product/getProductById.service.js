"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductById = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
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
    if (!product)
        throw new Error("Product not found");
    return product;
};
exports.getProductById = getProductById;
//# sourceMappingURL=getProductById.service.js.map