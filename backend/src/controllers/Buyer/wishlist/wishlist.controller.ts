import { Request, Response } from "express";
import * as wishlistService from "../../../services/Buyer/wishlist/wishlist.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

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

    // Clear wishlist cache after adding item
    await deleteCache(`wishlist:${userId}`);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const cacheKey = `wishlist:${userId}`;
    const cachedWishlist = await getCache(cacheKey);

    if (cachedWishlist) {
      return res.json({ source: "cache", data: cachedWishlist });
    }

    const items = await wishlistService.getWishlistByBuyer(userId);
    await setCache(cacheKey, items);

    res.json({ source: "db", data: items });
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

    // Clear wishlist cache after removing item
    await deleteCache(`wishlist:${userId}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
