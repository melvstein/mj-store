"use client";

import { useRouter } from "next/navigation";
import UsersList from "./components/UsersList";

const UsersPage = () => {
    const router = useRouter();

    return (
        <div className="container mx-auto space-y-4">
            <div className="flex items-center justify-end">
                <button onClick={ () => router.replace("/admin/users/create") } className="bg-skin-primary px-4 py-2 rounded text-skin-base hover:bg-skin-secondary">
                    Create User
                </button>
            </div>
            <UsersList />
        </div>
    );
}

export default UsersPage;