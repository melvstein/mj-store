"use client"

import { useAuthLoginMutation } from "@/lib/redux/services/authenticationApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/services/AuthenticationService";
import { useTheme } from "next-themes";
import { useToastMessage } from "@/hooks/useToastMessage";
import { Button } from "@/components/ui/button";

const SignIn: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const [authLogin] = useAuthLoginMutation();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
	const { theme } = useTheme()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await authLogin({ username, password }).unwrap();
            const accessToken = response.data?.accessToken;
            const refreshToken = response.data?.refreshToken;

            if (accessToken) {
                console.log("Login Success");
                setAccessToken(accessToken);

                if (refreshToken) {
                    setRefreshToken(refreshToken);
                }
                setSuccessMessage("Login successful!");
                router.push("/admin");
            } else {
                console.log("Invalid login response format:", response);
            }
        } catch (error: any) {
            // console.log("Login Failed:", error);
            setErrorMessage(error.data.message);
        }
    };

    useToastMessage(errorMessage, "error");
    useToastMessage(successMessage, "success");

    useEffect(() => {
        if (errorMessage) {
            setErrorMessage(""); // Clear error message after showing toast
        }

        if (successMessage) {
            setSuccessMessage(""); // Clear success message after showing toast
        }

    }, [errorMessage, successMessage]);
 
	return (
		<section className="flex flex-col items-center justify-center text-skin-muted">
            {/* {errorMessage && <ErrorMessage message={errorMessage} />} */}
			<form
                onSubmit={(e) => handleSubmit(e) }
                className="flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg w-[500px] gap-y-4 mt-[80px]"
            >
				<div>
					<h1>Admin Login</h1>
				</div>
				<input type="text" placeholder="Username" className="input-skin" onChange={(e) => setUsername(e.target.value) } />
				<input type="password" placeholder="Password" className="input-skin" onChange={ (e) => setPassword(e.target.value) } />

                <button className="button-skin">Login</button>
                <Button variant="default">Login</Button>
			</form>
		</section>
	)
}

export default SignIn;