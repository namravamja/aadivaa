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
export declare const createOrderFromCart: (buyerId: string, orderData: CreateOrderData) => Promise<{
    buyer: {
        email: string;
    };
    orderItems: ({
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
        productId: string;
        quantity: number;
        artistId: string;
        priceAtPurchase: number;
        orderId: string;
    })[];
    shippingAddress: {
        state: string;
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
        postalCode: string;
        country: string;
        userId: string;
        isDefault: boolean;
    } | null;
} & {
    id: string;
    updatedAt: Date;
    buyerId: string;
    totalAmount: number;
    status: string;
    shippingAddressId: number | null;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}>;
export declare const getBuyerOrders: (buyerId: string, options?: {
    page?: number;
    limit?: number;
    status?: string;
}) => Promise<{
    orders: ({
        orderItems: ({
            artist: {
                id: string;
                fullName: string | null;
                storeName: string | null;
            };
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
        shippingAddressId: number | null;
        paymentMethod: string;
        paymentStatus: string;
        placedAt: Date;
    })[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare const getOrderById: (orderId: string, buyerId: string) => Promise<({
    orderItems: ({
        product: {
            artist: {
                email: string;
                id: string;
                fullName: string | null;
                storeName: string | null;
                mobile: string | null;
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
    shippingAddressId: number | null;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}) | null>;
export declare const cancelOrder: (orderId: string, buyerId: string) => Promise<{
    orderItems: ({
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
    shippingAddressId: number | null;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}>;
export declare const updatePaymentStatus: (orderId: string, paymentData: PaymentUpdateData) => Promise<{
    orderItems: ({
        product: {
            id: string;
            productName: string;
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
    shippingAddressId: number | null;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: Date;
}>;
export declare const getBuyerOrderStats: (buyerId: string) => Promise<{
    ordersByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderGroupByOutputType, "status"[]> & {
        _count: {
            status: number;
        };
    })[];
    totalSpent: number;
}>;
export {};
