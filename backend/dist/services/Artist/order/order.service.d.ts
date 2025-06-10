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
    orders: ({
        buyer: {
            email: string;
            id: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
        };
        orderItems: ({
            product: {
                id: string;
                productName: string;
                category: string;
                skuCode: string;
                productImages: string[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            artistId: string;
            priceAtPurchase: number;
            orderId: string;
        })[];
        shippingAddress: {
            id: number;
            firstName: string;
            lastName: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            company: string | null;
            street: string | null;
            apartment: string | null;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            userId: string;
            isDefault: boolean;
        };
    } & {
        id: string;
        updatedAt: Date;
        buyerId: string;
        totalAmount: number;
        status: string;
        shippingAddressId: number;
        paymentMethod: string;
        paymentStatus: string;
        placedAt: Date;
    })[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;
export declare const getArtistOrderById: (orderId: string, artistId: string) => Promise<({
    buyer: {
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
    };
    orderItems: ({
        product: {
            id: string;
            length: string;
            productName: string;
            category: string;
            shortDescription: string;
            skuCode: string;
            productImages: string[];
            weight: string;
            width: string;
            height: string;
        };
    } & {
        id: string;
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
    shippingAddress: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        company: string | null;
        street: string | null;
        apartment: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        userId: string;
        isDefault: boolean;
    };
} & {
    id: string;
    updatedAt: Date;
    buyerId: string;
    totalAmount: number;
    status: string;
    shippingAddressId: number;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}) | null>;
export declare const updateOrderStatus: (orderId: string, artistId: string, status: string) => Promise<{
    buyer: {
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
    orderItems: ({
        product: {
            id: string;
            productName: string;
            category: string;
            productImages: string[];
        };
    } & {
        id: string;
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
} & {
    id: string;
    updatedAt: Date;
    buyerId: string;
    totalAmount: number;
    status: string;
    shippingAddressId: number;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}>;
export declare const updateOrderPaymentStatus: (orderId: string, artistId: string, paymentData: PaymentUpdateData) => Promise<{
    buyer: {
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
    orderItems: ({
        product: {
            id: string;
            productName: string;
            category: string;
            productImages: string[];
        };
    } & {
        id: string;
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
} & {
    id: string;
    updatedAt: Date;
    buyerId: string;
    totalAmount: number;
    status: string;
    shippingAddressId: number;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}>;
export declare const getOrderItemsByArtist: (artistId: string, filters: OrderFilters) => Promise<{
    orderItems: ({
        product: {
            id: string;
            productName: string;
            category: string;
            skuCode: string;
            productImages: string[];
        };
        order: {
            buyer: {
                email: string;
                id: string;
                firstName: string | null;
                lastName: string | null;
            };
            id: string;
            totalAmount: number;
            status: string;
            paymentStatus: string;
            placedAt: Date;
            shippingAddress: {
                id: number;
                firstName: string;
                lastName: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                company: string | null;
                street: string | null;
                apartment: string | null;
                city: string;
                state: string;
                postalCode: string;
                country: string;
                userId: string;
                isDefault: boolean;
            };
        };
    } & {
        id: string;
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;
export declare const bulkUpdateOrderStatus: (orderIds: string[], artistId: string, status: string) => Promise<({
    buyer: {
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
    orderItems: ({
        product: {
            id: string;
            productName: string;
            category: string;
            productImages: string[];
        };
    } & {
        id: string;
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
} & {
    id: string;
    updatedAt: Date;
    buyerId: string;
    totalAmount: number;
    status: string;
    shippingAddressId: number;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
})[]>;
export {};
