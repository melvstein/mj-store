import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TUser } from "@/types";
import { TTokens } from "@/types/TAuth";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/services/AuthenticationService";
import HttpMethod from "@/constants/HttpMethod";
import { use } from "react";

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
        getUsers: builder.query<TApiResponse<any>, void>({
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
        createUser: builder.mutation<TApiResponse<TUser>, Partial<TUser>>({
            query: (user) => ({
                url: USERS_ENDPOINT,
                method: HttpMethod.POST,
                body: user,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        updateUser: builder.mutation<TApiResponse<TUser>, { id: string; user: Partial<TUser> }>({
            query: ({ id, user }) => ({
                url: `${USERS_ENDPOINT}/${id}`,
                method: HttpMethod.PATCH,
                body: user,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        deleteUser: builder.mutation<TApiResponse<any>, string>({
            query: (id) => ({
                url: `${USERS_ENDPOINT}/${id}`,
                method: HttpMethod.DELETE,
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;
