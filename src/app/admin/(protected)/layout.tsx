"use client";
import { clearTokens, isAuthenticated, setAccessToken, setRefreshToken, useAuthenticatedUser, useAuthRefreshToken } from "@/services/AuthenticationService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { useAuthRefreshTokenMutation } from "@/lib/redux/services/authenticationApi";
import AdminSidebar from "../components/AdminSidebar";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";
import Loading from "@/components/Loading/Loading";
import Response from "@/constants/Response";
import { toast } from "sonner";

const ProtectedLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [authRefreshToken, { error: authError, isLoading: authLoading }] = useAuthRefreshTokenMutation();
    const { user, extra: {
            error: userError,
            isLoading: isUserLoading
        } } = useAuthenticatedUser();
    const [authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        open,
    } = useSidebar();

    useEffect(() => {
        if (authError) {
            console.log('authError', authError);
            setIsLoading(false);
            return;
        }

        if (authLoading) {
            console.log('Auth is loading...');
            setIsLoading(authLoading);
            return;
        }

        if (isUserLoading) {
            console.log('User is loading...');
            setIsLoading(isUserLoading);
            return;
        }

        const validateSession = async () => {
            if (isAuthenticated()) {
                console.log("Authenticated");
                setAuthenticated(true);
                setIsLoading(false);
                return;
            }

            try {
                const response = await authRefreshToken().unwrap();

                if (response.code == Response.SUCCESS) {
                    const newAccessToken = response.data?.accessToken;
                    const newRefreshToken = response.data?.refreshToken;

                    if (newAccessToken) {
                        setAccessToken(newAccessToken);

                        if (newRefreshToken) {
                            setRefreshToken(newRefreshToken);
                            setAuthenticated(true);
                        }
                    } else {
                        clearTokens();
                        setIsLoading(false);
                        router.replace(paths.admin.login.path);
                        toast.error("Auth failed");
                    }
                } else {
                    clearTokens();
                    setIsLoading(false);
                    router.replace(paths.admin.login.path);
                    toast.error("Auth failed");
                }
            } catch (error) {
                clearTokens();
                setIsLoading(false);
                router.replace(paths.admin.login.path);
                toast.error("Auth failed");
            }
        }

        validateSession();
    }, [authLoading, authRefreshToken, router, isUserLoading]);

    if (isLoading) return <Loading duration={300} onComplete={ () => setIsLoading(false) } />

    return (
        <div className="min-h-screen w-full">
            <SidebarInset className={clsx(
                "md:ml-[260px] md:mt-2 md:mr-2 md:rounded-tl-2xl md:rounded-tr-2xl min-h-screen w-auto",
                open ? "transition-all" : "md:ml-[60px]"
            )}>
                {authenticated && (
                    <header className="border-b md:px-6 md:py-2 p-2">
                        <SidebarTrigger className="" />
                        {/* <AdminNavbar /> */}
                        <AdminSidebar />
                    </header>
                )}
                <main className="md:p-6 p-2">
                    {children}
                </main>
            </SidebarInset>
        </div>
    );
};

export default ProtectedLayout;
