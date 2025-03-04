"use client"

import GoogleSignin from "@/components/GoogleSignin";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

const SignIn: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	useEffect(() => {
        if (session?.user) {
            router.push("/"); // ✅ Redirect only when session exists
        }
    }, [session, router]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = signIn("credentials", {
			redirect: false,
			email,
			password
		});

		console.log(result);

		//router.push("/");
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
					<input type="text" placeholder="Email or Username" className="input-skin" value={email} onChange={(e) => setEmail(e.target.value)} />
					<input type="password" placeholder="Password" className="input-skin" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button className="border shadow rounded-lg px-4 py-2 focus:outline-2 outline-skin-primary bg-skin-primary text-skin-base w-full font-semibold">
						Login
					</button>
				</form>
			</div>
		</section>
	)
}

export default SignIn;