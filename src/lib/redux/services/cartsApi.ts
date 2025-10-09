import HttpMethod from "@/constants/HttpMethod";
import { TApiResponse } from "@/types";
import { TCart, TRemoveItemFromCartRequest, TUpdateCart } from "@/types/TCart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
const REDUCER_PATH = "cartsApi";
const CARTS_ENDPOINT = "/carts";

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
});

export const cartsApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getCartByCustomerId: builder.query<TApiResponse<TCart>, string>({
            query: (id) => ({
                url: CARTS_ENDPOINT + `/customer/${id}`,
            }),
        }),
        updateCart: builder.mutation<TApiResponse<TCart>, Partial<TUpdateCart>>({
            query: (items) => ({
                url: CARTS_ENDPOINT + `/update`,
                method: HttpMethod.POST,
                body: items
            }),
        }),
        removeItemFromCart: builder.mutation<TApiResponse<TCart>, Partial<TRemoveItemFromCartRequest>>({
            query: (item) => ({
                url: CARTS_ENDPOINT + `/remove-item`,
                method: HttpMethod.POST,
                body: item
            }),
        }),
        deleteCartByCustomerID: builder.mutation<TApiResponse<TCart>, string>({
            query: (id) => ({
                url: `${CARTS_ENDPOINT}/customer/${id}`,
                method: HttpMethod.DELETE,
            })
        }),
    }),
});

export const {
    useGetCartByCustomerIdQuery,
    useUpdateCartMutation,
    useRemoveItemFromCartMutation,
    useDeleteCartByCustomerIDMutation
} = cartsApi;