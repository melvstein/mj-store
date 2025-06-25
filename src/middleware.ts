// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import paths from "./utils/paths";
import { isTokenExpired } from "./services/JwtService";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // admin page
    /* if (pathname.startsWith(paths.admin.main)) {
        const accessToken = request.cookies.get("accessToken")?.value;
        const isExpired = accessToken ? isTokenExpired(accessToken) : true;

        // If accessing a protected admin route but not /admin/login
        if (!pathname.startsWith(paths.admin.login) && !accessToken) {
            return NextResponse.redirect(new URL(paths.admin.login, request.url));
        }

        // If already logged in and tries to visit login page, redirect to admin
        if (accessToken && pathname === paths.admin.login) {
            return NextResponse.redirect(new URL(paths.admin.main, request.url));
        }
    } */

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*"
    ],
};
