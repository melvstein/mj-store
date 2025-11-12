import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { useAuthenticatedUser, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UserProfileNavigationMenuItem = () => {
    const { user } = useAuthenticatedUser();
    const { logout, isLogout } = useLogout();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (isLogout) {
            setSuccessMessage("You have been logged out successfully.");
            router.replace(paths.admin.login.path);
        }
    }, [isLogout, router]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            setErrorMessage(""); // Clear error message after showing toast
        }

        if (successMessage) {
            toast.success(successMessage);
            setSuccessMessage(""); // Clear success message after showing toast
        }
    }, [errorMessage, successMessage]);

  return (
    <NavigationMenuItem>
        <NavigationMenuTrigger className="flex items-center justify-center gap-2 bg-primary">
            <Avatar className="flex items-center justify-center bg-foreground rounded-full border border-foreground size-6">
                <AvatarImage className="rounded-full" src={user?.profileImageUrl} alt="User Display Picture" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            { user?.username && user.username.charAt(0).toUpperCase() + user.username.slice(1) }
        </NavigationMenuTrigger>
        <NavigationMenuContent>
            <div className="flex flex-col items-center justify-center w-[150px]">
                <NavigationMenuLink asChild>
                    <Link href={`${paths.admin.user.profile.main.path}/${user?.id}`} className="flex items-center gap-2 w-full p-2 hover:bg-secondary">
                        <User />
                        { paths.admin.user.profile.main.name }
                    </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                    <Link href="#" onClick={logout} className="flex items-center gap-2 w-full p-2 hover:bg-secondary">
                        <LogOut />
                        Logout
                    </Link>
                </NavigationMenuLink>
            </div>
        </NavigationMenuContent>
    </NavigationMenuItem>
  )
};

export default UserProfileNavigationMenuItem;