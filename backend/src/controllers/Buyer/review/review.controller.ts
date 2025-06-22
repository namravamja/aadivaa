import { Request, Response } from "express";
import * as reviewService from "../../../services/Buyer/review/review.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

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

    // Clear related caches after adding review
    await deleteCache(`reviews:product:${productId}`);
    await deleteCache(`reviews:buyer:${buyerId}`);

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const cacheKey = `reviews:product:${productId}`;
    const cachedReviews = await getCache(cacheKey);

    if (cachedReviews) {
      return res.json({ source: "cache", data: cachedReviews });
    }

    const reviews = await reviewService.getReviewsByProduct(productId);
    await setCache(cacheKey, reviews);

    res.json({ source: "db", data: reviews });
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

    // Clear related caches after updating review
    // Note: We need productId to clear product reviews cache
    // You might need to get the review first to know the productId
    await deleteCache(`review:${reviewId}`);
    await deleteCache(`reviews:buyer:${buyerId}`);
    // If you have productId available: await deleteCache(`reviews:product:${productId}`);

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

    // You might want to get the review first to know the productId for cache clearing
    // const existingReview = await reviewService.getReviewById(reviewId);
    // const productId = existingReview?.productId;

    await reviewService.deleteReview(buyerId, reviewId);

    // Clear related caches after deleting review
    await deleteCache(`review:${reviewId}`);
    await deleteCache(`reviews:buyer:${buyerId}`);
    // If you have productId available: await deleteCache(`reviews:product:${productId}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
