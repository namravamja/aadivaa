import { Request, Response } from "express";
import * as cartService from "../../../services/Buyer/cart/cart.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { productId, quantity } = req.body;
    const item = await cartService.addToCart(userId, productId, quantity);
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
    const cart = await cartService.getCartByBuyerId(userId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
