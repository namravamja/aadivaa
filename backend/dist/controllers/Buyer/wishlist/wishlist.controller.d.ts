import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const addToWishlist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getWishlist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const removeFromWishlist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
