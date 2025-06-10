"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateProduct = async (productId, artistId, inputData) => {
    // 1. Check if product exists
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!existingProduct)
        throw new Error("Product not found");
    // 2. Check if artist owns the product
    if (existingProduct.artistId !== artistId) {
        throw new Error("Not authorized to update this product");
    }
    // 3. Filter and apply only updatable fields
    const allowedFields = [
        "productName",
        "category",
        "shortDescription",
        "sellingPrice",
        "mrp",
        "availableStock",
        "skuCode",
        "productImages",
        "weight",
        "length",
        "width",
        "height",
        "shippingCost",
        "deliveryTimeEstimate",
    ];
    const dataToUpdate = {};
    for (const key of allowedFields) {
        if (key in inputData) {
            dataToUpdate[key] = inputData[key];
        }
    }
    // 4. Perform the update
    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: dataToUpdate,
    });
    return updatedProduct;
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=updateProduct.service.js.map