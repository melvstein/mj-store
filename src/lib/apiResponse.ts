import { TApiResponse } from "@/types";

const ApiResponse = {
    success: { code: 0, message: "SUCCESS" } as TApiResponse,
    error: { code: 1, message: "ERROR" } as TApiResponse,
};

export default ApiResponse;