"use client"

import { useAdminLoginMutation } from "@/lib/redux/services/ecommerceApi";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/utils/cookieUtils";

const SignIn: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const [adminLogin, { data, error, isLoading }] = useAdminLoginMutation();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await adminLogin({ username, password }).unwrap();

			console.log("Login Success:", response);
            setTokens(response.data.accessToken, response.data.refreshToken);
            
            router.push("/admin");
		} catch (err) {
			console.error("Login Failed:", err);
		}
	};

	return (
		<section className="flex items-center justify-center text-skin-muted">
			<form
                onSubmit={(e) => handleSubmit(e) }
                className="flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg w-[500px] gap-y-4 mt-[80px]"
            >
				<div>
					<h1>Admin Login</h1>
				</div>
				<input type="text" placeholder="Email or Username" className="input-skin" onChange={(e) => setUsername(e.target.value) } />
				<input type="password" placeholder="Password" className="input-skin" onChange={ (e) => setPassword(e.target.value) } />
				<button className="border shadow rounded-lg px-4 py-2 focus:outline-2 outline-skin-primary bg-skin-primary text-skin-base w-full font-semibold">
					Login
				</button>
			</form>
		</section>
	)
}

export default SignIn;