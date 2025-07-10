"use client";
import { useAuthenticatedUser} from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import UserProfileDropdown from "./UserProfileDropdown";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "@/components/Logo";
import { FaUsers, FaProductHunt } from "react-icons/fa";

const AdminSidebar = () => {
    const { user, extra } = useAuthenticatedUser();
    const pathname = usePathname();

    if (extra.isLoading) return null;

    return (
        <nav className="fixed left-0 inset-y-0 bg-primary flex flex-col items-start justify-start text-skin-base min-w-[250px]">
            <div className="border-b w-full">
                <a href={ paths.admin.dashboard.main.path } className={clsx("flex items-center justify-start gap-2 text-md font-bold uppercase w-full p-4", pathname == paths.admin.dashboard.main.path ? "bg-secondary": "")}>
                    <Logo />
                    <span>{ paths.admin.dashboard.main.name }</span>
                </a>
            </div>
            <div className={clsx("flex flex-col items-start justify-center w-full")}>
                <div className="w-full">
                    <a href={ paths.admin.users.main.path } className={clsx("flex items-center justify-start gap-2 px-4 py-2 w-full", pathname == paths.admin.users.main.path ? "bg-secondary": "")}>
                        <FaUsers />
                        <span>{ paths.admin.users.main.name }</span>
                    </a>
                </div>
                <div>
                    <a href={ paths.admin.products.main.path } className={clsx("flex items-center justify-start gap-2 px-4 py-2 w-full", pathname == paths.admin.products.main.path ? "bg-secondary": "")}>
                        <FaProductHunt />
                        <span>{ paths.admin.products.main.name }</span>
                    </a>
                </div>
                <UserProfileDropdown />
            </div>
        </nav>
    );
};

export default AdminSidebar;
