"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignin: React.FC = () => {
    const handleClick = async () => {
        await signIn("google", {
			callbackUrl: "/"
        });
    };

    return (
        <button onClick={handleClick} className="flex items-center justify-center bg-background px-10 py-2 rounded-lg text-skin-muted border shadow gap-2 w-full">
            <FcGoogle className="size-[25px]" />
            Sign in with Google
        </button>
    );
};

export default GoogleSignin;
