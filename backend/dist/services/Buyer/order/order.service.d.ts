interface CartItem {
    productId: string;
    quantity: number;
    product: {
        sellingPrice: string;
        availableStock: string;
        productName: string;
        artistId: string;
    };
}
interface CreateOrderData {
    addressIds: number;
    paymentMethod: string;
    cartItems: CartItem[];
}
interface PaymentUpdateData {
    paymentStatus: string;
    transactionId?: string;
}
export declare const createOrderFromCart: (buyerId: string, orderData: CreateOrderData) => Promise<any>;
export declare const getBuyerOrders: (buyerId: string, options?: {
    page?: number;
    limit?: number;
    status?: string;
}) => Promise<{
    orders: any;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare const getOrderById: (orderId: string, buyerId: string) => Promise<any>;
export declare const cancelOrder: (orderId: string, buyerId: string) => Promise<any>;
export declare const updatePaymentStatus: (orderId: string, paymentData: PaymentUpdateData) => Promise<any>;
export declare const getBuyerOrderStats: (buyerId: string) => Promise<{
    ordersByStatus: any;
    totalSpent: any;
}>;
export {};
