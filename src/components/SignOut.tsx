"use client";

import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button onClick={handleSignOut} className="bg-primary text-white px-4 py-2 rounded">
      Sign Out
    </button>
  );
};

export default SignOut;
