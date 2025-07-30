import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import { useAuthenticatedUser, useLogout } from "@/services/AuthenticationService";
import paths from "@/utils/paths";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { ChevronsUpDown, ChevronUp, LogOut, User, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UserProfileSidebarMenuItem = () => {
    const { user } = useAuthenticatedUser();
    const { logout, isLogout } = useLogout();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const { open, isMobile } = useSidebar();

    useEffect(() => {
        if (isLogout) {
            setSuccessMessage("You have been logged out successfully.");
            router.replace(paths.admin.login.path);
        }
    }, [isLogout]);

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
    <SidebarMenuItem>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="flex items-center justify-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="flex items-center justify-center bg-foreground rounded-full border border-foreground size-8">
                        {/* <AvatarImage className="rounded-full" src="https://github.com/evilrabbit.png" alt="User Display Picture" /> */}
                        <AvatarImage className="rounded-full" src={user?.profileImageUrl} alt="User Display Picture" />
                        <AvatarFallback>
                            {user ? getInitials(user) : "MJ"}
                        </AvatarFallback>
                    </Avatar>
                    <div className={clsx("grid flex-1 text-left text-sm leading-tight", !open && !isMobile ? "hidden" : "block")}>
                        <span className="truncate font-medium">{ user?.username && user.username.charAt(0).toUpperCase() + user.username.slice(1) }</span>
                        <span className="truncate text-xs">{ user?.email }</span>
                    </div>
                    {/* <ChevronUp className={clsx(!open ? "hidden" : "block ml-auto")} /> */}
                    <ChevronsUpDown className={clsx(!open && !isMobile ? "hidden" : "block ml-auto size-4")} />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "center" : "end"}
                sideOffset={4}
                loop={false}
                className={clsx("w-(--radix-dropdown-menu-trigger-width) min-w-[270px] rounded-lg")}
            >
                <DropdownMenuItem>
                    <Link href={paths.admin.user.profile.main.path} className="flex items-center gap-2 w-full p-2 rounded hover:bg-secondary">
                        <User className="size-4" />
                        { paths.admin.user.profile.main.name }
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="#" onClick={logout} className="flex items-center gap-2 w-full p-2 rounded hover:bg-secondary">
                        <LogOut className="size-4" />
                        Log out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </SidebarMenuItem>
  )
};

export default UserProfileSidebarMenuItem;