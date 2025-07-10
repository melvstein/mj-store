"use client";

import { useRouter } from "next/navigation";
import UsersList from "./components/UsersList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";

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
        <div className="container mx-auto flex flex-col gap-4 p-4">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <div className="flex items-center justify-end">
                <button onClick={ () => router.replace("/admin/users/register") } className="bg-primary px-4 py-2 rounded text-skin-base hover:bg-secondary">
                    Register User
                </button>
            </div>
            <UsersList />
        </div>
    );
}

export default UsersPage;