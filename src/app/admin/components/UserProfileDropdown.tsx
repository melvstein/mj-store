"use client";

import { useToastMessage } from "@/hooks/useToastMessage";
import { useAuthenticatedUser, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCaretLeft, FaCaretDown } from "react-icons/fa6";

const UserProfileDropdown = () => {
    const router = useRouter();
    const { user } = useAuthenticatedUser();
    const { logout, isLogout } = useLogout();
    const [openProfile, setOpenProfile] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const profileRef = useRef<HTMLDivElement>(null)

    useToastMessage(errorMessage, "error");
    useToastMessage(successMessage, "success");

    useEffect(() => {
        if (isLogout) {
            setSuccessMessage("You have been logged out successfully.");
            router.replace(paths.admin.login);
        }

        if (errorMessage) {
            setErrorMessage(""); // Clear error message after showing toast
        }

        if (successMessage) {
            setSuccessMessage(""); // Clear success message after showing toast
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
        <div ref={ profileRef }>
            <button onClick={() => setOpenProfile((prev) => !prev)} className="relative flex items-center justify-center whitespace-nowrap">
                { user?.username && user?.username.charAt(0).toUpperCase() + user?.username.slice(1) } { openProfile ? <FaCaretDown /> : <FaCaretLeft /> }
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
    );
}

export default UserProfileDropdown;