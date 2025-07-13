"use client";

import { useRouter } from "next/navigation";
import UsersList from "./components/UsersList";
import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const UsersPage = () => {
    const router = useRouter();

    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.users.main.path,
            name: paths.admin.users.main.name,
        },
    ];

    return (
        <div className="grid gap-4">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <UsersList />
        </div>
    );
}

export default UsersPage;