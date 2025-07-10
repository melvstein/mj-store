"use client"

import Link from "next/link";
import type { TNavLink } from "@/types"
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaRegUser, FaProductHunt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { RiMenuFold4Line as CloseMenu, RiMenuFold3Line as OpenMenu } from "react-icons/ri";
import paths from "@/utils/paths";
import Var from "@/utils/Var";

const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const [openUserMenu, setOpenUserMenu] = useState<boolean>(false);
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);
    const userDropDownRef = useRef<HTMLDivElement>(null);
    const menuDropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userDropDownRef.current && !userDropDownRef.current.contains(e.target as Node)) {
                setOpenUserMenu(false);
            }

            if (menuDropDownRef.current && !menuDropDownRef.current.contains(e.target as Node)) {
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

    if (status == Var.status.loading) {
        return null; // Or a loading spinner
    }

    const links: TNavLink[] = [
        {
            id: 1,
            name: Var.products,
            href: paths.home,
        },
        {
            id: 2,
            name: Var.cart,
            href: paths.customer.cart,
        },
        {
            id: 3,
            name: "Sign in",
            href: paths.customer.login,
        },
    ];

    const filteredLinks = session?.user 
    ? links.filter(link => link.name !== "Sign in")
    : links;

    const li = filteredLinks.map((link) => (
        <li key={link.id} className="flex items-stretch justify-center">
            <Link 
                href={link.href} 
                className={`relative px-6 flex items-center justify-center gap-2`}
            >
                {link.name}
                {link.name == Var.cart && (
                    <p className="absolute top-1 right-2 bg-secondary/0 px-1.5 rounded-full border border-skin-base shadow shadow-skin-base text-sm backdrop-blur-sm">
                        3
                    </p>
                )}
            </Link>
        </li>
    ));

    const isBlurred = openUserMenu || toggleMenu;

    return (
        <div>
            {/* Content Wrapper with Blur Effect */}
            <div className={`${isBlurred ? "fixed inset-0 transition-all backdrop-blur-md bg-black/30 z-10" : ""}`}></div>
            <nav className="fixed top-0 left-0 right-0 bg-primary text-skin-base z-20 select-none">
                <div className="relative flex items-stretch justify-between">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        <Link href={ paths.home } className="pl-4 py-2 flex items-center justify-center space-x-2">
                            <Logo />
                            <p className="sm:text-base text-[10px]">{ Var.appName }</p>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="sm:flex hidden items-stretch justify-between">
                        { li }
                        <li className="flex items-stretch justify-center">
                            {session?.user && (
                                <div ref={userDropDownRef} className="flex items-stretch justify-center" onClick={() => setOpenUserMenu(!openUserMenu)}>
                                    <div className="px-6 flex items-center justify-center cursor-pointer gap-2">
                                        <Image src={ session.user.image as string } width={50} height={50} alt="Profile" className="rounded-full size-[30px] ring ring-skin-base" />
                                    </div>

                                    <div 
                                        className={
                                            `${openUserMenu ? 'flex' : 'hidden'} absolute top-[70px] right-[20px] bg-background text-skin-foreground text-sm flex-col items-start
                                            justify-center rounded-lg border border-gray-300 shadow-xl w-[250px] transition-all`
                                        }
                                    >
                                        <div className="flex flex-col items-start justify-center p-4 w-full">
                                            <p className="font-semibold">{ session.user.name }</p>
                                            <p className="text-skin-muted">{ session.user.email }</p>
                                        </div>
                                        <Link href={ paths.customer.account } className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2">
                                            <FaRegUser /> <p>{ Var.manageAccount }</p>
                                        </Link>
                                        <div className="flex items-center justify-start px-4 py-2 cursor-pointer w-full gap-2" onClick={ async () => await signOut({ callbackUrl: paths.customer.login }) }>
                                            <FiLogOut /> <p>{ Var.logOut }</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>

                    <div ref={menuDropDownRef} className="sm:hidden flex items-center justify-center gap-2">
                        <Link 
                            href={ paths.customer.cart }
                            className="relative p-2 flex items-center justify-center"
                        >
                            <p>{ Var.cart }</p>
                            <p className="absolute top-[-1px] right-[-6px] bg-secondary/0 px-1.5 rounded-full border border-skin-base shadow shadow-skin-base text-sm backdrop-blur-sm">
                                3
                            </p>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button className="flex items-center justify-center p-2 mr-2" onClick={() => setToggleMenu(!toggleMenu)}>
                                { !toggleMenu ? <CloseMenu className="size-[30px] cursor-pointer" /> : <OpenMenu className="size-[30px] cursor-pointer" /> }
                        </button>

                        {/* Mobile Menu */}
                        {toggleMenu && (
                                <div
                                    className={
                                        `${toggleMenu ? 'flex' : 'hidden'} absolute top-[70px] left-0 bg-primary text-skin-base text-sm flex-col items-start
                                        justify-center w-full transition-all`
                                    }
                                >
                                    <div className="w-full p-4 space-y-4">
                                        <p className="text-skin-muted text-xs uppercase font-semibold">{ Var.main }</p>
                                        <Link href={ paths.customer.cart } className="flex items-center justify-start w-full gap-2">
                                            <FaProductHunt /> <p>{ Var.products }</p>
                                        </Link>
                                        <Link href={ paths.customer.cart } className="flex items-center justify-start w-full gap-2">
                                            <FiShoppingCart /> <p>{ Var.cart } <span>3</span></p>
                                        </Link>
                                        {!session?.user && (
                                            <Link href={ paths.customer.login } className="flex items-center justify-start w-full gap-2">
                                                <FiLogIn /> <p>{ Var.signIn }</p>
                                            </Link>
                                        )}
                                    </div>
                                    {session?.user && (
                                        <div className="w-full p-4 space-y-4">
                                            <p className="text-skin-muted text-xs uppercase font-semibold">User</p>
                                            <div className="flex items-center justify-center w-full gap-2">
                                                <div className="flex flex-shrink-0 items-center justify-start">
                                                    <Image src={ session.user.image as string } width={50} height={50} alt="Profile" className="rounded-full size-[30px] mr-2 ring ring-skin-base" />
                                                </div>
                                                <div className="flex flex-col items-start justify-center w-full">
                                                    <p className="font-semibold text-xs">{ session.user.name }</p>
                                                    <p className="text-skin-muted text-[10px]">{ session.user.email }</p>
                                                </div>
                                            </div>
                                            <Link href={ paths.customer.account } className="flex items-center justify-start w-full gap-2">
                                                <FaRegUser /> <p>{ Var.manageAccount }</p>
                                            </Link>
                                            <div className="flex items-center justify-start cursor-pointer w-full gap-2" onClick={ async () => await signOut({ callbackUrl: paths.customer.login }) }>
                                                <FiLogOut /> <p>{ Var.logOut }</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;