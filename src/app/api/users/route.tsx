import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import API_RESPONSE from "@/lib/apiResponse";
import User from "@/models/User";
import { TResponse } from "@/types";
import { ApiError } from "@/lib/errors/apiError";

export const POST = async (request: NextRequest) => {
    let status: number = 200;
    let response: TResponse;
    const requestParams = await request.json();
    const apiKey = requestParams.apiKey;
    const email = requestParams.email;

    try {
        await connectDB();
        response = API_RESPONSE.success;

        if (!apiKey) {
            throw new ApiError(API_RESPONSE.requiredApiKey.code, API_RESPONSE.requiredApiKey.message, 400);
        }

        if (apiKey !== process.env.API_KEY) {
            throw new ApiError(API_RESPONSE.invalidApiKey.code, API_RESPONSE.invalidApiKey.message, 400);
        }

        if (!email) {
            throw new ApiError(API_RESPONSE.requiredEmail.code, API_RESPONSE.requiredEmail.message, 400);
        }

        const data =  await User.findOne({ email });

        if (!data) {
            throw new ApiError(API_RESPONSE.invalidEmail.code, API_RESPONSE.invalidEmail.message, 400);
        }

        response.data = data;
    } catch (error: unknown) {
        status = 400;
        response = API_RESPONSE.error;

        if (error instanceof ApiError) {
            response.code = error.code;
            response.message = error.message;
            status = error.status;
        }
    }
    
    return NextResponse.json(response , { status });
}