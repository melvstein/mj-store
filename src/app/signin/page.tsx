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
		<section>
			<GoogleSignin />
		</section>
	)
}

export default SignIn;