interface WarehouseAddressData {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    sameAsBusiness?: boolean;
}
export declare const updateWarehouseAddress: (artistId: string, addressData: WarehouseAddressData) => Promise<any>;
export {};
