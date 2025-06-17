interface BusinessAddressData {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
}
export declare const updateBusinessAddress: (artistId: string, addressData: BusinessAddressData) => Promise<{
    state: string | null;
    id: string;
    street: string;
    city: string | null;
    country: string | null;
    pinCode: string | null;
}>;
export {};
