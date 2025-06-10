import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const getArtist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
