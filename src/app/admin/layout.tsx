"use client"
import { useAdminRefreshTokenMutation } from "@/lib/redux/services/ecommerceApi";
import { getRefreshToken } from "@/utils/cookieUtils";
import { isAccessTokenExpired } from "@/utils/JwtUtils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const adminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();

    const [refreshToken] = useAdminRefreshTokenMutation();

    useEffect(() => {
        const refreshToken1 = getRefreshToken();
        const res =  refreshToken({ refreshToken: refreshToken1 });
console.log(res);
        if (isAccessTokenExpired()) {
           router.push("/admin/login");
        }
    }, [router]);

    return (
        <div>
            {children}
        </div>
    );
}

export default adminLayout;