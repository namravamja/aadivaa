interface SignupData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare const signupBuyer: (data: SignupData) => Promise<{
    message: string;
    id: any;
}>;
export declare const loginBuyer: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    buyer: any;
}>;
export declare const signupArtist: (data: SignupData) => Promise<{
    message: string;
    id: any;
}>;
export declare const loginArtist: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    artist: any;
}>;
export {};
