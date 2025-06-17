interface BusinessAddressData {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
}
export declare const updateBusinessAddress: (artistId: string, addressData: BusinessAddressData) => Promise<any>;
export {};
