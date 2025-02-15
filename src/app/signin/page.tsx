"use client"

import GoogleSignin from "@/components/GoogleSignin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignIn: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
        if (session?.user) {
            router.push("/"); // ✅ Redirect only when session exists
        }
    }, [session, router]);

	return (
		<section className="flex items-center justify-center text-skin-muted">
			<div className="flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg w-[500px] gap-y-4 mt-[80px]">
				<GoogleSignin />
				<p>or</p>
				<input type="text" placeholder="Email or Username" className="border shadow rounded-lg px-4 py-2 text-start focus:outline-2 outline-skin-primary w-full" />
				<input type="password" placeholder="Password" className="border shadow rounded-lg px-4 py-2 text-start focus:outline-2 outline-skin-primary w-full" />
				<button className="border shadow rounded-lg px-4 py-2 focus:outline-2 outline-skin-primary bg-skin-primary text-skin-base w-full font-semibold">
					Signin
				</button>
			</div>
		</section>
	)
}

export default SignIn;