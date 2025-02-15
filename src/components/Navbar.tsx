"use client"

import Link from "next/link";
import type { TNavLink } from "@/types"
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

const Navbar: React.FC = () => {
    const { data: session } = useSession();
    const pathName = usePathname();
    const [open, setOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            name: "Signin",
            href: "/signin",
        },
    ];

    const filteredLinks = session?.user 
    ? links.filter(link => link.name !== "Signin")
    : links;

    const li = filteredLinks.map((link) => (
        <li key={link.id} className="flex items-stretch justify-center">
            <Link 
                href={link.href} 
                className={`px-6 hover:bg-white hover:text-blue-400 flex items-center justify-center ${pathName === link.href ? "bg-blue-500" : ""}`}
            >
                {link.name}
            </Link>
        </li>
    ));

    return (
        <SessionProvider>
            <nav className="fixed top-0 left-0 right-0 flex items-stretch justify-between bg-skin-primary text-skin-base">
                <div className="flex items-center justify-center">
                    <Link href="" className="px-4 py-2 flex items-center justify-center space-x-2">
                        <Logo />
                        <p className="">MJ STORE</p>
                    </Link>
                </div>
                <ul className="flex items-stretch justify-between">
                    { li }
                    <li className="flex items-stretch justify-center">
                        {session?.user &&
                            <div ref={dropDownRef} className="relative flex items-stretch justify-center" onClick={() => setOpen(!open)}>
                                <div className={`px-6 flex items-center justify-center cursor-pointer gap-2`}>
                                    <Image src={ session.user.image as string } width={50} height={50} alt="Profile" className="rounded-full size-[35px] ring ring-skin-base" />
                                </div>

                                <div className={`absolute top-[60px] right-[20px] bg-skin-primary flex-col items-start justify-center rounded-lg border shadow-lg w-[250px] ` + `${open ? 'flex' : 'hidden'}`}>
                                    <div className="flex flex-col items-start justify-center p-4 w-full">
                                        <p className="font-semibold">{ session.user.name }</p>
                                        <p className="">{ session.user.email }</p>
                                    </div>
                                    <div className="flex items-center justify-start p-4 cursor-pointer w-full" onClick={ async () => await signOut() }>
                                        Logout
                                    </div>
                                </div>
                            </div>
                        }
                    </li>
                </ul>
            </nav>
        </SessionProvider>
    );
}

export default Navbar;