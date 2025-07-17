"use client";

import BreadCrumb from "@/components/Breadcrumb";
import Loading from "@/components/Loading/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthenticatedUser } from "@/services/AuthenticationService";
import { TUser } from "@/types";
import paths from "@/utils/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const UserProfileImageCard = ({ user }: { user: TUser }) => {
    const form = useForm();

    const onSubmit = (data: any) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>
                    Display Picture
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 m-0">
                <div className="grid grid-cols-2 w-full">
                    <div className="flex items-center justify-center w-full h-full bg-secondary p-4">
                        <Avatar className="flex bg-secondary size-full p-1">
                            <AvatarImage className="rounded-full border border-primary" src="https://github.com/evilrabbit.png" alt="User Display Picture" />
                            <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-start justify-center w-full p-4">
                        <Form {...form}>
                            <form 
                                className="flex flex-col items-center justify-between gap-4 h-full"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className="w-full">
                                    <FormField
                                    control={form.control}
                                    name="displayPicture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Change Display Picture</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            field.onChange(file);
                                                        }
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                </div>
                                <div className="flex items-center justify-end w-full">
                                    <Button
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const UserDetailsCard = ({ user }: { user: TUser }) => {
    const formSchema = z.object({
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        firstName: z.string().min(1, "First name is required"),
        middleName: z.string().optional(),
        lastName: z.string().min(1, "Last name is required"),
        username: z.string().min(1, "Username is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName,
            middleName: user?.middleName,
            lastName: user?.lastName,
            email: user?.email,
            username: user?.username,
        },
    });

    const onSubmit = (data: any) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };
    
    const onError = (errors: any) => {
        // console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="account">
                <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                <Card>
                    <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                        Make changes to your account here. Click save when you&apos;re
                        done.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-name">Name</Label>
                        <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-username">Username</Label>
                        <Input id="tabs-demo-username" defaultValue="@peduarte" />
                    </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
                </TabsContent>
                <TabsContent value="password">
                <Card>
                    <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password here. After saving, you&apos;ll be logged
                        out.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-current">Current password</Label>
                        <Input id="tabs-demo-current" type="password" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-new">New password</Label>
                        <Input id="tabs-demo-new" type="password" />
                    </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const UserDetailsCard1 = ({ user }: { user: TUser }) => {
    const formSchema = z.object({
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        firstName: z.string().min(1, "First name is required"),
        middleName: z.string().optional(),
        lastName: z.string().min(1, "Last name is required"),
        username: z.string().min(1, "Username is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName,
            middleName: user?.middleName,
            lastName: user?.lastName,
            email: user?.email,
            username: user?.username,
        },
    });

    const onSubmit = (data: any) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };
    
    const onError = (errors: any) => {
        // console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle>
                    User Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <Form {...form}>
                    <form 
                        className="flex flex-col gap-4"
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                    >
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="First Name" 
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="middleName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Middle Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    id="middleName"
                                                    type="text"
                                                    placeholder="Middle Name" 
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    id="lastName"
                                                    type="text"
                                                    placeholder="Last Name" 
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                       </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email" 
                                                placeholder="Email Address" 
                                                {...field} 
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    id="username"
                                                    type="text"
                                                    placeholder="Username" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

const UserProfilePage = () => {
    const { user, extra: {
        isLoading: isUserLoading,
    }} = useAuthenticatedUser();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isUserLoading) {
            console.log('User is loading...');
            setIsLoading(isUserLoading);
            return;
        }
    }, [isUserLoading]);

    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.user.profile.main.path,
            name: paths.admin.user.profile.main.name,
        }
    ];

    if (!user || isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <div className="flex items-center md:items-start justify-center w-full">
                    <UserProfileImageCard user={user} />
                </div>
                <div className="col-span-2 flex items-center md:items-start justify-center w-full">
                    <UserDetailsCard user={user} />
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;