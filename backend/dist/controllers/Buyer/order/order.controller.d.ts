import type { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const createOrder: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBuyerOrders: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getOrderById: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelOrder: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updatePaymentStatus: (req: Request, res: Response) => Promise<void>;
export {};
