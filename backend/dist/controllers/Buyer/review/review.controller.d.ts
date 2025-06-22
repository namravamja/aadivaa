import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const addReview: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getReviewsByProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateReview: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteReview: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
