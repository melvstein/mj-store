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

export function UserDataTable() {
    const { data: response, error, isLoading: userLoading } = useGetUsersQuery();
    const [doUpdate, { isLoading: updateUserLoading }] = useUpdateUserMutation();
    const [doDelete, { isLoading: deleteUserLoading }] = useDeleteUserMutation();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<TUser[]>([]);
    const [updateUserId, setUpdateUserId] = useState("");
    const [lastDeletedUser, setLastDeletedUser] = useState<TUser | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [openDeleteDialogUserId, setOpenDeleteDialogUserId] = useState<string | null>(null);

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const updateUserDefault = {
        role: "",
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
    };

    const [formData, setFormData] = useState<TUpdateUser>(updateUserDefault);

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

    const handleUpdate = async (userId: string) => {
        try {
            const response = await doUpdate({ id: userId, user: formData });

            if (response?.data?.code === Response.SUCCESS) {
                toast.success(response.data.message || "User updated successfully!");

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { 
                            ...user, 
                            ...formData, 
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

        setFormData(updateUserDefault);
    };

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
                                            setFormData({
                                            role: user.role,
                                            email: user.email,
                                            firstName: user.firstName,
                                            middleName: user.middleName,
                                            lastName: user.lastName,
                                            username: user.username,
                                        })
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
            {   formData && updateUserId &&
                (<Dialog open={!!formData.role} onOpenChange={(open) => {
                    if (!open) {
                        setFormData(updateUserDefault);
                    }
                }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Details</DialogTitle>
                        <DialogDescription>
                            Click save after updating the user details.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleUpdate(updateUserId);
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor={`role-${updateUserId}`}>Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, role: value })
                                    }}
                                >
                                    <SelectTrigger id={`role-${updateUserId}`}>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor={`firstName-${updateUserId}`}>First Name</Label>
                                <Input id={`firstName-${updateUserId}`} name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor={`middleName-${updateUserId}`}>Middle Name</Label>
                                <Input id={`middleName-${updateUserId}`} name="middleName" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor={`lastName-${updateUserId}`}>Last Name</Label>
                                <Input id={`lastName-${updateUserId}`} name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor={`username-${updateUserId}`}>Username</Label>
                                <Input id={`username-${updateUserId}`} name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor={`email-${updateUserId}`}>Email</Label>
                                <Input id={`email-${updateUserId}`} name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
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
