import mongoose from "mongoose";
import type { TProduct } from "@/types";

const ProductSchema = new mongoose.Schema<TProduct>({
    tags: {
        type: [String],
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
    images: {
        type: [String],
        default: [],
    },
});

const Product = mongoose.models.Product || mongoose.model<TProduct>("Product", ProductSchema);

export default Product;