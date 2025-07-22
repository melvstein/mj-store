"use client"

import { useAuthLoginMutation } from "@/lib/redux/services/authenticationApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/services/AuthenticationService";
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
                
                toast.success("Login Successful");
                router.push("/admin");
            } else {
                console.log("Invalid login response format:", response);
                toast.error("Login Failed: Invalid response format");
            }
        } catch (error: any) {
            // console.log("Login Failed:", error);
            toast.error("Login Failed: " + error?.data?.message || "An error occurred");
        }
    };

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