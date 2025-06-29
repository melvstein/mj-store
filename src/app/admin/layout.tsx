"use client"
import { useAuthenticationWithRefreshToken } from "@/services/AuthenticationService";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./loading";
import Unauthorized from "@/components/errors/Unauthorized";
import paths from "@/utils/paths";
import { useEffect } from "react";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, authRefreshToken } = useAuthenticationWithRefreshToken({ enableRefreshToken: true });
    const isLoading = authRefreshToken.isLoading;

    useEffect(() => {
        if (isAuthenticated && pathname === "/admin/login") {
            console.log("User is authenticated, redirecting to admin dashboard");
            router.replace("/admin")
        } else if (!isAuthenticated && pathname !== "/admin/login") {
            router.replace("/admin/login");
        }
    }, [isAuthenticated, pathname, router]);

    if (isLoading) {
        return <Loading />;
    }

    /* if (!isAuthenticated && pathname !== "/admin/login") {
            router.replace("/admin/login");
    } */

    return (
        <div>
            {children}
        </div>
    );
}

export default AdminLayout;