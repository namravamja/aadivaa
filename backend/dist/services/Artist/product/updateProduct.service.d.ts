type UpdateProductInput = {
    productName?: string;
    category?: string;
    shortDescription?: string;
    sellingPrice?: string;
    mrp?: string;
    availableStock?: string;
    skuCode?: string;
    productImages?: string[];
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
    shippingCost?: string;
    deliveryTimeEstimate?: string;
};
export declare const updateProduct: (productId: string, artistId: string, inputData: UpdateProductInput) => Promise<any>;
export {};
