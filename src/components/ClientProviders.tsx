"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

  return (
    <ThemeProvider defaultTheme="light">
        <header>
            <Navbar />
        </header>
        <main className="container mx-auto py-[80px] h-screen">
            {children}
        </main>
    </ThemeProvider>
  );
}
