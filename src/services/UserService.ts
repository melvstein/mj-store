import { useGetUserQuery } from "@/lib/redux/services/usersApi"
import { TUser } from "@/types";
import { useEffect, useState } from "react";

export const useUser = ({ id }: { id: string | null }) => {
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
