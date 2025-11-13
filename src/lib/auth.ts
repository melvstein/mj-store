import NextAuth from "next-auth";
import type { Account, User as NextAuthUser, Profile, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import ApiResponse from "./apiResponse";

/**
 * Fetch customer by email from backend API.
 */
const getCustomerByEmail = async (email: string) => {
	try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers/email/${email}`);

		if (response.data.code === ApiResponse.success.code) {
			return response.data.data;
		}
		return null;
	} catch (error) {
		console.error("Error fetching customer by email:", error);
		return null;
	}
};

type TSaveCustomer = {
	provider: string;
	firstName: string | null | undefined;
	lastName: string | null | undefined;
	username: string | null | undefined;
	email: string | null | undefined;
	profileImageUrl: string;
	isActive: boolean;
	isVerified: boolean;
};

/**
 * Save a new customer via backend API.
 */
const saveCustomer = async (customer: TSaveCustomer) => {
	try {
		console.log("Saving new customer:", customer);
		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers`, customer);

		if (response.data.code === ApiResponse.success.code) {
			return response.data.data;
		}
		return null;
	} catch (error) {
		console.error("Error saving new customer:", error);
		return null;
	}
};

/**
 * NextAuth configuration
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
	debug: true,
	providers: [
		/**
		 * Google OAuth Provider
		 */
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		}),

		/**
		 * Custom Credentials Provider
		 */
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "user@example.com" },
				password: { label: "Password", type: "password", placeholder: "Password" },
			},
			async authorize(credentials) {
				try {
					const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

					const response = await axios.post(`${apiUrl}/api/users`, {
						apiKey: process.env.API_KEY,
						email: credentials?.email,
					});

					if (response.data.code === ApiResponse.success.code) {
						const user = response.data.data;
						if (user) return user;
					}
					return null;
				} catch (err) {
					console.error("CredentialsProvider authorize error:", err);
					return null;
				}
			},
		}),
	],
  	secret: process.env.AUTH_SECRET,
	callbacks: {
		/**
		 * Sign In callback — called during login via Google or credentials.
		 */
		async signIn({ account, user, profile }: { account: Account | null; user: NextAuthUser; profile?: Profile }) {
			try {
				if (account) {
					console.log("Provider:", account.provider);
				}

				const email = profile?.email ?? user.email;
				const existingCustomer = email ? await getCustomerByEmail(email) : null;

				if (!existingCustomer) {
					const newCustomer = await saveCustomer({
						provider: account?.provider ?? "credentials",
						firstName: profile?.given_name ?? user.name,
						lastName: profile?.family_name ?? user.email,
						username: email,
						email,
						profileImageUrl: profile?.picture ?? user.image,
						isActive: true,
						isVerified: Boolean(profile?.email_verified),
					});

					console.log("New Customer:", newCustomer);

					if (!newCustomer) {
						console.log("❌ Failed to save new customer");
						return false;
					}
				}

				return true;
			} catch (error) {
				console.error("Signin callback error:", error);
				return false;
			}
		},

		/**
		 * Session callback — controls what data is available in `session`.
		 */
		async session({ session }: { session: Session }) {
			// Add custom properties to the session here if needed
			return session;
		},
	},

	// Optional: Customize sign-in and sign-out routes
	// pages: {
	// 	signIn: "/customer/login",
	// 	signOut: "/",
	// },
});
