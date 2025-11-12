/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TApiResponse, TUpdateUser, TUser } from "@/types";
import { getAccessToken} from "@/services/AuthenticationService";
import HttpMethod from "@/constants/HttpMethod";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
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
                    "Authorization": `Bearer ${getAccessToken()}`
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
        updateUser: builder.mutation<TApiResponse<TUpdateUser>, { id: string; user: Partial<TUpdateUser> }>({
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
        updateUserPassword: builder.mutation<TApiResponse<any>, { id: string; currentPassword: string; newPassword: string }>({
            query: ({ id, currentPassword, newPassword }) => ({
                url: `${USERS_ENDPOINT}/${id}/password`,
                method: HttpMethod.PATCH,
                body: { currentPassword, newPassword },
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }),
        }),
        uploadProfileImage: builder.mutation<TApiResponse<any>, { id: string; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: `${USERS_ENDPOINT}/${id}/upload-profile-image`,
                    method: HttpMethod.POST,
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${getAccessToken()}`,
                    },
                };
            },
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateUserPasswordMutation,
    useUploadProfileImageMutation,
} = usersApi;
