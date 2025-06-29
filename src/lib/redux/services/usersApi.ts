import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TUser } from "@/types";
import { TTokens } from "@/types/TAuth";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/services/AuthenticationService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REDUCER_PATH = "usersApi";
const USERS_ENDPOINT = "/users";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

export const usersApi = createApi({
    reducerPath: REDUCER_PATH,
    baseQuery,
    endpoints: (builder) => ({
        getUsers: builder.query<TApiResponse<TUser[]>, void>({
            query: () => USERS_ENDPOINT,
        }),
        getUser: builder.query<TApiResponse<TUser>, string>({
            query: (id) => ({
                url: USERS_ENDPOINT + `/${id}`,
                headers: {
                    "Authorization": `Bearer ${getRefreshToken()}`
                },
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
} = usersApi;
