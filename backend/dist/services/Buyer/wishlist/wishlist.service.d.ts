export declare const addToWishlist: (buyerId: string, productId: string) => Promise<{
    product: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        length: string;
        productName: string;
        category: string;
        shortDescription: string;
        sellingPrice: string;
        mrp: string;
        availableStock: string;
        skuCode: string;
        productImages: string[];
        weight: string;
        width: string;
        height: string;
        shippingCost: string;
        deliveryTimeEstimate: string;
        artistId: string;
    };
} & {
    id: string;
    createdAt: Date;
    buyerId: string;
    productId: string;
}>;
export declare const getWishlistByBuyer: (buyerId: string) => Promise<({
    product: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        length: string;
        productName: string;
        category: string;
        shortDescription: string;
        sellingPrice: string;
        mrp: string;
        availableStock: string;
        skuCode: string;
        productImages: string[];
        weight: string;
        width: string;
        height: string;
        shippingCost: string;
        deliveryTimeEstimate: string;
        artistId: string;
    };
} & {
    id: string;
    createdAt: Date;
    buyerId: string;
    productId: string;
})[]>;
export declare const removeFromWishlist: (buyerId: string, productId: string) => Promise<{
    id: string;
    createdAt: Date;
    buyerId: string;
    productId: string;
}>;
