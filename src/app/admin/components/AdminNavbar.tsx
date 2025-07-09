"use client";
import { useAuthenticatedUser} from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import UserProfileDropdown from "./UserProfileDropdown";

const AdminNavbarLocal = () => {
    const { user, extra } = useAuthenticatedUser();

    if (extra.isLoading) return null;

    return (
        <nav className="fixed top-0 inset-x-0 bg-skin-primary flex items-center justify-between p-4 text-skin-base">
            <div>
                <a href={ paths.admin.dashboard.main.path } className="text-md font-bold uppercase">{ paths.admin.dashboard.main.name }</a>
            </div>
            <div className="flex items-center justify-center gap-4">
                <div>
                    <a href={ paths.admin.users.main.path }>{ paths.admin.users.main.name }</a>
                </div>
                <div>
                    <a href={ paths.admin.products.main.path }>{ paths.admin.products.main.name }</a>
                </div>
                <UserProfileDropdown />
            </div>
        </nav>
    );
};

export default AdminNavbarLocal;
