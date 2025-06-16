"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStockOnly = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateProductStockOnly = async (productId, artistId, availableStock) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    if (product.artistId !== artistId) {
        throw new Error("Not authorized to update this product");
    }
    const updated = await prisma.product.update({
        where: { id: productId },
        data: { availableStock },
    });
    return updated;
};
exports.updateProductStockOnly = updateProductStockOnly;
//# sourceMappingURL=updateProductStockOnly.service.js.map