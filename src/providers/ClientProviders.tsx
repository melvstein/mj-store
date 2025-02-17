"use client";

import ReduxProvider from "./ReduxProvider";
import Theme from "./Theme";

const ClientProviders = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<ReduxProvider>
			<Theme>
				{children}
			</Theme>
		</ReduxProvider>
  );
}

export default ClientProviders;