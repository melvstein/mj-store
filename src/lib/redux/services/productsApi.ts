import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TProduct } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REDUCER_PATH = "productsApi";
const PRODUCTS_ENDPOINT = "/products";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

type TContent = {
    content: TProduct;
}

export const productsApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getProducts: builder.query<TApiResponse<TContent>, void>({
            query: () => PRODUCTS_ENDPOINT,
        }),
    }),
});

export const {
    useGetProductsQuery,
} = productsApi;
