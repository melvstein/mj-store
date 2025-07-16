"use client";
import { useRegisterUserHandler } from "@/services/AuthenticationService";
import { use, useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

type RegisterUserFormProps = {
    role: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const formSchema = z.object({
    role: z.string().min(1, "Role is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});

const RegisterUserForm = () => {
    const [doRegister, { isLoading: registerLoading }] = useAuthRegisterMutation();
    const [isLoading, setIsLoading] = useState(true);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "",
            email: "",
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form Data:", data);
    }

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

    /* const handleSubmit = async (e: React.FormEvent) => {
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
    }; */

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="card-skin-content flex flex-col gap-6">
                            <div className="flex items-center justify-between md:flex-row flex-col w-full gap-4">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        { ...field }
                                                        value={formData.role}
                                                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="staff">Staff</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="Email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    
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
                                    />
                                </div>
                                <div className="w-full">
                                    <Label>Middle Name</Label>
                                    <Input
                                        placeholder="Middle Name"
                                        value={formData.middleName}
                                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                    />
                                </div>
                                <div className="w-full">
                                    <Label>Last Name</Label>
                                    <Input
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                                    />
                                </div>
                                <div className="w-full">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="w-full">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="reset"
                                    onClick={() => form.reset()}
                                >
                                    Reset
                                </Button>
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
};

export default RegisterUserForm;
