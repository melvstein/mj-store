"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";

const GoogleSignin: React.FC = () => {
    const handleClick = async () => {
        await signIn("google", {
			callbackUrl: "/"
        });
    };

    return (
        <Button onClick={handleClick} className="w-full flex items-center justify-center">
            <FcGoogle className="size-[25px]" />
            Sign in with Google
        </Button>
    );
};

export default GoogleSignin;
