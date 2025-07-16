import { ChevronLeft, ChevronRight, List, UserRoundPlus, Users } from "lucide-react"
 
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import UserProfileSidebarMenuItem from "./UserProfileSidebarMenuItem";
import clsx from "clsx";
import AppLogo from "@/components/AppLogo";
import paths from "@/utils/paths";
import Link from "next/link";
import { FaProductHunt } from "react-icons/fa";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { title } from "process";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
 
// Menu items.
const items = [
    {
        title: paths.admin.users.main.name,
        icon: Users,
        dropdown: [
            {
                title: "List",
                url: paths.admin.users.main.path,
                icon: List,
            },
            {
                title: paths.admin.users.register.name,
                url: paths.admin.users.register.path,
                icon: UserRoundPlus,
            },
        ]
    },
    {
        title: paths.admin.products.main.name,
        url: paths.admin.products.main.path,
        icon: FaProductHunt,
    },
];

const AdminSidebar = () => {
    const { open, isMobile, openMobile } = useSidebar();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <Link 
                    href={ paths.admin.dashboard.main.path } 
                    className={clsx(
                        "flex items-center justify-start gap-2 text-md font-bold uppercase w-full px-2",
                        open ? "justify-start" : "justify-center",
                        isMobile ? "pt-2" : ""
                    )}
                >
                    <AppLogo className={clsx(open || isMobile ? "size-8" : "size-[24px]")} />
                    <span className={clsx(open || isMobile ? "block" : "hidden")}>{ paths.admin.dashboard.main.name }</span>
                </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map((item, index) => 
                            item.dropdown ? (
                                <Collapsible key={item.title + index} defaultOpen={false} className="group/collapsible">
                                    <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <item.icon />
                                            <span>{item.title}</span>
                                            <ChevronLeft className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {
                                                item.dropdown.map((subItem, subIndex) => {
                                                    return (
                                                        <SidebarMenuSubItem key={ subItem.title + subIndex }>
                                                            <Link
                                                                href={ subItem.url }
                                                                className={clsx(
                                                                    "flex items-center justify-start gap-2 px-3 py-2 rounded text-sm hover:bg-secondary",
                                                                    isActive(subItem.url) && "bg-secondary"
                                                                )}
                                                            >
                                                                <subItem.icon className="size-4" />
                                                                { subItem.title }
                                                            </Link>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })
                                            }
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <UserProfileSidebarMenuItem />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AdminSidebar;
