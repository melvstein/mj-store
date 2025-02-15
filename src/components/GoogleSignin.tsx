"use client";

import React from "react";
import { signIn } from "next-auth/react";

const GoogleSignin: React.FC = () => {
    const handleClick = async () => {
        await signIn("google");
    };

    return (
        <button onClick={handleClick} className="bg-red-500 px-4 py-2 rounded-xl text-skin-base">
            Sign in with Google
        </button>
    );
};

export default GoogleSignin;
