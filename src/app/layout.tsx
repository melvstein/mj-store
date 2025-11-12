import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ClientProviders from "@/providers/ClientProviders";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

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
			<body className={`${geistSans.variable} ${geistMono.variable} relative bg-background min-h-screen w-auto text-foreground antialiased`} suppressHydrationWarning>
				<SessionProvider>
					<ClientProviders>
                        <SidebarProvider defaultOpen={true}>
                            <main className="container mx-auto min-h-screen min-w-full">
                                <ToastContainer />
                                <Toaster position="top-right" richColors closeButton />
                                {children}
                            </main>
                            {/* <footer>
                                <p>This is footer</p>
                            </footer> */}
                        </SidebarProvider>
					</ClientProviders>
				</SessionProvider>
			</body>
		</html>
	);
}

export default RootLayout;