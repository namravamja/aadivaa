export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (input: string, hashed: string) => Promise<boolean>;
export declare const generateToken: (payload: {
    id: string;
    role: "BUYER" | "ARTIST";
}) => string;
export declare const generateVerificationToken: (payload: {
    id: string;
    role: "BUYER" | "ARTIST";
}) => string;
export declare const verifyVerificationToken: (token: string) => {
    id: string;
    role: "BUYER" | "ARTIST";
};
