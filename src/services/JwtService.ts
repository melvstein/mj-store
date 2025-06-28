"use client"
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    exp: number; // expiration time in seconds
    [key: string]: any; // any other custom fields
};

const isExpired = (expiration: number) => {
    return expiration * 1000 < Date.now();
};

export const extractUserId = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId;
}

const extractExpiration = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp;
}

export const isTokenExpired = (token: string) => {
    if (!token) return false;

    const expiration = extractExpiration(token);

    if (isExpired(expiration)) {
        return true;
    }

    return false;
}