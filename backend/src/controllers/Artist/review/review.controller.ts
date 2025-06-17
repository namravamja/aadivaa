import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
  body: any;
}

// Get all reviews written on products of the authenticated artist
export const getReviewsByArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const reviews = await prisma.review.findMany({
      where: { artistId },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            productName: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateReviewVerificationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { reviewId } = req.body;
    const { verified } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.artistId !== artistId)
      throw new Error("Review not found or unauthorized");

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { verified },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteReviewByArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { reviewId } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.artistId !== artistId)
      throw new Error("Review not found or unauthorized");

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
