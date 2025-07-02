"use client";
import ErrorMessage from "@/components/prompts/ErrorMessage";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useRegisterUserHandler } from "@/services/AuthenticationService";
import { useEffect, useState } from "react";

const CreateUserForm = () => {
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

  return (
    <div className="">
        <h1 className="mb-4 text-skin-muted">Register User</h1>
        <form onSubmit={handleSubmit} onReset={handleClear} className="space-y-4 p-4 border rounded">
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
        </form>
    </div>
  );
};

export default CreateUserForm;
