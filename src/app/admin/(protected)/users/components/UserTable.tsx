// components/UserTable.tsx
"use client";
import { TUser } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FilePenLine, Trash2, ArrowDown, ArrowUp} from 'lucide-react';
import { useDeleteUser } from "@/services/UserService";
import { Button } from "@/components/ui/button";
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
import clsx from "clsx";
import { toast } from "sonner";

const UserTable = ({ data, onUserDeleted }: { data: TUser[], onUserDeleted: (id: string | null) => void }) => {
    const { deleteUser, isDeleted, extra } = useDeleteUser();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [lastDeletedUserId, setLastDeletedUserId] = useState<string | null>(null);

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const handleDelete = async (e:  React.MouseEvent<HTMLButtonElement>, userId : string): Promise<void> => {
        e.preventDefault();
        await deleteUser(userId);
        setLastDeletedUserId(userId);
    };

    useEffect(() => {
        if (isDeleted && lastDeletedUserId) {
            toast.success("Deleted successfully!")
            setSuccessMessage("Deleted successfully!");
            onUserDeleted(lastDeletedUserId); // Remove from list
            setLastDeletedUserId(null);
        }
        
        if (extra.error) {
            setErrorMessage("Failed to delete user.");
        }
    }, [isDeleted, extra.error, lastDeletedUserId]);

    useEffect(() => {
        if (successMessage) {
            setSuccessMessage("");
        }

        if (errorMessage) {
            setErrorMessage("");
        }
    }, [successMessage, errorMessage]);

    const columns = useMemo<ColumnDef<TUser>[]>(() => [
        {
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline" 
                            className="text-blue-500"
                        >
                            <FilePenLine className="size-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="text-red-500"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        handleDelete(e, user.id)
                                    }} 
                                    className="disabled:cursor-not-allowed"
                                    disabled={user.username === "melvstein"}
                                >
                                    Continue
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
        {
            header: "ID",
            accessorKey: "id",
            enableSorting: true,
        },
        {
        header: "Role",
        accessorKey: "role",
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
        header: "Email",
        accessorKey: "email",
        },
        {
            header: "Username",
            accessorKey: "username",
        },
        {
            header: "Created At",
            accessorKey: "createdAt",
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
            header: "Updated At",
            accessorKey: "updatedAt",
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

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSortingRemoval: false
    });

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left bg-background text-skin-foreground">
            <thead className="bg-muted/10 text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => {
                
                return (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const isSorted = header.column.getIsSorted();

                            return (
                                <th key={header.id} className="px-6 py-3"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {isSorted === "desc" ? <ArrowDown className="size-4 cursor-pointer text-skin-muted" /> : 
                                            <ArrowUp className="size-4 cursor-pointer text-skin-muted" /> }
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                );
            })}
            </thead>
            <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary transition">
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default UserTable;
