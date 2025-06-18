export declare const forgotPassword: (email: string) => Promise<{
    message: string;
}>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<{
    message: string;
}>;
export declare const verifyResetToken: (token: string) => Promise<{
    valid: boolean;
    email: string;
}>;
