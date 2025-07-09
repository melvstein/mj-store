"use client";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useRegisterUserHandler } from "@/services/AuthenticationService";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";

const RegisterUserForm = () => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const registerUser = useRegisterUserHandler();
    useToastMessage(errorMessage, "error");
    useToastMessage(successMessage, "success");

    const [formData, setFormData] = useState({
        role: "",
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const user = await registerUser(formData); // ✅ usage here
            setSuccessMessage(`User ${user.data?.firstName} created successfully!`);
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    const handleClear = () => {
        setFormData({
            role: "",
            email: "",
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            password: "",
            confirmPassword: "",
        });

        setErrorMessage("");
        setSuccessMessage("");
    };

    useEffect(() => {
        if (errorMessage) {
            setErrorMessage(""); // Clear error message after showing toast
        }

        if (successMessage) {
            setSuccessMessage(""); // Clear success message after showing toast
        }
    }, [errorMessage, successMessage]);

    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.users.main.path,
            name: paths.admin.users.main.name,
        },
        {
            path: paths.admin.users.register.path,
            name: paths.admin.users.register.name,
        },
    ];

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
        <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
        <form onSubmit={handleSubmit} onReset={handleClear} className="card-skin flex flex-col gap-4">
            <h2 className="card-skin-header">Register User</h2>
            <div className="card-skin-content flex flex-col gap-6">
                <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                    <div className="w-full">
                        <label className="label-skin">Role</label>
                        <select
                            className="input-skin"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </ select>
                    </div>
                    <div className="w-full">
                        <label className="label-skin">Email</label>
                        <input
                            className="input-skin"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                    <div className="w-full">
                        <label className="label-skin">Fist Name</label>
                        <input
                            className="input-skin"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="label-skin">Middle Name</label>
                        <input
                            className="input-skin"
                            placeholder="Middle Name"
                            value={formData.middleName}
                            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="label-skin">Last Name</label>
                        <input
                            className="input-skin"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                    <div className="w-full">
                        <label className="label-skin">Username</label>
                        <input
                            className="input-skin"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="label-skin">Password</label>
                        <input
                            type="password"
                            className="input-skin"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="label-skin">Confirm Password</label>
                        <input
                            type="password"
                            className="input-skin"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button type="reset" className="button-skin">
                        Reset
                    </button>
                    <button type="submit" className="button-skin">
                        Save
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default RegisterUserForm;
