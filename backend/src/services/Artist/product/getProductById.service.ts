import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      artist: true,
    },
  });

  if (!product) throw new Error("Product not found");

  return product;
};
