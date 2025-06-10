interface BusinessAddressData {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
}
export declare const updateBusinessAddress: (artistId: string, addressData: BusinessAddressData) => Promise<{
    id: string;
    street: string;
    city: string | null;
    state: string | null;
    country: string | null;
    pinCode: string | null;
}>;
export {};
