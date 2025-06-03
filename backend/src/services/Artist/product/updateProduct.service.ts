import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProduct = async (
  productId: string,
  data: {
    productName?: string;
    category?: string;
    shortDescription?: string;

    sellingPrice?: string;
    mrp?: string;
    availableStock?: string;
    skuCode?: string;

    productImages?: string[];

    weight?: string;
    dimensions?: {
      length?: string;
      width?: string;
      height?: string;
    };
    shippingCost?: string;
    deliveryTimeEstimate?: string;
  }
) => {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existing) throw new Error("Product not found");

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      length: data.dimensions?.length,
      width: data.dimensions?.width,
      height: data.dimensions?.height,
    },
  });

  return updatedProduct;
};
