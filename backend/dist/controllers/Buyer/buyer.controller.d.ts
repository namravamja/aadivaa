import type { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
    file?: Express.Multer.File;
}
export declare const createBuyer: (req: Request, res: Response) => Promise<void>;
export declare const getBuyer: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBuyer: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteBuyer: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getBuyers: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
