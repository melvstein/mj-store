// components/UserTable.tsx
"use client";
import { TUser } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

const UserTable = ({ data }: { data: TUser[] }) => {
  const columns = useMemo<ColumnDef<TUser>[]>(() => [
    {
        header: "ID",
        accessorKey: "id",
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
    {
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center space-x-2">
                    <a href={`/admin/user/${user.id}/update`} className="text-blue-600 hover:underline">Update</a>
                    <a href={`/admin/user/${user.id}/delete`} className="text-red-600 hover:underline">Delete</a>
                </div>
            );
        },
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition">
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
