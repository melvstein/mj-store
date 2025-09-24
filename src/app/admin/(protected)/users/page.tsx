"use client";

import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";
import { UserDataTable } from "./components/UserDataTable";

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
        <div className="">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <UserDataTable />
        </div>
    );
}

export default UsersPage;