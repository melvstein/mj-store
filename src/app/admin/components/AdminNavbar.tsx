"use client";
import { useLogout } from "@/services/AuthenticationService";

const AdminNavbar = () => {
    const { logout, isLogout } = useLogout();

    return (
        <nav className="fixed top-0 inset-x-0">
            <div>admin nav</div>
            <div>
                <a onClick={logout} className="cursor-pointer">Logout</a>
            </div>
        </nav>
    );
};

export default AdminNavbar;
