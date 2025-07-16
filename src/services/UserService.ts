import Response from "@/constants/Response";
import { useCreateUserMutation, useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from "@/lib/redux/services/usersApi"
import { TUpdateUser, TUser } from "@/types";
import { useEffect, useState } from "react";

export const useUser = ({ id }: { id: string }) => {
    const [user, setUser] = useState<TUser | null>(null);

    const {data: response, error, isLoading} = useGetUserQuery(id!, {
        skip: !id,
    });

    useEffect(() => {
        if (response?.data) {
            setUser(response.data);
        }
    }, [response]);

    return {
        user,
        extra: {
            error,
            isLoading,
        },
    };
};

export const useCreateUserHandler = () => {
    const [doCreateUser] = useCreateUserMutation();

    const createUser = async (user: Partial<TUser>) => {
        try {
            const response = await doCreateUser(user).unwrap();
            return response;
        } catch (err: any) {
            if (err?.data?.message) {
                throw new Error(err.data.message);
            } else if (err?.message) {
                throw new Error(err.message);
            } else {
                throw new Error("An unknown error occurred while creating the user.");
            }
        }
    };

    return createUser;
};

export const useUpdateUser = () => {
    const [doUpdate, { data, error, isLoading }] = useUpdateUserMutation();

    const updateUser = async ({ id, user} : { id: string, user: TUpdateUser }) => {
        if (!id) return;

        try {
            const response = await doUpdate({ id, user }).unwrap();

            return {
                success: response?.code === Response.SUCCESS,
                data: response
            };
        } catch(err) {
            console.error("Update failed:", err);
            return {
                success: false,
                error: err
            };
        }
    };

    return {
        updateUser,
        extra: {
            error,
            isLoading,
        }
    }
}

export const useDeleteUser = () => {
    const [doDelete, { data, error, isLoading }] = useDeleteUserMutation();
    const [isDeleted, setIsDeleted] = useState(false);

    const deleteUser = async (id: string) => {
        if (!id) return;

        try {
            const response = await doDelete(id).unwrap();

            if (response?.code === Response.SUCCESS) {
                setIsDeleted(true);
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return {
        deleteUser,
        isDeleted,
        extra: {
            error,
            isLoading,
        },
    };
};
