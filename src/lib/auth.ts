import NextAuth from "next-auth";
import type { Account, User as NextAuthUser, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import ApiResponse from "./apiResponse";

const getCustomerByEmail = async (email: string) => {
	try {
		console.log("Fetching customer by email:", email);
		console.log("Using AUTH_BASE_URL:", process.env.AUTH_BASE_URL);
		const response = await axios.post(`${process.env.AUTH_BASE_URL}/api/customers/email`, {
			email
		});

		if (response.data.code === ApiResponse.success.code) {
			return response.data.data;
		}

		return null;
	} catch (error) {
		console.error("Error fetching customer by email:", error);
		return null;
	}
};

export const config = {
	debug: true,
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "user@example.com" },
				password: { label: "Password", type: "password", placeholder: "Password" }
			},
			async authorize(credentials, request) {
				/* console.log('CredentialsProvider authorize method arg credentials', credentials);
				console.log('CredentialsProvider authorize method arg request', request); */

				const headerOrigin = request.headers.get('origin');

				const response = await axios.post(`${headerOrigin}/api/users`, {
					apiKey: process.env.API_KEY,
					email: credentials.email
				});

				if (response.data.code === ApiResponse.success.code) {
					const user = response.data.data;

					if (user) {
						return user;
					}
				}

				return null;
			}
		}),
	],/* 
	pages: {
		signIn: "/customer/login",
		signOut: "/",
	}, */
	callbacks: {
		async signIn({ account, user }: { account: Account | null, user: NextAuthUser }) {
			
			if (account) {
				console.log('Provider', account.provider);
			}

			try {
				const customer = user.email ? await getCustomerByEmail(user.email) : null;

				console.log('Customer', customer);
				/* await connectDB();

				const existingUser = await User.findOne({ email: user.email });

				if (!existingUser) {
					await User.create({
						role: "customer",
						name: user.name,
						email: user.email,
						image: user.image,
						provider: "google",
					});
				} */

				

				return true;
			} catch (error) {
				console.error("Signin callback Error saving user:", error);
				return false;
			}
		},
		async session({ session }: { session: Session }) {
			// console.log('Session callback', session);
			return session;
		},
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);