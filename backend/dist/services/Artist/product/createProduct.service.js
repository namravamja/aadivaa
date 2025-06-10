"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduct = async (artistId, Product) => {
    const artist = await prisma.artist.findUnique({
        where: { id: artistId },
    });
    if (!artist)
        throw new Error("Artist not found");
    const product = await prisma.product.create({
        data: {
            productName: Product.productName,
            category: Product.category,
            shortDescription: Product.shortDescription,
            sellingPrice: Product.sellingPrice,
            mrp: Product.mrp,
            availableStock: Product.availableStock,
            skuCode: Product.skuCode,
            productImages: Product.productImages,
            weight: Product.weight,
            length: Product.length,
            width: Product.width,
            height: Product.height,
            shippingCost: Product.shippingCost,
            deliveryTimeEstimate: Product.deliveryTimeEstimate,
            artist: {
                connect: { id: artistId },
            },
        },
    });
    return product;
};
exports.createProduct = createProduct;
//# sourceMappingURL=createProduct.service.js.map