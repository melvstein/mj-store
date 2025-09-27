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
import Response from "@/constants/Response"
import Loading from "@/components/Loading/Loading"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField, FormItem, FormLabel, FormControl, Form, FormDescription } from "@/components/ui/form"
import { formatDateTime } from "@/utils/helper"
import { useDeleteCustomerMutation, useGetCustomersQuery, useUpdateCustomerMutation } from "@/lib/redux/services/customersApi"
import { TCustomer, TUpdateCustomer } from "@/types/TCustomer"
import { Switch } from "@/components/ui/switch"

const updateCustomerDefault: TUpdateCustomer = {
    username: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    contactNumber: "",
    isActive: false,
    isVerified: false,
}

const formUpdateCustomerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    contactNumber: z.string().optional(),
    isActive: z.boolean(),
    isVerified: z.boolean(),
});

export function CustomersDataTable() {
    const { data: response, error, isLoading: customersLoading } = useGetCustomersQuery();
    const [doUpdate] = useUpdateCustomerMutation();
    const [doDelete] = useDeleteCustomerMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<TCustomer[]>([]);
    const [updateCustomerId, setUpdateCustomerId] = useState("");
    const [lastDeletedCustomer, setLastDeletedCustomer] = useState<TCustomer | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const [customerUpdateFormData, setCustomerUpdateFormData] = useState(updateCustomerDefault);

    const form = useForm<z.infer<typeof formUpdateCustomerSchema>>({
        resolver: zodResolver(formUpdateCustomerSchema),
        defaultValues: customerUpdateFormData,
    });

    const onUpdateCustomer = async (data: z.infer<typeof formUpdateCustomerSchema>) => {
        try {
            const response = await doUpdate({ id: updateCustomerId, customer: data }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(response.message || "Customer updated successfully!");

                setCustomers((prevCustomers) =>
                    prevCustomers.map((customer) =>
                        customer.id === updateCustomerId && response.data ? response.data as TCustomer : customer
                    )
                );
            } else {
                toast.error(response?.message || "Customer failed to update!");
            }
        } catch (err: any) {
            if (err.data && err.data.message) {
                console.log("DB error", err.data.message);
                toast.error("Uknown error: Please contact the administrator.");
            } else {
                toast.error(err.message);
            }
        }

        setCustomerUpdateFormData(updateCustomerDefault);
    };

    const onError = (errors: any) => {
         console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${error.message}`);
            toast.error(`${error.message}`);
        });
    };

    useEffect(() => {
        if (customersLoading) {
            setIsLoading(customersLoading);
            return;
        }

        setCustomers(response?.data?.content ?? []);
    }, [customersLoading, response]);

    const handleDelete = async (e: MouseEvent<HTMLButtonElement>, customer : TCustomer): Promise<void> => {
        e.preventDefault();

        try {
            const response = await doDelete(customer.id).unwrap();
  
            if (response?.code == Response.SUCCESS) {
                toast.success(response.data.message || "Deleted successfully!");
                setCustomers((prev) => prev.filter((prevCustomer) => prevCustomer.id !== customer.id));
                setLastDeletedCustomer(null);
            } else {
                toast.error(response?.message || "Customer failed to delete!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    /* const handleUpdate = async (userId: string) => {
        try {
            const response = await doUpdate({ id: userId, user: customerUpdateFormData });

            if (response?.data?.code === Response.SUCCESS) {
                toast.success(response.data.message || "User updated successfully!");

                setCustomers((prevCustomers) =>
                    prevCustomers.map((user) =>
                        user.id === userId ? { 
                            ...user, 
                            ...customerUpdateFormData, 
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

        setCustomerUpdateFormData(updateCustomerDefault);
    }; */

    const columns = useMemo<ColumnDef<TCustomer, any>[]>(() => [
    {
        header: "Actions",
        cell: ({ row }) => {
            const customer = row.original;

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
                                        setUpdateCustomerId(customer.id);

                                        const customerData: TUpdateCustomer = {
                                            username: customer.username,
                                            email: customer.email,
                                            firstName: customer.firstName,
                                            middleName: customer.middleName,
                                            lastName: customer.lastName,
                                            contactNumber: customer.contactNumber,
                                            profileImageUrl: customer.profileImageUrl,
                                            address: customer.address,
                                            isActive: customer.isActive,
                                            isVerified: customer.isVerified,
                                        };

                                        setCustomerUpdateFormData(customerData);
                                        // Reset the form with the customer data
                                        form.reset(customerData);
                                    }}
                                >
                                    <FilePenLine className="size-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer disabled:cursor-not-allowed"
                                    onClick={() => {
                                        setLastDeletedCustomer(customer);
                                    }}
                                    disabled={customer.username === "melvstein"} // Prevent deletion of the default customer
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
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Active
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("isActive") ? "yes" : "no"}</div>,
    },
        {
            accessorKey: "isVerified",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Verified
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("isVerified") ? "yes" : "no"}</div>,
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
                    { createdAt ? formatDateTime(createdAt) : "" }
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
                    { updatedAt ? formatDateTime(updatedAt) : "" }
                </span>
            );
        },
    },
    ], []);

    const table = useReactTable<TCustomer>({
        data: customers,
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
        initialState: {
            sorting: [{ id: "updatedAt", desc: true }],
        },
        enableSortingRemoval: false
    });

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <div className="w-full">
            { customerUpdateFormData && updateCustomerId &&
                (<Dialog open={!!customerUpdateFormData.username} onOpenChange={(open) => {
                    if (!open) {
                        setCustomerUpdateFormData(updateCustomerDefault);
                    }
                }}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Customer Details</DialogTitle>
                        <DialogDescription>
                            Click save after updating the customer details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onUpdateCustomer, onError)}
                            className="grid gap-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    {field.value ? "Active" : "Inactive" }
                                                </FormLabel>
                                                <FormDescription>
                                                    Toggle to set customer active or inactive.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            </FormItem>
                                        )}
                                        />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="isVerified"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    {field.value ? "Verified" : "Not Verified" }
                                                </FormLabel>
                                                <FormDescription>
                                                    Toggle to set customer verified or not verified.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            </FormItem>
                                        )}
                                        />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`firstName-${updateCustomerId}`}
                                                        type="text"
                                                        placeholder="First Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Middle Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`middleName-${updateCustomerId}`}
                                                        type="text"
                                                        placeholder="Middle Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`lastName-${updateCustomerId}`}
                                                        type="text"
                                                        placeholder="Last Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`username-${updateCustomerId}`}
                                                        type="text"
                                                        placeholder="Username"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`email-${updateCustomerId}`}
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
                            <DialogFooter className="gap-4 sm:gap-0">
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
                lastDeletedCustomer && (
                    <AlertDialog open={!!lastDeletedCustomer} onOpenChange={(open) => {
                        if (!open) {
                            setLastDeletedCustomer(null);
                        }
                    }}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete customer {lastDeletedCustomer.username} and remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async (e) => {
                                        await handleDelete(e, lastDeletedCustomer);
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
                <div className="flex items-center justify-center rounded-md border overflow-auto w-full">
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
