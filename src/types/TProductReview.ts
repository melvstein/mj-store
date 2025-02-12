export type TProductReview = {
    username: string;
    sku: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
};