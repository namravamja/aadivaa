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
}) => Promise<any>;
export declare const getBuyerById: (id: string) => Promise<any>;
export declare const updateBuyer: (id: string, data: BuyerUpdateData) => Promise<any>;
export declare const deleteBuyer: (id: string) => Promise<{
    message: string;
}>;
export declare const listBuyers: () => Promise<any>;
