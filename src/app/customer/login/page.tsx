"use client"

import GoogleSignin from "@/components/GoogleSignin";
import { signIn } from "next-auth/react";
import React, { FormEvent, useState } from "react";

const SignIn: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = signIn("credentials", {
			redirect: true,
			email,
			password,
			callbackUrl: "/"
		});

		console.log(result);
	}

	return (
		<section className="flex items-center justify-center text-skin-muted m-4">
			<div className="flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg w-[500px] gap-y-4 mt-[80px]">
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
			</div>
		</section>
	)
}

export default SignIn;