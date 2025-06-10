import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const deleteArtist: (req: AuthenticatedRequest, res: Response) => Promise<void>;
