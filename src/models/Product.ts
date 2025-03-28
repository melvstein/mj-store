import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import type { TProduct } from "@/types";

const ProductSchema = new Schema<TProduct>({
    tags: {
        type: [String],
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    name: { 
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
    },
    images: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

ProductSchema.pre("save", function (next) {
    if (this.isModified("updatedAt") || this.isNew) {
        this.updatedAt = new Date();
    }

    next()
});

const Product = models.Product || model<TProduct>("Product", ProductSchema);

export default Product;