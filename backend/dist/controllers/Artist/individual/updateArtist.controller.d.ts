import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const updateArtist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
