/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpMethod from "@/constants/HttpMethod";
import { TApiResponse } from "@/types";
import { TCustomer, TUpdateCustomer } from "@/types/TCustomer";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
const REDUCER_PATH = "customersApi";
const CUSTOMERS_ENDPOINT = "/customers";

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
});

type TContent = {
    content: TCustomer[];
}

export const customersApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getCustomers: builder.query<TApiResponse<TContent>, void>({
            query: () => CUSTOMERS_ENDPOINT,
        }),
        getCustomerById: builder.query<TApiResponse<any>, string>({
            query: (id) => ({
                url: CUSTOMERS_ENDPOINT + `/${id}`,
            }),
        }),
        getCustomerByEmail: builder.query<TApiResponse<any>, string>({
            query: (email) => ({
                url: CUSTOMERS_ENDPOINT + `/email/${email}`,
            }),
        }),
        createCustomer: builder.mutation<TApiResponse<TCustomer>, Partial<TCustomer>>({
            query: (customer) => ({
                url: CUSTOMERS_ENDPOINT,
                method: HttpMethod.POST,
                body: customer
            }),
        }),
        updateCustomer: builder.mutation<TApiResponse<TCustomer>, { id: string; customer: Partial<TUpdateCustomer> }>({
            query: ({ id, customer }) => ({
                url: `${CUSTOMERS_ENDPOINT}/${id}`,
                method: HttpMethod.PATCH,
                body: customer
            }),
        }),
        deleteCustomer: builder.mutation<TApiResponse<any>, string>({
            query: (id) => ({
                url: `${CUSTOMERS_ENDPOINT}/${id}`,
                method: HttpMethod.DELETE,
            })
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useGetCustomerByEmailQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation
} = customersApi;