import { Request, Response } from "express";
import * as wishlistService from "../../../services/Buyer/wishlist/wishlist.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const addToWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId } = req.body;
    const item = await wishlistService.addToWishlist(userId, productId);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const items = await wishlistService.getWishlistByBuyer(userId);
    res.json(items);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const removeFromWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId } = req.body;
    await wishlistService.removeFromWishlist(userId, productId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
