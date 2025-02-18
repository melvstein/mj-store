import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import API_RESPONSE from "@/lib/apiResponse";
import User from "@/models/User";
import { ApiError } from "@/lib/errors/apiError";
import { TResponse } from "@/types";

export const GET = async (request: NextRequest, { params } : { params: { email: string } }) => {
    let status: number = 200;
    let response: TResponse;
    const email = params.email;

    try {
        await connectDB();
        response = API_RESPONSE.success;
        const data =  await User.findOne({ email });

        if (!data) {
            throw new ApiError(API_RESPONSE.invalidEmail.code, API_RESPONSE.invalidEmail.message, 400);
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
        response = API_RESPONSE.error;

        if (error instanceof ApiError) {
            response.code = error.code;
            response.message = error.message;
            status = error.status;
        }
    }
    
    return NextResponse.json(response , { status });
}