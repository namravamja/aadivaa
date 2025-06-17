interface WarehouseAddressData {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    sameAsBusiness?: boolean;
}
export declare const updateWarehouseAddress: (artistId: string, addressData: WarehouseAddressData) => Promise<{
    state: string | null;
    id: string;
    street: string;
    city: string | null;
    country: string | null;
    pinCode: string | null;
    sameAsBusiness: boolean | null;
}>;
export {};
