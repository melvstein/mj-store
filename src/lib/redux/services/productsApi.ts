import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TProduct, TUpdateProduct } from "@/types";
import { getAccessToken } from "@/services/AuthenticationService";
import HttpMethod from "@/constants/HttpMethod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REDUCER_PATH = "productsApi";
const PRODUCTS_ENDPOINT = "/products";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

type TContent = {
    content: TProduct[];
}

export const productsApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getProducts: builder.query<TApiResponse<TContent>, void>({
            query: () => PRODUCTS_ENDPOINT,
        }),
        getProduct: builder.query<TApiResponse<TProduct>, string>({
            query: (id) => ({
                url: PRODUCTS_ENDPOINT + `/${id}`,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        addProduct: builder.mutation<TApiResponse<TProduct>, Partial<TProduct>>({
            query: (product) => ({
                url: PRODUCTS_ENDPOINT,
                method: HttpMethod.POST,
                body: product,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        updateProduct: builder.mutation<TApiResponse<TUpdateProduct>, { id: string | undefined; product: Partial<TUpdateProduct> }>({
            query: ({ id, product }) => ({
                url: `${PRODUCTS_ENDPOINT}/${id}`,
                method: HttpMethod.PATCH,
                body: product,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        deleteProduct: builder.mutation<TApiResponse<any>, string>({
            query: (id) => ({
                url: `${PRODUCTS_ENDPOINT}/${id}`,
                method: HttpMethod.DELETE,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        uploadProductImages: builder.mutation<TApiResponse<any>, { id: string | undefined; files: File[] }>({
            query: ({ id, files }) => {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append("files", file); // key must match backend: "files"
                });
                return {
                    url: `${PRODUCTS_ENDPOINT}/${id}/upload-product-images`,
                    method: HttpMethod.POST,
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${getAccessToken()}`,
                    },
                };
            },
        }),
        deleteProductImages: builder.mutation<TApiResponse<any>, { id: string | undefined; imageIndexes: number[] }>({
            query: ({ id, imageIndexes }) => ({
                url: `${PRODUCTS_ENDPOINT}/${id}/delete-product-images`,
                method: HttpMethod.DELETE,
                body: imageIndexes,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`,
                },
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImagesMutation,
    useDeleteProductImagesMutation,
} = productsApi;
