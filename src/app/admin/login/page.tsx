"use client"

import { useAuthLoginMutation } from "@/lib/redux/services/authenticationApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/services/AuthenticationService";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            setErrorMessage(""); // Clear error message after showing toast
        }

        if (successMessage) {
            toast.success(successMessage);
            setSuccessMessage(""); // Clear success message after showing toast
        }

    }, [errorMessage, successMessage]);
 
	return (
		<section className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm mt-24">
                {/* <div>
                    <h2 className="uppercase flex items-center justify-center">Admin Login</h2>
                </div> */}
                <CardHeader>
                    <CardTitle className="uppercase">Admin Login</CardTitle>
                </CardHeader>
				<CardContent>
                    <form
                        onSubmit={(e) => handleSubmit(e) }
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" onChange={(e) => setUsername(e.target.value) } required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">Password</Label>
                                <Input id="password" type="password" onChange={ (e) => setPassword(e.target.value) } required />
                            </div>

                            <Button>
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
		</section>
	)
}

export default SignIn;