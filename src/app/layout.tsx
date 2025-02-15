import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SessionProvider } from "next-auth/react";

/* import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton
  } from '@clerk/nextjs' */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MJ STORE",
  description: "MJ STORE ECOMMERCE",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<html lang="en">
		<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
			<SessionProvider>
				<header>
					<Navbar />
				</header>
				<main className="container mx-auto py-[80px] h-screen">
					{children}
				</main>
			</SessionProvider>
		</body>
	</html>
  );
}
