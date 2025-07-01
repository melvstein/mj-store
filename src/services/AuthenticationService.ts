"use client"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { extractUserId, isTokenExpired } from "./JwtService";
import { useAuthLogoutMutation, useAuthRefreshTokenMutation } from "@/lib/redux/services/authenticationApi";
import { useEffect, useRef, useState } from "react";
import Response from "@/constants/Response";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import { useUser } from "./UserService";
import { TUser } from "@/types";

export const setAccessToken = (accessToken: string) => {
    setCookie("accessToken", accessToken, {
        path: "/",
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
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
};

export const getRefreshToken = (): string => {
     return getCookie("refreshToken") as string;
};

export const clearTokens = () => {
    deleteCookie("accessToken", { path: "/" });
    deleteCookie("refreshToken", { path: "/" });
};

export const isAuthenticated = (): boolean => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return false;
    }

    if (isTokenExpired(accessToken)) {
        return false
    }

    return true;
}

export const useAuthenticatedUser = () => {
    const userId = extractUserId(getAccessToken());
    const { user, extra: { error, isLoading } } = useUser({ id: userId });

    return {
        user,
        extra: {
            error,
            isLoading,
        },
    };
}

export const useAuthentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState<TUser | null>(null);

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const isMounted = useRef(true);

    const userId = extractUserId(accessToken) ?? null;
    const { user, extra } = useUser({ id: userId });

    useEffect(() => {
        setUserDetails(user ?? null);
    }, [user]);

    useEffect(() => {
        isMounted.current = true;

        if (!accessToken || !refreshToken) {
            setIsAuthenticated(false);
            return;
        }

        if (!isTokenExpired(accessToken)) {
            setIsAuthenticated(true);
            return;
        }

        if (isTokenExpired(refreshToken)) {
            clearTokens();
            setIsAuthenticated(false);
            return;
        }
        return () => {
            isMounted.current = false;
        };
    }, [accessToken, refreshToken]);

    return {
        isAuthenticated,
        userDetails,
    };
};

type UseAuthenticationWithRefreshToken = {
    enableRefreshToken: boolean;
};


export const useAuthenticationWithRefreshToken = ({ enableRefreshToken }: UseAuthenticationWithRefreshToken) => {
    const [authRefreshToken, { data, error, isLoading }] = useAuthRefreshTokenMutation();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [userDetails, setUserDetails] = useState<TUser | null>(null);

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const isMounted = useRef(true);
    const refreshInProgress = useRef(false); // Prevent multiple refreshes

    const userId = extractUserId(accessToken) ?? null;
    const { user,
        extra: {
            error: userError,
            isLoading: isUserLoading,
        } } = useUser({ id: userId });

    useEffect(() => {
        setUserDetails(user ?? null);
    }, [user]);

    useEffect(() => {
        isMounted.current = true;

        if (isLoading) return;

        if (!accessToken || !refreshToken) {
            setIsAuthenticated(false);
            return;
        }

        if (!isTokenExpired(accessToken)) {
            setIsAuthenticated(true);
            return;
        }

        if (isTokenExpired(refreshToken)) {
            clearTokens();
            setIsAuthenticated(false);
            return;
        }

        if (enableRefreshToken && !refreshInProgress.current) {
            refreshInProgress.current = true;

            const processRefreshToken = async () => {
                if (!refreshToken || isTokenExpired(refreshToken)) {
                    setIsRefreshed(false);
                    setIsAuthenticated(false);
                    refreshInProgress.current = false;
                    return;
                }

                try {
                    const response = await authRefreshToken().unwrap();

                    if (response?.data?.accessToken && response?.data?.refreshToken) {
                        setAccessToken(response.data.accessToken);
                        setRefreshToken(response.data.refreshToken);

                        if (isMounted.current) {
                            setIsRefreshed(true);
                            setIsAuthenticated(true);
                        }
                        // Instead of reloading, trigger a state update to re-check cookies
                        setTimeout(() => {
                            if (isMounted.current) {
                                setIsAuthenticated(true);
                            }
                        }, 100); // Give browser time to set cookies
                    } else {
                        console.log("Failed to refresh token response:", response);

                        if (isMounted.current) {
                            setIsRefreshed(false);
                            setIsAuthenticated(false);
                        }
                        clearTokens();
                    }
                } catch (err) {
                    console.log("Failed to refresh token err:", err);

                    if (isMounted.current) {
                        setIsRefreshed(false);
                        setIsAuthenticated(false);
                    }
                    clearTokens();
                } finally {
                    refreshInProgress.current = false;
                }
            };
            processRefreshToken();
        }

        return () => {
            isMounted.current = false;
        };
    }, [accessToken, refreshToken, authRefreshToken, enableRefreshToken, isLoading]);

    return {
        isAuthenticated,
        authRefreshToken: {
            isRefreshed, data, error, isLoading,
        },
        userDetails,
    };
};

export const useAuthRefreshToken = (enabled: boolean = true) => {
    const [authRefreshToken, { data, error, isLoading }] = useAuthRefreshTokenMutation();
    const [isRefreshed, setIsRefreshed] = useState(false);
    const refreshToken = getRefreshToken();

    useEffect(() => {
        if (!enabled) return;

        const processRefreshToken = async () => {
            if (!refreshToken) return;

            try {
                const response = await authRefreshToken().unwrap();

                if (response?.data?.accessToken && response?.data?.refreshToken) {
                    clearTokens(); // optional depending on your flow
                    setAccessToken(response.data.accessToken);
                    setRefreshToken(response.data.refreshToken);
                    setIsRefreshed(true);
                } else {
                    console.warn("Unexpected refresh token response:", response);
                }
            } catch (err) {
                console.log("Failed to refresh token:", err);
                // clearTokens(); // uncomment if token failure should log user out
            }
        };

        processRefreshToken();
    }, [enabled, refreshToken, authRefreshToken]);

    return { isRefreshed, data, error, isLoading };
};

export const useLogout = () => {
    const [authLogout, { data, error, isLoading }] = useAuthLogoutMutation();
    const [isLogout, setIsLogout] = useState(false);
    const router = useRouter();

    const logout = async () => {
        const accessToken = getAccessToken();
        const userId = extractUserId(accessToken);
        console.log("userId", userId);
        if (!userId) return;

        try {
            const response = await authLogout({ id: userId }).unwrap();
            if (response?.code === Response.SUCCESS) {
                setIsLogout(true);
                clearTokens();
                router.replace(paths.admin.login);
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return {
        logout,
        isLogout,
        extra: {
            error,
            isLoading,
        },
    };
};