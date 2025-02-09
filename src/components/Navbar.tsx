"use client"

import Link from "next/link";
import type { TNavLink } from "@/types"
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
    const pathName = usePathname();

    const links: TNavLink[] = [
        {
            id: 1,
            name: "Products",
            href: "/",
        },
        {
            id: 2,
            name: "Cart",
            href: "/cart",
        },
        {
            id: 3,
            name: "Login",
            href: "/login",
        },
    ];

    const li = links.map((link) => {
        return (
            <li key={link.id} className="flex items-center justify-center">
                <Link href={link.href} className={`px-4 py-2 hover:bg-white hover:text-blue-400 ${pathName === link.href ? "bg-blue-500" : ""}`}>{ link.name }</Link>
            </li>
        )
    });

    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between bg-blue-400 text-white">
            <div className="flex items-center justify-center">
                <Link href="" className="px-4 py-2 hover:bg-white hover:text-blue-400">MJ STORE</Link>
            </div>
            <ul className="flex items-center justify-between">
                { li }
            </ul>
        </nav>
    );
}

export default Navbar;