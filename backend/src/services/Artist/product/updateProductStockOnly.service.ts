import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProductStockOnly = async (
  productId: string,
  artistId: string,
  availableStock: string
) => {
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
