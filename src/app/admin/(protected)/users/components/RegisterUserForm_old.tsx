/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import paths from "@/utils/paths";
import BreadCrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuthRegisterMutation } from "@/lib/redux/services/authenticationApi";
import Loading from "@/components/Loading/Loading";

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

const RegisterUserForm = () => {
    const [doRegister, { isLoading: registerLoading }] = useAuthRegisterMutation();
    const [isLoading, setIsLoading] = useState(true);

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
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const user = await doRegister(formData).unwrap();

            if (user.data) {
                toast.success(`User ${user.data?.username} created successfully!`);
            } else {
                toast.error("User registration failed");
            }
        } catch (err: any) {
            toast.error(err?.data?.message);
            setIsLoading(false);
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
    };

    useEffect(() => {
        if (registerLoading) {
            setIsLoading(registerLoading);
            return;
        }
    }, [registerLoading]);

    if (isLoading) {
        return <Loading onComplete={() => setIsLoading(false)} />;
    }

  return (
    <div className="grid gap-4">
        <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
        <Card>
            <CardHeader className="border-b bg-secondary rounded-tl-lg rounded-tr-lg">
                <CardTitle>
                    Register User
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} onReset={handleClear} className="flex flex-col gap-4">
                    <div className="card-skin-content flex flex-col gap-6">
                        <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                            <div className="w-full">
                                <Label>Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full">
                                <Label>Email</Label>
                                <Input
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                            <div className="w-full">
                                <Label>Fist Name</Label>
                                <Input
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Label>Middle Name</Label>
                                <Input
                                    placeholder="Middle Name"
                                    value={formData.middleName}
                                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                            <div className="w-full">
                                <Label>Username</Label>
                                <Input
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button type="reset">
                                Reset
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};

export default RegisterUserForm;
