import HttpMethod from "@/constants/HttpMethod";
import { TApiResponse } from "@/types";
import { TOrder, TUpdateOrderStatus } from "@/types/TOrder";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
const REDUCER_PATH = "ordersApi";
const ORDERS_ENDPOINT = "/orders";

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
});

export const ordersApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getOrderById: builder.query<TApiResponse<TOrder>, string>({
            query: (id) => ({
                url: ORDERS_ENDPOINT + `/${id}`,
            }),
        }),
        updateOrderStatus: builder.mutation<TApiResponse<TOrder>, Partial<TUpdateOrderStatus>>({
            query: (request) => ({
                url: ORDERS_ENDPOINT + `/update-status`,
                method: HttpMethod.POST,
                body: request
            }),
        }),
    }),
});

export const {
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation
} = ordersApi;