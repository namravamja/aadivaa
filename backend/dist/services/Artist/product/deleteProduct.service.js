"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const deleteProduct = async (productId, artistId) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!existingProduct)
        throw new Error("Product not found");
    if (existingProduct.artistId !== artistId)
        throw new Error("Not authorized to delete this product");
    await prisma.product.delete({
        where: { id: productId },
    });
    return { message: "Product deleted successfully" };
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=deleteProduct.service.js.map