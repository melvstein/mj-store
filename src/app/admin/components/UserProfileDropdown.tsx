"use client";

import UserImageDefault from "@/components/UserImageDefault";
import { useAuthenticatedUser, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCaretLeft, FaCaretDown } from "react-icons/fa6";
import { toast } from "react-toastify";

const UserProfileDropdown = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuthenticatedUser();
    const { logout, isLogout } = useLogout();
    const [openProfile, setOpenProfile] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null)
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Handle logout side-effect
    useEffect(() => {
        if (isLogout) {
            setSuccessMessage("You have been logged out successfully.");
            router.replace(paths.admin.login.path);
        }
    }, [isLogout, router]);

    // Handle error toast
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            setErrorMessage("");
        }
    }, [errorMessage]);

    // Handle success toast
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setSuccessMessage("");
        }
    }, [successMessage]);

    // Handle submenu open state based on pathname
    useEffect(() => {
        if (pathname.startsWith(paths.admin.user.profile.main.path)) {
            setIsSubMenuOpen(true);
        } else {
            setIsSubMenuOpen(false);
        }
    }, [pathname]);

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
        <div ref={ profileRef } className="relative w-full">
            <button onClick={() => setOpenProfile((prev) => !prev)} className={clsx("relative flex items-center justify-between whitespace-nowrap px-4 py-2 w-full transition-all", openProfile ? "shadow" : "", isSubMenuOpen ? "bg-secondary" : "")}>
                <span className="flex items-center justify-center gap-2">
                    <UserImageDefault className="size-6 bg-muted/50 rounded-full border border-skin-base" />
                    { user?.username && user?.username.charAt(0).toUpperCase() + user?.username.slice(1) }
                </span>
                { openProfile ? <FaCaretDown /> : <FaCaretLeft /> }
            </button>
            <ul className={`flex flex-col items-start justify-center w-full inset-x-0 bg-primary text-skin-base shadow-md ${openProfile ? 'block' : 'hidden'}`}>
                <li className="w-full">
                    <a href={`${paths.admin.user.profile.main.path}/${user?.id}`} className={clsx("flex items-center justify-start w-full pl-8 py-2", pathname.startsWith(paths.admin.user.profile.main.path) ? "bg-secondary/50" : "")}>Update Profile</a>
                </li>
                <li className="w-full">
                    <a onClick={logout} className="cursor-pointer flex items-center justify-start w-full pl-8 py-2">Logout</a>
                </li>
            </ul>
        </div>
    );
}

export default UserProfileDropdown;