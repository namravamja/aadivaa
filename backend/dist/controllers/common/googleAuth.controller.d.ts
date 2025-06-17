import type { Request, Response } from "express";
declare module "express-session" {
    interface SessionData {
        userType?: "buyer" | "artist";
    }
}
export declare const googleCallback: (req: Request, res: Response) => void;
export declare const initiateGoogleAuth: (userType: "buyer" | "artist") => (req: Request, res: Response, next: any) => void;
