export declare const sendForgotPasswordEmail: (email: string, resetToken: string, userType?: "buyer" | "artist") => Promise<void>;
export declare const sendBuyerForgotPasswordEmail: (email: string, resetToken: string) => Promise<void>;
export declare const sendArtistForgotPasswordEmail: (email: string, resetToken: string) => Promise<void>;
