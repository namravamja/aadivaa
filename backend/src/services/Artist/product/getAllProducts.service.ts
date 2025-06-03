import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async () => {
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
