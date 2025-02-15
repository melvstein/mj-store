import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./mongoose";
import User from "@/models/User";
import type { User as NextAuthUser, Session } from "next-auth";
 
export const config = {
	providers: [Google],
	pages: {
		signIn: "/signin",
		signOut: "/",
	},
	callbacks: {
		async signIn({ user }: { user: NextAuthUser }) {

		try {
			await connectDB();

			const existingUser = await User.findOne({ email: user.email });

			if (!existingUser) {
				await User.create({
					role: "customer",
					name: user.name,
					email: user.email,
					image: user.image,
					provider: "google",
				});
			}

			return true;
		} catch (error) {
			console.error("Error saving user:", error);
			return false;
		}
		},
		async session({ session }: { session: Session }) {
		return session;
		},
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);