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
import { Checkbox } from "@/components/ui/checkbox"
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
import { useGetUsersQuery } from "@/lib/redux/services/usersApi"
import { TUpdateUser, TUser } from "@/types"
import Spinner from "@/components/Loading/Spinner"
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
import { useDeleteUser, useUpdateUser } from "@/services/UserService"
import { toast } from "sonner"
import { MouseEvent, useEffect, useMemo, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserDataTable() {
    const { data: response, error, isLoading } = useGetUsersQuery();
    const [users, setUsers] = useState<TUser[]>([]);
    const { deleteUser, isDeleted, extra } = useDeleteUser();
    const { updateUser, isUpdated, extra: updateUserExtra } = useUpdateUser();
    const [updateUserId, setUpdateUserId] = useState("");
    const [lastDeletedUserId, setLastDeletedUserId] = useState<string | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [openDeleteDialogUserId, setOpenDeleteDialogUserId] = useState<string | null>(null);

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const [formData, setFormData] = useState<TUpdateUser>({
        role: "",
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
    });

    const handleUserDeleted = (userId: string | null) => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    const handleDelete = async (e: MouseEvent<HTMLButtonElement>, userId : string): Promise<void> => {
        e.preventDefault();
        await deleteUser(userId);
        setLastDeletedUserId(userId);
    };

    const handleUpdate = async (userId: string) => {
        try {
            const response = await updateUser({ id: userId, user: formData });

            console.log(formData, userId, response);
            if (isUpdated) {
                toast.success("User updated successfully!");
            } else {
                
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (isDeleted && lastDeletedUserId) {
            toast.success("Deleted successfully!");
            handleUserDeleted(lastDeletedUserId); // Remove from list
            setLastDeletedUserId(null);
        }
        
        if (extra.error) {
            toast.error("Failed to delete user.");
        }

        if (
            updateUserExtra.error &&
            typeof updateUserExtra.error === "object" &&
            "data" in updateUserExtra.error &&
            updateUserExtra.error.data &&
            typeof updateUserExtra.error.data === "object" &&
            "message" in updateUserExtra.error.data
        ) {
            toast.error((updateUserExtra.error.data as { message?: string }).message);
        }

    }, [isDeleted, extra.error, lastDeletedUserId, updateUserExtra]);

    useEffect(() => {
        setUsers(response?.data?.content ?? []);
    }, [response]);

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
                            <DropdownMenuItem asChild>
                                <Dialog>
                                    <DialogTrigger
                                        className="flex items-center justify-start gap-2 w-full p-2"
                                    >
                                        <FilePenLine className="size-4" />
                                        Edit
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit User Details</DialogTitle>
                                            <DialogDescription>
                                                Click save after updating the user details.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleUpdate(user.id);
                                            }}
                                            className="grid gap-4"
                                        >
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`role-${user.id}`}>Role</Label>
                                                    <Select
                                                        defaultValue={user.role}
                                                        onValueChange={(value) => {
                                                            setFormData({ ...formData, role: value })
                                                        }}
                                                    >
                                                        <SelectTrigger id={`role-${user.id}`}>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="staff">Staff</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`firstName-${user.id}`}>First Name</Label>
                                                    <Input id={`firstName-${user.id}`} name="firstName" defaultValue={user.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`middleName-${user.id}`}>Middle Name</Label>
                                                    <Input id={`middleName-${user.id}`} name="middleName" defaultValue={user.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`lastName-${user.id}`}>Last Name</Label>
                                                    <Input id={`lastName-${user.id}`} name="lastName" defaultValue={user.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`username-${user.id}`}>Username</Label>
                                                    <Input id={`username-${user.id}`} name="username" defaultValue={user.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor={`email-${user.id}`}>Email</Label>
                                                    <Input id={`email-${user.id}`} name="email" defaultValue={user.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
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
                                </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <AlertDialog>
                                    <AlertDialogTrigger
                                        id={`delete-user-trigger-${user.id}`}
                                        className="flex items-center justify-start gap-2 w-full p-2"
                                    >
                                        <Trash2 className="size-4" />
                                        Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete user {user.username} and remove the data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                            asChild
                        >
                            <button
                                type="button"
                                onClick={async (e) => {
                                    await handleDelete(e, user.id);
                                    // Manually close the dialog by clicking the cancel button
                                    const dialog = e.target.closest('[role="dialog"]');
                                    if (dialog) {
                                        const cancelBtn = dialog.querySelector('[data-radix-alert-dialog-cancel]');
                                        if (cancelBtn) (cancelBtn as HTMLElement).click();
                                    }
                                }}
                                className="disabled:cursor-not-allowed"
                                disabled={user.username === "melvstein"}
                            >
                                Continue
                            </button>
                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
            const lastName = row.original.lastName;
            return (
            <span className="whitespace-nowrap">
                {firstName} {lastName}
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
        return <Spinner />;
    }

    return (
        <div className="w-full">
        <div className="flex items-center py-4">
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
        <div className="rounded-md border">
            <Table>
            <TableHeader>
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
