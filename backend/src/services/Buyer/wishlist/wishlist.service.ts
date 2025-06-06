import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToWishlist = async (buyerId: string, productId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
  });

  if (existing) {
    throw new Error("Product is already in wishlist");
  }

  return await prisma.wishlist.create({
    data: {
      buyerId,
      productId,
    },
    include: {
      product: true,
    },
  });
};

export const getWishlistByBuyer = async (buyerId: string) => {
  return await prisma.wishlist.findMany({
    where: { buyerId },
    include: { product: true },
  });
};

export const removeFromWishlist = async (
  buyerId: string,
  productId: string
) => {
  return await prisma.wishlist.delete({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
  });
};
