// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import paths from "./utils/paths";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // admin page
    if (pathname.startsWith(paths.admin.dashboard.main.path)) {
        const accessToken = request.cookies.get("accessToken")?.value;

        // If accessing a protected admin route but not /admin/login
        if (!pathname.startsWith(paths.admin.login.path) && !accessToken) {
            return NextResponse.redirect(new URL(paths.admin.login.path, request.url));
        }

        // If already logged in and tries to visit login page, redirect to admin
        if (accessToken && pathname === paths.admin.login.path) {
            return NextResponse.redirect(new URL(paths.admin.dashboard.main.path, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*"
    ],
};
