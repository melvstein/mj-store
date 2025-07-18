"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, FilePenLine, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "@/lib/redux/services/usersApi"
import { TUpdateUser, TUser } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { MouseEvent, useEffect, useMemo, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Response from "@/constants/Response"
import Loading from "@/components/Loading/Loading"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form"

const updateUserDefault: TUpdateUser = {
  role: "",
  email: "",
  firstName: "",
  middleName: "",
  lastName: "",
  username: "",
}

const formUpdateUserSchema = z.object({
    role: z.string().min(1, "Role is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
})

export function UserDataTable() {
    const { data: response, error, isLoading: userLoading } = useGetUsersQuery();
    const [doUpdate] = useUpdateUserMutation();
    const [doDelete] = useDeleteUserMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<TUser[]>([]);
    const [updateUserId, setUpdateUserId] = useState("");
    const [lastDeletedUser, setLastDeletedUser] = useState<TUser | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const [userUpdateFormData, setUserUpdateFormData] = useState(updateUserDefault);

    const form = useForm<z.infer<typeof formUpdateUserSchema>>({
        resolver: zodResolver(formUpdateUserSchema),
        defaultValues: userUpdateFormData,
    });

    const onUpdateUser = async (data: z.infer<typeof formUpdateUserSchema>) => {
        try {
            const response = await doUpdate({ id: updateUserId, user: data }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(response.message || "User updated successfully!");

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updateUserId ? { 
                            ...user, 
                            ...data, 
                            updatedAt: new Date().toLocaleString('sv-SE') }
                        : user
                    )
                );
            } else {
                toast.error(response?.message || "User failed to update!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }

        setUserUpdateFormData(updateUserDefault);
    };

    const onError = (errors: any) => {
         console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    useEffect(() => {
        if (userLoading) {
            setIsLoading(userLoading);
            return;
        }

        setUsers(response?.data?.content ?? []);
    }, [userLoading, response]);

    const handleDelete = async (e: MouseEvent<HTMLButtonElement>, user : TUser): Promise<void> => {
        e.preventDefault();

        try {
            const response = await doDelete(user.id).unwrap();
  
            if (response?.code == Response.SUCCESS) {
                toast.success(response.data.message || "Deleted successfully!");
                setUsers((prev) => prev.filter((prevUser) => prevUser.id !== user.id));
                setLastDeletedUser(null);
            } else {
                toast.error(response?.message || "User failed to delete!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    /* const handleUpdate = async (userId: string) => {
        try {
            const response = await doUpdate({ id: userId, user: userUpdateFormData });

            if (response?.data?.code === Response.SUCCESS) {
                toast.success(response.data.message || "User updated successfully!");

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { 
                            ...user, 
                            ...userUpdateFormData, 
                            updatedAt: new Date().toLocaleString('sv-SE') }
                        : user
                    )
                );
            } else {
                toast.error(response?.data?.message || "User failed to update!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }

        setUserUpdateFormData(updateUserDefault);
    }; */

    const columns = useMemo<ColumnDef<TUser, any>[]>(() => [
    {
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                    onClick={() => {
                                        setUpdateUserId(user.id);

                                        const userData = {
                                            role: user.role,
                                            email: user.email,
                                            firstName: user.firstName,
                                            middleName: user.middleName,
                                            lastName: user.lastName,
                                            username: user.username,
                                        };

                                        setUserUpdateFormData(userData);
                                        // Reset the form with the user data
                                        form.reset(userData);
                                    }}
                                >
                                    <FilePenLine className="size-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer disabled:cursor-not-allowed"
                                    onClick={() => {
                                        setLastDeletedUser(user);
                                    }}
                                    disabled={user.username === "melvstein"} // Prevent deletion of the default user
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
        header: "Name",
        cell: ({ row }) => {
            const firstName = row.original.firstName;
            const middleName = row.original.middleName;
            const lastName = row.original.lastName;
            return (
            <span className="whitespace-nowrap">
                {firstName} {middleName} {lastName}
            </span>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            return (
                <span className="whitespace-nowrap">
                    { createdAt }
                </span>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated At
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const updatedAt = row.original.updatedAt;
            return (
                <span className="whitespace-nowrap">
                    { updatedAt }
                </span>
            );
        },
    },
    ], []);

    const table = useReactTable<TUser>({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        //enableSortingRemoval: false
    });

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <div className="w-full">
            { userUpdateFormData && updateUserId &&
                (<Dialog open={!!userUpdateFormData.role} onOpenChange={(open) => {
                    if (!open) {
                        setUserUpdateFormData(updateUserDefault);
                    }
                }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Details</DialogTitle>
                        <DialogDescription>
                            Click save after updating the user details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onUpdateUser, onError)}
                            className="grid gap-4"
                        >
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger id={`role-${updateUserId}`}>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="staff">Staff</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`firstName-${updateUserId}`}
                                                        type="text"
                                                        placeholder="First Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Middle Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`middleName-${updateUserId}`}
                                                        type="text"
                                                        placeholder="Middle Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`lastName-${updateUserId}`}
                                                        type="text"
                                                        placeholder="Last Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`username-${updateUserId}`}
                                                        type="text"
                                                        placeholder="Username"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`email-${updateUserId}`}
                                                        type="email"
                                                        placeholder="Email Address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>)
            }

            {
                lastDeletedUser && (
                    <AlertDialog open={!!lastDeletedUser} onOpenChange={(open) => {
                        if (!open) {
                            setLastDeletedUser(null);
                        }
                    }}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete user {lastDeletedUser.username} and remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async (e) => {
                                        await handleDelete(e, lastDeletedUser);
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>)
            }
            <div className="flex items-center justify-center py-4">
                <Input
                placeholder="Filter emails..."
                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex items-center justify-center w-full overflow-auto">
                <div className="flex items-center justify-center rounded-md border overflow-auto xl:w-full lg:w-[800px] md:w-[600px] sm:w-[500px] w-[250px]">

                    <Table>
                    <TableHeader className="bg-secondary">
                        {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            )
                            })}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                            >
                            No results.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                </div>
            </div>
        </div>
    )
};
