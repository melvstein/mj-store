import { TApiResponse } from "@/types";

const ApiResponse = {
    success: { code: "SUCCESS", message: "Success" } as TApiResponse,
    error: { code: "ERROR", message: "Error" } as TApiResponse,
};

export default ApiResponse;