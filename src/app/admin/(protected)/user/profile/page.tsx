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
import { useAuthenticatedUser, useAuthenticatedUserId } from "@/services/AuthenticationService";
import { TUser } from "@/types";
import paths from "@/utils/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useGetUserQuery, useUpdateUserMutation } from "@/lib/redux/services/usersApi";
import Response from "@/constants/Response";
import { useRouter } from "next/navigation";

const UserProfileImageCard = ({ user }: { user: TUser }) => {
    const form = useForm();

    const onSubmit = (data: any) => {
        console.log("Form submitted with data:", data);
        // Handle form submission logic here
    };

    return (
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle>
                    Display Picture
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full">
                    <div className="flex items-center justify-center w-full h-full p-4">
                        <Avatar className="flex bg-secondary size-32 sm:size-48 rounded-lg border border-primary">
                            <AvatarImage className="" src="https://github.com/evilrabbit.png" alt="User Display Picture" />
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

const EditUserSheet = ({ user, onUserUpdate }: { user: TUser; onUserUpdate?: () => void }) => {
    const [updateUser] = useUpdateUserMutation();

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

    const onSubmit = async (data: any) => {
        console.log("Form submitted with data:", data);
         try {
            const response = await updateUser({ id: user.id, user: data }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(response.message || "User updated successfully!");
                /* window.location.reload();
                router.refresh(); */
                onUserUpdate?.();
            } else {
                toast.error(response?.message || "User failed to update!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    
    const onError = (errors: any) => {
        // console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Edit</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form 
                         className="grid gap-6"
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                    >
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
                        <div>
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
                        </div>
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
                        <SheetFooter className="flex gap-2">
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

const UserDetailsCard = ({ user, onUserUpdate }: { user: TUser; onUserUpdate?: () => void }) => {
    const [tab, setTab] = useState("account");

    useEffect(() => {
        if (user) {
            console.log("User details loaded:", user);
        }

        console.log("Current tab:", tab);
    }, [user, tab]);

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="account">
                <Card>
                    <CardHeader className="flex">
                        <TabsList className="flex w-[170px]">
                            <TabsTrigger onClick={() => setTab("account")} value="account">Account</TabsTrigger>
                            <TabsTrigger onClick={() => setTab("password")} value="password">Password</TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <TabsContent value="account">
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                        id="firstName"
                                        type="text"
                                        value={user?.firstName}
                                        placeholder="First Name" 
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input 
                                        id="middleName"
                                        type="text"
                                        value={user?.middleName}
                                        placeholder="Middle Name" 
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                        id="lastName"
                                        type="text"
                                        value={user?.lastName}
                                        placeholder="Last Name" 
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email" 
                                        value={user?.email}
                                        placeholder="Email Address" 
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input 
                                        id="username"
                                        type="text"
                                        value={user?.username}
                                        placeholder="Username" 
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <EditUserSheet user={user} onUserUpdate={onUserUpdate} />
                            </div>
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="password">
                        <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-current">Current password</Label>
                            <Input id="tabs-demo-current" type="password" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="tabs-demo-new">New password</Label>
                            <Input id="tabs-demo-new" type="password" />
                        </div>
                                <div className="flex items-center justify-end">
                                    <Button type="submit">Save Password</Button>
                                </div>
                        </CardContent>
                    </TabsContent>
                </Card>
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
    const userId = useAuthenticatedUserId();
    const [user, setUser] = useState<TUser | null>(null);
    const {data: response, error, isLoading: isUserLoading, refetch} = useGetUserQuery(userId!, {
        skip: !userId,
    });
    
    useEffect(() => {
        if (response?.data) {
            console.log("User data fetched:", response.data);
            setUser(response.data);
        }
    }, [response]);

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

    const handleUserUpdate = async () => {
        console.log("handleUserUpdate called");
        console.log("Current user state:", user);
        console.log("Refetch function:", typeof refetch);
        
        try {
            const result = await refetch().unwrap();
            console.log("Refetch successful:", result);
        
            if (result.data) {
                console.log("New user data:", result.data);
                setUser(result.data);
                setIsLoading(true);
            }
        } catch (error) {
            console.error("Refetch failed:", error);
        }
    };

    if (!user || isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <div className="flex flex-col items-center justify-start w-full h-full gap-4">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <div className="flex items-start justify-center flex-col lg:flex-row gap-4 w-full">
                <div className="flex items-center md:items-start justify-center w-full">
                    <UserProfileImageCard user={user} />
                </div>
                <div className="flex items-center md:items-start justify-center w-full">
                    <UserDetailsCard user={user} onUserUpdate={handleUserUpdate} />
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;