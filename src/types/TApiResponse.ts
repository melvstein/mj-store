export type TApiResponse<T = null> = {
    code: string;
    message: string;
    data?: T;
}