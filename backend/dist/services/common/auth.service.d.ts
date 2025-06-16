interface SignupData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare const signupBuyer: (data: SignupData) => Promise<{
    message: string;
    id: string;
}>;
export declare const loginBuyer: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    buyer: {
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
    };
}>;
export declare const signupArtist: (data: SignupData) => Promise<{
    message: string;
    id: string;
}>;
export declare const loginArtist: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    artist: {
        email: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        isAuthenticated: boolean;
        forgotPasswordToken: string | null;
        forgotPasswordExpires: Date | null;
        verifyToken: string | null;
        verifyExpires: Date | null;
        isVerified: boolean;
        fullName: string | null;
        profileProgress: number | null;
        storeName: string | null;
        mobile: string | null;
        confirmPassword: string | null;
        businessType: string | null;
        businessRegistrationNumber: string | null;
        productCategories: string[];
        businessLogo: string | null;
        businessAddressId: string | null;
        warehouseAddressId: string | null;
        documentsId: string | null;
        socialLinksId: string | null;
        bankAccountName: string | null;
        bankName: string | null;
        accountNumber: string | null;
        ifscCode: string | null;
        upiId: string | null;
        gstNumber: string | null;
        panNumber: string | null;
        shippingType: string | null;
        serviceAreas: string[];
        inventoryVolume: string | null;
        supportContact: string | null;
        returnPolicy: string | null;
        workingHours: string | null;
        termsAgreed: boolean | null;
        digitalSignature: string | null;
    };
}>;
export {};
