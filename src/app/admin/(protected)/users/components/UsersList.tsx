import { useGetUsersQuery } from "@/lib/redux/services/usersApi";
import { TUser } from "@/types";
import UserTable from "./UserTable";
import Spinner from "@/components/Loading/Spinner";
import { useEffect, useState } from "react";
import { UserDataTable } from "./UserDataTable";
import { DataTableDemo } from "@/components/Demo/DemoTable";

const UsersList = () => {
    
    return (
        <div>
            <UserDataTable />
        </div>
    );
}

export default UsersList;