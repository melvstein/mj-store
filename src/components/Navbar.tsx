"use client"

import Link from "next/link";
import type { TNavLink } from "@/types"
import Logo from "./Logo";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { RiMenuFold4Line as CloseMenu, RiMenuFold3Line as OpenMenu } from "react-icons/ri";

import dynamic from 'next/dynamic'
const ThemeChanger = dynamic(() => import('./ThemeChanger'), { ssr: false });

const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const [openUserMenu, setOpenUserMenu] = useState<boolean>(false);
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setOpenUserMenu(false);
                setToggleMenu(false);
            }
        }

        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setOpenUserMenu(false);
                setToggleMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleResize);

          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
          };
    }, []);

    if (status === "loading") {
        return null; // Or a loading spinner
    }

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
            name: "Sign in",
            href: "/signin",
        },
    ];

    const filteredLinks = session?.user 
    ? links.filter(link => link.name !== "Sign in")
    : links;

    const li = filteredLinks.map((link) => (
        <li key={link.id} className="flex items-stretch justify-center">
            <Link 
                href={link.href} 
                className={`px-6 flex items-center justify-center`}
            >
                {link.name}
            </Link>
        </li>
    ));

    return (
        <SessionProvider>
            <nav className="fixed top-0 left-0 right-0 bg-skin-primary text-skin-base">
                <div className="relative flex items-stretch justify-between">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        <Link href="/" className="px-4 py-2 flex items-center justify-center space-x-2">
                            <Logo />
                            <p className="">MJ STORE</p>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="sm:flex hidden items-stretch justify-between">
                        { li }
                        <li className="flex items-stretch justify-center">
                            {session?.user &&
                                <div ref={dropDownRef} className="flex items-stretch justify-center" onClick={() => setOpenUserMenu(!openUserMenu)}>
                                    <div className="px-6 flex items-center justify-center cursor-pointer gap-2">
                                        <Image src={ session.user.image as string } width={50} height={50} alt="Profile" className="rounded-full size-[35px] ring ring-skin-base" />
                                    </div>

                                    <div 
                                        className={
                                            `${openUserMenu ? 'flex' : 'hidden'} absolute top-[70px] right-[20px] bg-skin-base text-skin-foreground text-sm flex-col items-start
                                            justify-center rounded-lg border border-gray-300 shadow-xl w-[250px] transition-all`
                                        }
                                    >
                                        <div className="flex flex-col items-start justify-center p-4 w-full">
                                            <p className="font-semibold">{ session.user.name }</p>
                                            <p className="text-skin-muted">{ session.user.email }</p>
                                        </div>
                                        <a href="/customer/account" className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2">
                                            <FaRegUser /> Manage Account
                                        </a>
                                        <div className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2" onClick={ async () => await signOut({ callbackUrl: "/" }) }>
                                            <FiLogOut /> Log out
                                        </div>
                                    </div>
                                </div>
                            }
                        </li>
                        <li className="flex items-center justify-center p-4 border-l">
                            <ThemeChanger />
                        </li>
                    </ul>

                    <div ref={dropDownRef} className="sm:hidden flex items-center justify-center">
                        {/* Mobile Menu Button */}
                        <button className="flex items-center justify-center p-4" onClick={() => setToggleMenu(!toggleMenu)}>
                                { !toggleMenu ? <CloseMenu className="size-[30px] cursor-pointer" /> : <OpenMenu className="size-[30px] cursor-pointer" /> }
                        </button>

                        {/* Mobile Menu */}
                        {toggleMenu && (
                                <div
                                    className={
                                        `${toggleMenu ? 'flex' : 'hidden'} absolute top-[70px] left-0 bg-skin-primary text-skin-base text-sm flex-col items-start
                                        justify-center w-full transition-all`
                                    }
                                >
                                    <a href="/customer/account" className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2">
                                        <FaRegUser /> Manage Account
                                    </a>
                                    <div className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2" onClick={ async () => await signOut({ callbackUrl: "/" }) }>
                                        <FiLogOut /> Log out
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </nav>
        </SessionProvider>
    );
}

export default Navbar;