import { useGetUsersQuery } from "@/lib/redux/services/usersApi";
import { TUser } from "@/types";
import UserTable from "./UserTable";
import Spinner from "@/components/Loading/Spinner";

const UsersList = () => {
    const { data: response, error, isLoading } = useGetUsersQuery();
    const users: TUser[] = response?.data?.content ?? [];
    console.log("UsersList response:", users);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-red-500">Error loading users: {(error as any).data.message}</p>
            </div>
        );
    }
    return (
        <div>
            <UserTable data={users} />
        </div>
    );
}

export default UsersList;