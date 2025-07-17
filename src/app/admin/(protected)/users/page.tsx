"use client";

import UsersList from "./components/UsersList";
import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";

const UsersPage = () => {
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