import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ApiResponse from "@/lib/apiResponse";
import User from "@/models/User";
import { ApiError } from "@/lib/errors/apiError";
import { TResponse } from "@/types";
import { z, ZodError } from "zod";

const emailSchema = z.string().email();

export const GET = async (request: NextRequest, { params } : { params: Promise<{ email: string }> }) => {
    let status: number = 200;
    let response: TResponse;

    try {
        await connectDB();
        response = ApiResponse.success;
        const resolvedParams = await params;
        const email = emailSchema.parse(resolvedParams.email);
        const data =  await User.findOne({ email });

        if (!data) {
            throw new ApiError(ApiResponse.error.code, "Email not found", 400);
        }

        response.data = {
            provider: data.provider,
            role: data.role,
            name: data.name,
            username: data.username,
            email: data.email,
            image: data.image,
            contactNumber: data.contactNumber,
            address: data.address,
        };
    } catch (error: unknown) {
        status = 400;
        response = ApiResponse.error;

        if (error instanceof ApiError) {
            response.code = error.code;
            response.message = error.message;
            status = error.status;
        }

        if (error instanceof ZodError) {
            response.message = error.errors[0].message;
        }
    }
    
    return NextResponse.json(response , { status });
}