"use client";
import { clearTokens, isAuthenticated, setAccessToken, setRefreshToken, useAuthRefreshToken } from "@/services/AuthenticationService";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { useAuthRefreshTokenMutation } from "@/lib/redux/services/authenticationApi";
import Spinner from "@/components/Loading/Spinner";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const ProtectedLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [authRefreshToken] = useAuthRefreshTokenMutation();

    useEffect(() => {
        const validateSession = async () => {
            if (isAuthenticated()) {
                console.log("Authenticated");
                setAuthenticated(true);
                setLoading(false);
                return;
            }

            try {
                const response = await authRefreshToken().unwrap();
                const newAccessToken = response.data?.accessToken;
                const newRefreshToken = response.data?.refreshToken;

                if (newAccessToken) {
                    setAccessToken(newAccessToken);

                    if (newRefreshToken) {
                        console.log("New refresh token received:", newRefreshToken);
                        setRefreshToken(newRefreshToken);
                    }

                    setAuthenticated(true);
                } else {
                    clearTokens();
                    router.replace(paths.admin.login.path);
                }

            } catch (error) {
                clearTokens();
                router.replace(paths.admin.login.path);
            } finally {
                setLoading(false);
            }
        }

        validateSession();
    }, [authRefreshToken, router]);

    if (loading) return <Spinner />

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="ml-[200px] p-24">
            {authenticated && (
                <header>
                    <AdminNavbar />
                    <AdminSidebar />
                </header>
            )}
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </div>
        </SidebarProvider>
    );
};

export default ProtectedLayout;
