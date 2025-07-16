"use client";
import { clearTokens, isAuthenticated, setAccessToken, setRefreshToken, useAuthRefreshToken } from "@/services/AuthenticationService";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { useAuthRefreshTokenMutation } from "@/lib/redux/services/authenticationApi";
import AdminSidebar from "../components/AdminSidebar";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";
import Loading from "@/components/Loading/Loading";

const ProtectedLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [authRefreshToken, { isLoading: authLoading }] = useAuthRefreshTokenMutation();
    const [authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar();

    useEffect(() => {
        if (authLoading) {
            setIsLoading(authLoading);
            return;
        }

        const validateSession = async () => {
            if (isAuthenticated()) {
                console.log("Authenticated");
                setAuthenticated(true);
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
                        setAuthenticated(true);
                    }
                } else {
                    clearTokens();
                    router.replace(paths.admin.login.path);
                }
            } catch (error) {
                clearTokens();
                router.replace(paths.admin.login.path);
            }
        }

        validateSession();
    }, [authLoading, authRefreshToken, router]);

    if (isLoading) return <Loading onComplete={ () => setIsLoading(false) } duration={300} />

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
