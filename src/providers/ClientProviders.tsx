"use client";
import ReduxProvider from "./ReduxProvider";
import AppThemeProvider from "./AppThemeProvider";

const ClientProviders = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<ReduxProvider>
			<AppThemeProvider>
				{children}
			</AppThemeProvider>
		</ReduxProvider>
  );
}

export default ClientProviders;