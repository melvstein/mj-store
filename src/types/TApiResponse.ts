export type TApiResponse<T = null> = {
    code: string;
    message: string;
    data?: T;
}

export type TErrorResponse = {
    status: number;
    data: TApiResponse<null>;
};