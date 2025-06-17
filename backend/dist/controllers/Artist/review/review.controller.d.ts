import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
    body: any;
}
export declare const getReviewsByArtist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateReviewVerificationStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteReviewByArtist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
