import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const getArtists: (_req: Request, res: Response) => Promise<void>;
