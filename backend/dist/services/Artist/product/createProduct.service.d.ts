interface productData {
    productName: string;
    category: string;
    shortDescription: string;
    sellingPrice: string;
    mrp: string;
    availableStock: string;
    skuCode: string;
    productImages: string[];
    weight: string;
    length: string;
    width: string;
    height: string;
    shippingCost: string;
    deliveryTimeEstimate: string;
}
export declare const createProduct: (artistId: string, Product: productData) => Promise<{
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
export {};
