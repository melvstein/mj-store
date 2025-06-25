export type TApiResponse<T = null> = {
    code: number;
    message: string;
    data?: T;
}