import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ReviewData = {
  rating: number;
  title: string;
  text: string;
};

export const addReview = async (
  buyerId: string,
  productId: string,
  { rating, title, text }: ReviewData
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { artist: true },
  });

  if (!product) throw new Error("Product not found");

  const existing = await prisma.review.findFirst({
    where: {
      buyerId,
      productId,
    },
  });

  if (existing) throw new Error("You have already reviewed this product");

  return await prisma.review.create({
    data: {
      buyerId,
      productId,
      artistId: product.artistId,
      rating,
      title,
      text,
    },
    include: {
      buyer: true,
      product: true,
      artist: true,
    },
  });
};

export const getReviewsByProduct = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const updateReview = async (
  buyerId: string,
  reviewId: string,
  { rating, title, text }: ReviewData
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.buyerId !== buyerId)
    throw new Error("Review not found or unauthorized");

  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating,
      title,
      text,
    },
  });
};

export const deleteReview = async (buyerId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.buyerId !== buyerId)
    throw new Error("Review not found or unauthorized");

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};
