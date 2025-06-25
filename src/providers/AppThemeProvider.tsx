"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from 'next-themes'
import ThemeSwitch from "../components/ThemeSwitch";

const AppThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

	return (
		<ThemeProvider defaultTheme="light">
			{children}
			<ThemeSwitch />
		</ThemeProvider>
  	);
}

export default AppThemeProvider;