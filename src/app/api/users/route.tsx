import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import ApiResponse from "@/lib/apiResponse";
import User from "@/models/User";
import { TResponse } from "@/types";
import { ApiError } from "@/lib/errors/apiError";
import { z } from "zod";

const getUserSchema = z.object({
    apiKey: z.string({
        required_error: "API key is required",
        invalid_type_error: "API Key must be string"
    }).min(1, "API key cannot be empty")
        .refine((apiKey) => apiKey === process.env.API_KEY, {
            message: "Invalid API Key",
        }),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be string"
    }).email(),
});

export const POST = async (request: NextRequest) => {
    let status: number = 200;
    let response: TResponse;

    try {
        await connectDB();
        response = ApiResponse.success;
        const requestParams = await request.json();
        const validation = getUserSchema.safeParse(requestParams);

        if (!validation.success) {
            throw validation.error;
        }

        const { email } = validation.data;

        const data =  await User.findOne({ email });

        if (!data) {
            throw new ApiError(ApiResponse.error.code, "Email not found", 400);
        }

        response.data = data;
    } catch (error: unknown) {
        status = 400;
        response = ApiResponse.error;

        if (error instanceof ApiError) {
            response.code = error.code;
            response.message = error.message;
            status = error.status;
        }

        if (error instanceof z.ZodError) {
            response.message = error.errors[0].message;
        }
    }
    
    return NextResponse.json(response , { status });
}