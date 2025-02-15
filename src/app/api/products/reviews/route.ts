import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import type { TProductReview } from "@/types";
import ProductReview from "@/models/ProductReview";

export const GET = async () => {
    await connectDB();
    let data: TProductReview[] | { error: string } = [];
    let status = 200;

    try {
        data = await ProductReview.find({});
    } catch (error: unknown) {
        status = 500;
        console.log(error);

        if (error instanceof Error) {
            data = {
                error: error.message
            };
        }
    }

    return NextResponse.json(data, { status });
}

export const POST = async (request: NextRequest) => {
    await connectDB();
    const requestParams = await request.json();
    let newReview;

    try {
        newReview = await new ProductReview(requestParams);
        await newReview.save();
    } catch (error: unknown) {
        console.error("Error saving product:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json(newReview, { status: 201 });
};