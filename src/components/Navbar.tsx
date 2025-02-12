"use client"

import Link from "next/link";
import type { TNavLink } from "@/types"
import { usePathname } from "next/navigation";
import Logo from "./Logo";

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
            <li key={link.id} className="flex items-stretch justify-center">
                <Link href={link.href} className={`px-6 hover:bg-white hover:text-blue-400 flex items-center justify-center ${pathName === link.href ? "bg-blue-500" : ""}`}>{ link.name }</Link>
            </li>
        )
    });

    return (
        <nav className="fixed top-0 left-0 right-0 flex items-stretch justify-between bg-blue-400 text-white">
            <div className="flex items-center justify-center">
                <Link href="" className="px-4 py-2 flex items-center justify-center space-x-2">
                    <Logo />
                    <p className="">MJ STORE</p>
                </Link>
            </div>
            <ul className="flex items-stretch justify-between">
                { li }
            </ul>
        </nav>
    );
}

export default Navbar;