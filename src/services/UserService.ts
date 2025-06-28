import { useGetUserQuery } from "@/lib/redux/services/usersApi"
import { TUser } from "@/types";
import { useEffect, useState } from "react";

export const getUser = ({ id } : { id: string }) => {
    const { data: response, error, isLoading } = useGetUserQuery({ id });
    const [user, setUser] = useState<TUser | []>([]);

    useEffect(() => {
        if (response?.data) {
            setUser(response?.data);
        }
    }, [response]);

    return {
        user,
        extra: {
            error,
            isLoading,
        }
    }
}