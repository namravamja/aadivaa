export declare const addToCart: (buyerId: string, productId: string, quantity: number) => Promise<any>;
export declare const getCartByBuyerId: (buyerId: string) => Promise<any>;
export declare const clearCart: (buyerId: string) => Promise<void>;
export declare const updateCartItem: (buyerId: string, productId: string, quantity: number) => Promise<any>;
export declare const removeFromCart: (buyerId: string, productId: string) => Promise<any>;
