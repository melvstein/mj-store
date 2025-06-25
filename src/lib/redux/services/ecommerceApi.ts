import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TProductResponse } from "@/types";
import { TTokens } from "@/types/TAuth";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/services/AuthenticationService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REDUCER_PATH = "ecommerceApi";

const HTTP_METHOD_POST = "POST";
const HTTP_METHOD_GET = "GET";
const HTTP_METHOD_PATCH = "PATCH";
const HTTP_METHOD_DELETE = "DELETE";

const GET_PRODUCTS_ENDPOINT = "/products";
const AUTH_LOGIN_ENDPOINT = "/auth/login";
const AUTH_REFRESH_TOKEN = "/auth/refresh-token";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
      api,
      extraOptions
    );

    if (
      refreshResult.data &&
      typeof refreshResult.data === "object" &&
      refreshResult.data !== null &&
      "data" in refreshResult.data
    ) {
      const newTokens = (refreshResult.data as any).data;
      setAccessToken(newTokens.accessToken);
      setRefreshToken(newTokens.refreshToken);

      // Retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      clearTokens();
    }
  }

  return result;
};

export const ecommerceApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    tagTypes: ["Product", "User"],
    endpoints: (builder) => ({
        getProducts: builder.query<TProductResponse, void>({
            query: () => GET_PRODUCTS_ENDPOINT,
            providesTags: [{ type: "Product", id: "LIST" }],
        }),
        authLogin: builder.mutation<TApiResponse<TTokens>, { username: string; password: string }>({
            query: (request) => ({
                url: AUTH_LOGIN_ENDPOINT,
                method: HTTP_METHOD_POST,
                body: request,
            }),
        }),
        authRefreshToken: builder.mutation<TApiResponse<TTokens>, { refreshToken: string }>({
            query: (request) => ({
                url: AUTH_REFRESH_TOKEN,
                method: HTTP_METHOD_POST,
                headers: {
                    "Authorization": `Bearer ${request.refreshToken}`
                },
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useAuthLoginMutation,
    useAuthRefreshTokenMutation,
} = ecommerceApi;
