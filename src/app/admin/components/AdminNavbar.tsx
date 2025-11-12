import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import UserNavigationMenuItem from "./UserProfileNavigationMenuItem";

const AdminNavbar = () => {
    return (
        <nav className="fixed top-0 inset-x-0 flex items-center justify-end bg-primary p-2">
            <NavigationMenu>
                <NavigationMenuList>
                    <UserNavigationMenuItem />
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
};

export default AdminNavbar;