import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TProduct } from "@/types";

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api" 
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<TProduct[], void>({
            query: () => `/products`,
        }),
    })
});

export const { useGetProductsQuery } = productApi;