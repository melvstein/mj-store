"use client";
import { clearTokens, isAuthenticated, setAccessToken, setRefreshToken, useAuthRefreshToken } from "@/services/AuthenticationService";
import { usePathname, useRouter } from "next/navigation";
import Loading from "../loading";
import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import paths from "@/utils/paths";
import { useAuthRefreshTokenMutation } from "@/lib/redux/services/authenticationApi";

const ProtectedLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [authRefreshToken] = useAuthRefreshTokenMutation();

    useEffect(() => {
        const validateSession = async () => {
            if (isAuthenticated()) {
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
                    router.replace(paths.admin.login);
                }

            } catch (error) {
                clearTokens();
                router.replace(paths.admin.login);
            } finally {
                setLoading(false);
            }
        }

        validateSession();
    }, [authRefreshToken, router]);

    if (loading) return <Loading />

    return (
        <div className="container mx-auto">
        {authenticated && (
            <header>
            <AdminNavbar />
            </header>
        )}
            {children}
        </div>
    );
};

export default ProtectedLayout;
