"use client"

import GoogleSignin from "@/components/GoogleSignin";
import Var from "@/utils/Var";
import { useSession } from "next-auth/react";
import React, { useEffect} from "react";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const SignIn: React.FC = () => {
	const { status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status == Var.status.authenticated) {
			router.push(paths.customer.home.main.path);
		}
	}, [status, router]);

	return (
		<section className="flex items-start justify-center w-full min-h-screen">
			<header>
				<Navbar />
			</header>
			{/* <div className="flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg w-[500px] gap-y-4 mt-[80px]">
				<div>
					<h1>Customer Login</h1>
				</div>
				<GoogleSignin />
				<p>or</p>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<input type="text" placeholder="Email or Username" className="input-skin" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<input type="password" placeholder="Password" className="input-skin" value={password} onChange={(e) => setPassword(e.target.value)} required />

					<div className="flex items-center justify-center">
						<button className="button-skin">
							Login
						</button>
					</div>
				</form>
			</div> */}
			<Card className="w-full max-w-md mt-60">
				<CardHeader>
					<CardTitle>Customer Login</CardTitle>
				</CardHeader>
				<CardContent>
					<GoogleSignin />
				</CardContent>
			</Card>
		</section>
	)
}

export default SignIn;