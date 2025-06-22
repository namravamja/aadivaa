import { Request, Response } from "express";
import * as cartService from "../../../services/Buyer/cart/cart.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId, quantity } = req.body;

    const item = await cartService.addToCart(userId, productId, quantity);

    // Clear cart cache after adding item
    await deleteCache(`cart:${userId}`);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId } = req.body;
    const { quantity } = req.body;

    const item = await cartService.updateCartItem(userId, productId, quantity);

    // Clear cart cache after updating item
    await deleteCache(`cart:${userId}`);

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId } = req.body;

    await cartService.removeFromCart(userId, productId);

    // Clear cart cache after removing item
    await deleteCache(`cart:${userId}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    await cartService.clearCart(userId);

    // Clear cart cache after clearing cart
    await deleteCache(`cart:${userId}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getCartByBuyerId = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const cacheKey = `cart:${userId}`;
    const cachedCart = await getCache(cacheKey);

    if (cachedCart) {
      return res.json({ source: "cache", data: cachedCart });
    }

    const cart = await cartService.getCartByBuyerId(userId);
    await setCache(cacheKey, cart);

    res.json({ source: "db", data: cart });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
