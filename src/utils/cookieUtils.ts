// utils/auth.ts
import { setCookie, getCookie, deleteCookie } from "cookies-next";

// You can optionally pass context (req/res) for SSR support if needed

export const setTokens = (accessToken: string, refreshToken: string) => {
    setCookie("accessToken", accessToken, {
        path: "/admin",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour (adjust as needed)
    });
    setCookie("refreshToken", refreshToken, {
        path: "/admin",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
};

export const getAccessToken = (): string => {
     return getCookie("accessToken") as string;
};

export const getRefreshToken = (): string => {
     return getCookie("refreshToken") as string;
};

export const clearTokens = () => {
    deleteCookie("accessToken", { path: "/admin" });
    deleteCookie("refreshToken", { path: "/admin" });
};
