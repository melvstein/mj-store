"use client"

import { useAuthLoginMutation } from "@/lib/redux/services/ecommerceApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, setAccessToken, setRefreshToken } from "@/services/AuthenticationService";

const SignIn: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const [authLogin, { data, error, isLoading }] = useAuthLoginMutation();
    const router = useRouter();
    const authenticated = isAuthenticated();

    useEffect(() => {
        if (authenticated) {
            console.log("User is authenticated, redirecting to admin dashboard");
            router.push("/admin");
        } else {
            console.log("User is not authenticated, showing login form");
        }
    }, [authenticated, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await authLogin({ username, password }).unwrap();

            console.log("Login Success");

            if (response?.data?.accessToken && response?.data?.refreshToken) {
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                router.push("/admin");
            } else {
                console.error("Invalid login response format:", response);
            }
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
				<input type="text" placeholder="Username" className="input-skin" onChange={(e) => setUsername(e.target.value) } />
				<input type="password" placeholder="Password" className="input-skin" onChange={ (e) => setPassword(e.target.value) } />
				<button className="border shadow rounded-lg px-4 py-2 focus:outline-2 outline-skin-primary bg-skin-primary text-skin-base w-full font-semibold">
					Login
				</button>
			</form>
		</section>
	)
}

export default SignIn;