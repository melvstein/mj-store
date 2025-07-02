"use client";
import { useAuthenticatedUser} from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import {useRef, useState } from "react";
import UserProfileDropdown from "./UserProfileDropdown";

const AdminNavbarLocal = () => {
    const { user } = useAuthenticatedUser();
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null)

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
                <UserProfileDropdown />
            </div>
        </nav>
    );
};

export default AdminNavbarLocal;
