import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

// 🟢 GET All Products
export const GET = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        
        return NextResponse.json(products, { status: 200 });
    } catch (error: unknown) {
        const response = {
            error: "Failed to fetch products",
        };

        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
        } else {
            console.error("An unknown error occurred:", error);
        }

        return NextResponse.json(response, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    await connectDB();
    const data = await request.json();
    const newProduct = await Product.create(data);

    return NextResponse.json(newProduct);
};