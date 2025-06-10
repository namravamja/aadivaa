export interface BuyerUpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: string;
}
export declare const createBuyer: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: string;
}) => Promise<{
    email: string;
    password: string;
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
    isAuthenticated: boolean;
    forgotPasswordToken: string | null;
    forgotPasswordExpires: Date | null;
    verifyToken: string | null;
    verifyExpires: Date | null;
    isVerified: boolean;
}>;
export declare const getBuyerById: (id: string) => Promise<{
    email: string;
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    createdAt: Date;
    addresses: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        company: string | null;
        street: string | null;
        apartment: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        userId: string;
        isDefault: boolean;
    }[];
}>;
export declare const updateBuyer: (id: string, data: BuyerUpdateData) => Promise<{
    email: string;
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    createdAt: Date;
}>;
export declare const deleteBuyer: (id: string) => Promise<{
    message: string;
}>;
export declare const listBuyers: () => Promise<{
    email: string;
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    createdAt: Date;
}[]>;
