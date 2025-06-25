"use client"
import { getRefreshToken, isAuthenticated, useAuthRefreshToken } from "@/services/AuthenticationService";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import Loading from "./loading";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();
    const authenticated = isAuthenticated();
    const refreshToken = getRefreshToken();

    if (authenticated) {
        console.log("User is authenticated");

       const { isRefreshed, data, error, isLoading } = useAuthRefreshToken();

       if (isLoading) {
           return <Loading />;

       }

       console.log("isRefreshed:", { isRefreshed, data, error, isLoading });
    } else {
        useEffect(() => {
            router.push("/admin/login");
        }, [router]);
    }

    return (
        <div>
            {children}
        </div>
    );
}

export default AdminLayout;