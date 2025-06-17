interface OrderFilters {
    page: number;
    limit: number;
    status?: string;
    paymentStatus?: string;
}
interface PaymentUpdateData {
    paymentStatus: string;
    transactionId?: string;
}
export declare const getArtistOrders: (artistId: string, filters: OrderFilters) => Promise<{
    orders: any;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;
export declare const getArtistOrderById: (orderId: string, artistId: string) => Promise<any>;
export declare const updateOrderStatus: (orderId: string, artistId: string, status: string) => Promise<any>;
export declare const updateOrderPaymentStatus: (orderId: string, artistId: string, paymentData: PaymentUpdateData) => Promise<any>;
export declare const getOrderItemsByArtist: (artistId: string, filters: OrderFilters) => Promise<{
    orderItems: any;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;
export declare const bulkUpdateOrderStatus: (orderIds: string[], artistId: string, status: string) => Promise<any>;
export {};
