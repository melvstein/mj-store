import { jwtDecode } from "jwt-decode";
import { clearTokens, getAccessToken, getRefreshToken } from "./cookieUtils";

type TTokens = {
    accessToken: string;
    refreshToken: string;
}

export const isAccessTokenExpired = () => {
    type JwtPayload = {
        exp: number; // expiration time in seconds
        [key: string]: any; // any other custom fields
    };

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken) {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const isAccessTokenExpired = decoded.exp * 1000 < Date.now();

        if (isAccessTokenExpired) {
            console.log("accessToken has expired");

            clearTokens();
            return true;
        } else {
            console.log("accessToken is valid", decoded);
            return false;
        }
    }

    console.log("No accessToken");
    return true;
}