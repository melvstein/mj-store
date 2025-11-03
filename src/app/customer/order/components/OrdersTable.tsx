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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import { useEffect, useMemo, useState } from "react"
import Loading from "@/components/Loading/Loading"
import { formatDateTime } from "@/utils/helper"
import { useGetOrdersByCustomerIdQuery } from "@/lib/redux/services/ordersApi"
import { TOrder } from "@/types/TOrder"
import OrderStatusBadge from "./OrderStatusBadge"
import { OrderStatusCode } from "@/enums/OrderStatus"
import ViewInvoice from "./ViewInvoice"
import ViewItems from "./ViewItems"

export function OrdersTable({ customerId }: { customerId: string }) {
    const { data: response, isLoading: ordersLoading } = useGetOrdersByCustomerIdQuery({customerId, status: null, excludeStatus: false});
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    useEffect(() => {
        if (ordersLoading) {
            setIsLoading(ordersLoading);
            return;
        }

        setOrders(response?.data ?? []);
    }, [ordersLoading, response]);

    const columns = useMemo<ColumnDef<TOrder, any>[]>(() => [
        {
            header: "Actions",
            cell: ({ row }) => {
                const order = row.original;
    
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
                                        asChild
                                    >
                                        <ViewItems order={order} />
                                    </DropdownMenuItem>
                                    {
                                        (order.status === OrderStatusCode.PROCESSING || order.status === OrderStatusCode.SHIPPED) &&
                                        (
                                            <DropdownMenuItem
                                                className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                                asChild
                                            >
                                                <ViewInvoice order={order} />
                                            </DropdownMenuItem>
                                        )
                                    }
                                    {
                                        (order.status === OrderStatusCode.DELIVERED) &&
                                        (
                                            <DropdownMenuItem
                                                className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                            >
                                                View Receipt
                                            </DropdownMenuItem>
                                        )
                                    }
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
            accessorKey: "customerId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Customer ID
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("customerId")}</div>,
        },
        {
            accessorKey: "orderNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Order Number
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>ORD-{row.getValue("orderNumber")}</div>,
        },
        {
            accessorKey: "paymentMethod",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Payment Method
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("paymentMethod")}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <OrderStatusBadge status={row.getValue("status")} />,
        },
        {
            accessorKey: "totalAmount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total Amount
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("totalAmount")}</div>,
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

    const table = useReactTable<TOrder>({
        data: orders,
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
            <div className="flex items-center justify-center py-4">
                <Input
                    placeholder="Filter orders..."
                    value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("orderNumber")?.setFilterValue(event.target.value)
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