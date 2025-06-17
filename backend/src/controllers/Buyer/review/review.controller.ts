import { Request, Response } from "express";
import * as reviewService from "../../../services/Buyer/review/review.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}
// Create a new review
export const addReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) throw new Error("Unauthorized");

    const { productId } = req.params;
    const { rating, title, text } = req.body;

    const review = await reviewService.addReview(buyerId, productId, {
      rating,
      title,
      text,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// Update a review
export const updateReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) throw new Error("Unauthorized");

    const { reviewId, rating, title, text } = req.body;

    const updatedReview = await reviewService.updateReview(buyerId, reviewId, {
      rating,
      title,
      text,
    });

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete a review
export const deleteReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) throw new Error("Unauthorized");

    const { reviewId } = req.body;
    await reviewService.deleteReview(buyerId, reviewId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
