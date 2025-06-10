export declare const addToCart: (buyerId: string, productId: string, quantity: number) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    buyerId: string;
    productId: string;
    quantity: number;
}>;
export declare const getCartByBuyerId: (buyerId: string) => Promise<({
    product: {
        artist: {
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
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    buyerId: string;
    productId: string;
    quantity: number;
})[]>;
export declare const clearCart: (buyerId: string) => Promise<void>;
export declare const updateCartItem: (buyerId: string, productId: string, quantity: number) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    buyerId: string;
    productId: string;
    quantity: number;
}>;
export declare const removeFromCart: (buyerId: string, productId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    buyerId: string;
    productId: string;
    quantity: number;
}>;
