export declare const getProductById: (productId: string) => Promise<{
    artist: {
        email: string;
        id: string;
        fullName: string | null;
        storeName: string | null;
    };
} & {
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
}>;
