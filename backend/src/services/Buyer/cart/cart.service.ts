import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart = async (
  buyerId: string,
  productId: string,
  quantity: number
) => {
  const existing = await prisma.cart.findUnique({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
  });

  if (existing) {
    return await prisma.cart.update({
      where: {
        buyerId_productId: {
          buyerId,
          productId,
        },
      },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
  }

  return await prisma.cart.create({
    data: {
      buyerId,
      productId,
      quantity,
    },
    include: {
      product: true,
    },
  });
};

export const getCartByBuyer = async (buyerId: string) => {
  return await prisma.cart.findMany({
    where: { buyerId },
    include: { product: true },
  });
};

export const updateCartItem = async (
  buyerId: string,
  productId: string,
  quantity: number
) => {
  return await prisma.cart.update({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
    data: { quantity },
  });
};

export const removeFromCart = async (buyerId: string, productId: string) => {
  return await prisma.cart.delete({
    where: {
      buyerId_productId: {
        buyerId,
        productId,
      },
    },
  });
};
