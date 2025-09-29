import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TUser } from "@/types";
import { TTokens } from "@/types/TAuth";
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from "@/services/AuthenticationService";
import HttpMethod from "@/constants/HttpMethod";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
const REDUCER_PATH = "authenticationApi";
const AUTH_REGISTER_ENDPOINT = "/auth/register";
const AUTH_LOGIN_ENDPOINT = "/auth/login";
const AUTH_REFRESH_TOKEN_ENDPOINT = "/auth/refresh-token";
const AUTH_LOGOUT_ENDPOINT = "/auth/logout";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
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

export const authenticationApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        authRegister: builder.mutation<TApiResponse<TUser>, Partial<TUser>>({
            query: (user) => ({
                url: AUTH_REGISTER_ENDPOINT,
                method: HttpMethod.POST,
                body: user,
            }),
        }),
        authLogin: builder.mutation<TApiResponse<TTokens>, { username: string; password: string }>({
            query: (request) => ({
                url: AUTH_LOGIN_ENDPOINT,
                method: HttpMethod.POST,
                body: request,
            }),
        }),
        authLogout: builder.mutation<TApiResponse, { id: string }>({
            query: (request) => ({
                url:  `${AUTH_LOGOUT_ENDPOINT}/${request.id}`,
                method: HttpMethod.POST,
                headers: {
                    "Authorization": `Bearer ${getRefreshToken()}`
                },
            }),
        }),
        authRefreshToken: builder.mutation<TApiResponse<TTokens>, void>({
            query: () => ({
                url: AUTH_REFRESH_TOKEN_ENDPOINT,
                method: HttpMethod.POST,
                headers: {
                    "Authorization": `Bearer ${getRefreshToken()}`
                },
            }),
        }),
    }),
});

export const {
    useAuthRegisterMutation,
    useAuthLoginMutation,
    useAuthLogoutMutation,
    useAuthRefreshTokenMutation,
} = authenticationApi;
