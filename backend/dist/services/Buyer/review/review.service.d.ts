type ReviewData = {
    rating: number;
    title: string;
    text: string;
};
export declare const addReview: (buyerId: string, productId: string, { rating, title, text }: ReviewData) => Promise<any>;
export declare const getReviewsByProduct: (productId: string) => Promise<any>;
export declare const updateReview: (buyerId: string, reviewId: string, { rating, title, text }: ReviewData) => Promise<any>;
export declare const deleteReview: (buyerId: string, reviewId: string) => Promise<any>;
export {};
