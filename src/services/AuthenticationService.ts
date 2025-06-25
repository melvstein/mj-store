import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { isTokenExpired } from "./JwtService";
import { useAuthRefreshTokenMutation } from "@/lib/redux/services/ecommerceApi";
import { useEffect, useRef, useState } from "react";
import { error } from "console";

export const setAccessToken = (accessToken: string) => {
    setCookie("accessToken", accessToken, {
        path: "/admin",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour (adjust as needed)
    });
};

export const getAccessToken = (): string => {
     return getCookie("accessToken") as string;
};

export const setRefreshToken = (refreshToken: string) => {
    setCookie("refreshToken", refreshToken, {
        path: "/admin",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
};

export const getRefreshToken = (): string => {
     return getCookie("refreshToken") as string;
};

export const clearTokens = () => {
    deleteCookie("accessToken", { path: "/admin" });
    deleteCookie("refreshToken", { path: "/admin" });
};

export const isAuthenticated = (): boolean => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
        return false;
    }

    if (isTokenExpired(accessToken)) {
        if (isTokenExpired(refreshToken)) {
            clearTokens();
            return false;
        }
    }

    return true;
}

export const useAuthRefreshToken = () => {
    const [authRefreshToken, {data, error, isLoading}] = useAuthRefreshTokenMutation();
    const [isRefreshed, setIsRefreshed] = useState(false);

    useEffect(() => {
        const processRefreshToken = async () => {
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const response = await authRefreshToken({ refreshToken }).unwrap();
                    if (response?.data?.accessToken && response?.data?.refreshToken) {
                        clearTokens();
                        setAccessToken(response.data.accessToken);
                        setRefreshToken(response.data.refreshToken);
                        setIsRefreshed(true);
                    } else {
                        console.log("Invalid refresh token response format:", response);
                        // clearTokens();
                    }
                } catch (err) {
                    console.log("Refresh token failed:", err);
                    // clearTokens();
                }
            }
        };

        processRefreshToken();

    }, [authRefreshToken]);

    return { isRefreshed, data, error, isLoading};
};