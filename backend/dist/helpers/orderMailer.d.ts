type EmailItem = {
    name: string;
    quantity: number;
    price: number;
};
type Shipping = {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
};
export declare const sendOrderConfirmationEmail: (email: string, fullName: string, orderId: string, items: EmailItem[], totalAmount: number, shippingAddress: Shipping, placedAt: string, paymentMethod: string) => Promise<void>;
export {};
