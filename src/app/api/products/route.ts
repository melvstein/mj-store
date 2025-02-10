import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import type { TProduct } from "@/types";

// 🟢 GET All Products
export const GET = async () => {
    let response: TProduct[] | { error: string } = [];
    let status: number = 200;

    try {
        await connectDB();
        response = await Product.find({});
    } catch (error: unknown) {
        status = 500;

        response = {
            error: "Failed to fetch products",
        };

        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
        } else {
            console.error("An unknown error occurred:", error);
        }
    }
 
    return NextResponse.json(response, { status });
};

export const POST = async (request: NextRequest) => {
    await connectDB();
    const requestParams = await request.json();
    let newProduct;

    try {
        newProduct = await new Product(requestParams);
        await newProduct.save();
    } catch (error) {
        console.error("Error saving product:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json(newProduct, { status: 201 });
};