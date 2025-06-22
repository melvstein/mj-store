import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TProductResponse } from "@/types";
import { getAccessToken, getRefreshToken, setTokens } from "@/utils/cookieUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REDUCER_PATH = "ecommerceApi";
const HTTP_METHOD_POST = "POST";

const GET_PRODUCTS_ENDPOINT = "/products";
const ADMIN_LOGIN_ENDPOINT = "/auth/login";

// Base fetcher without header logic (shared for refresh + main queries)
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // send cookies if needed
});

export const baseQueryWithRefresh: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const accessToken = getAccessToken();

  let enhancedArgs = typeof args === "string" ? { url: args } : { ...args };

  if (accessToken) {
    enhancedArgs.headers = {
      ...(enhancedArgs.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  let result = await rawBaseQuery(enhancedArgs, api, extraOptions);

  // Token expired, try refresh
  if (result?.error?.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return result;

    const refreshResult = await rawBaseQuery(
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

      console.warn("Token refresh failed:", refreshResult.error);
    if (refreshResult?.data?.data?.accessToken) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResult.data.data;
      setTokens(newAccessToken, newRefreshToken);

      // Retry original request with new token
      if (typeof args !== "string") {
        enhancedArgs.headers = {
          ...(enhancedArgs.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
      }

      result = await rawBaseQuery(enhancedArgs, api, extraOptions);
    } else {
      console.warn("Token refresh failed:", refreshResult.error);
    }
  }

  return result;
};

export type TLoginResponse = {
  code: string;
  message: string;
  data: any;
};

export const ecommerceApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getProducts: builder.query<TProductResponse, void>({
      query: () => GET_PRODUCTS_ENDPOINT,
    }),
    adminLogin: builder.mutation<TLoginResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: ADMIN_LOGIN_ENDPOINT,
        method: HTTP_METHOD_POST,
        body: credentials,
      }),
    }),
    adminRefreshToken: builder.mutation<TLoginResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: HTTP_METHOD_POST,
        body,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAdminLoginMutation,
  useAdminRefreshTokenMutation,
} = ecommerceApi;
