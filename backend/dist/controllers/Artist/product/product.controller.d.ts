import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare const createProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAllProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductsByArtist: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductsByArtistId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateStockOnly: (req: AuthenticatedRequest, res: Response) => Promise<void>;
