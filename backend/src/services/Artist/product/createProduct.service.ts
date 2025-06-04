import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface productData {
  productName: string;
  category: string;
  shortDescription: string;
  sellingPrice: string;
  mrp: string;
  availableStock: string;
  skuCode: string;
  productImages: string[];
  weight: string;
  length: string;
  width: string;
  height: string;
  shippingCost: string;
  deliveryTimeEstimate: string;
}

export const createProduct = async (artistId: string, Product: productData) => {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
  });

  if (!artist) throw new Error("Artist not found");

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
