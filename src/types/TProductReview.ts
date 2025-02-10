export type TProductReview = {
    reviewCode: string;
    username: string;
    sku: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
};