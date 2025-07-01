"use client";
import { useAuthenticatedUser, useAuthentication, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const AdminNavbar = () => {
    const router = useRouter();
    const { user } = useAuthenticatedUser();
    const { logout, isLogout } = useLogout();
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null)

    console.log(user);

    useEffect(() => {
        if (isLogout) {
            router.replace(paths.admin.login);
        }
    }, [isLogout]);

    useEffect(() => {
        if (!openProfile) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openProfile]);

    return (
        <nav className="fixed top-0 inset-x-0 bg-skin-primary flex items-center justify-between p-4 text-skin-base">
            <div>
                <a href={ paths.admin.main } className="text-md font-bold uppercase">Dashboard</a>
            </div>
            <div className="flex items-center justify-center gap-4">
                <div>
                    <a href={ paths.admin.users }>Users</a>
                </div>
                <div>
                    <a href={ paths.admin.products }>Products</a>
                </div>
                <div ref={ profileRef }>
                    <button onClick={() => setOpenProfile((prev) => !prev)} className="relative">
                        { user?.username && user?.username.charAt(0).toUpperCase() + user?.username.slice(1) }
                    </button>
                    <ul className={`absolute right-4 p-4 space-y-2 bg-skin-primary text-skin-base border border-skin-base rounded shadow-md ${openProfile ? 'block' : 'hidden'}`}>
                        <li>
                            <a href={`/admin/user/${user?.id}/update`} className="flex items-center justify-start">Update Profile</a>
                        </li>
                        <li>
                            <a onClick={logout} className="cursor-pointer flex items-center justify-start">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
