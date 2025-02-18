import { TApiResponse } from "@/types";

const API_RESPONSE = {
    success: { code: 0, message: "SUCCESS" } as TApiResponse,
    error: { code: 1, message: "ERROR" } as TApiResponse,

    // API key response
    invalidApiKey: { code: 2, message: "Invalid API Key" } as TApiResponse,
    requiredApiKey: { code: 3, message: "Required API key" } as TApiResponse,

    // Email response
    invalidEmail: { code: 4, message: "Invalid Email" } as TApiResponse,
    requiredEmail: { code: 5, message: "Required Email" } as TApiResponse,
};

export default API_RESPONSE;