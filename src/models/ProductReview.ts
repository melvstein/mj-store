import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import type { TProductReview } from "@/types";

const ProductReviewSchema = new Schema<TProductReview>({
    username: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

ProductReviewSchema.pre("save", function (next) {
    if (this.isModified("updatedAt") || this.isNew) {
        this.updatedAt = new Date();
    }

    next()
});

const ProductReview = models.productReviews || model<TProductReview>("productReviews", ProductReviewSchema);

export default ProductReview;