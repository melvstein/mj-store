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
import { useMemo, useState } from "react";
import { FilePenLine, Trash2, ArrowDown, ArrowUp} from 'lucide-react';

const UserTable = ({ data }: { data: TUser[] }) => {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const columns = useMemo<ColumnDef<TUser>[]>(() => [
        {
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center space-x-2">
                        <a href={`/admin/user/${user.id}/update`} className="text-blue-600 hover:underline"><FilePenLine className="size-4" /></a>
                        <a href={`/admin/user/${user.id}/delete`} className="text-red-600 hover:underline"><Trash2 className="size-4" /></a>
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
