import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ClientProviders from "@/providers/ClientProviders";
import { ToastContainer } from "react-toastify";

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

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} relative bg-background text-foreground antialiased`}>
				<SessionProvider>
					<ClientProviders>
						<main className="container mx-auto min-h-screen min-w-full">
                            <ToastContainer />
							{children}
						</main>
						{/* <footer>
							<p>This is footer</p>
						</footer> */}
					</ClientProviders>
				</SessionProvider>
			</body>
		</html>
	);
}

export default RootLayout;