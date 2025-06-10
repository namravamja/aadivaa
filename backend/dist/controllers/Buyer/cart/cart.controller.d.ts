import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const addToCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateCartItem: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const removeFromCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const clearCart: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCartByBuyerId: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
