"use client";
import { useAuthentication, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminNavbar = () => {
    const router = useRouter();
    const { isAuthenticated, userDetails } = useAuthentication();
    const { logout, isLogout } = useLogout();

    console.log(userDetails);

    useEffect(() => {
        if (isLogout) {
            router.replace(paths.admin.login);
        }
    }, [isLogout]);

    return (
        <nav className="fixed top-0 inset-x-0 bg-skin-primary flex items-center justify-between p-4">
            <div>
                <h1 className="text-2xl font-bold text-skin-base uppercase">{ userDetails?.role }</h1>
            </div>
            <div>
                <a onClick={logout} className="cursor-pointer">Logout</a>
            </div>
        </nav>
    );
};

export default AdminNavbar;
