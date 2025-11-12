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
import { TOrder } from "@/types/TOrder"
import { useDeleteOrderMutation, useGetOrdersQuery } from "@/lib/redux/services/ordersApi"
import OrderStatusBadge from "@/app/customer/order/components/OrderStatusBadge"
import { OrderStatusCode } from "@/enums/OrderStatus"
import ViewInvoice from "@/app/customer/order/components/ViewInvoice"
import ViewReceipt from "@/app/customer/order/components/ViewReceipt"
import ViewItems from "./ViewItems"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ApiResponse from "@/lib/apiResponse"
import { toastMessage } from "@/lib/toaster"

export function OrdersDataTable() {
    const { data: response, isLoading: ordersLoading } = useGetOrdersQuery({ status: null });
    const orders = response?.data ?? [];
    const [isLoading, setIsLoading] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [deleteOrder] = useDeleteOrderMutation();

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    useEffect(() => {
        if (ordersLoading) {
            setIsLoading(ordersLoading);
            return;
        }
    }, [ordersLoading]);

    const handleDeleteOrder = async (orderId: string) => {
        // Implement delete order functionality here
        try {
            const result = await deleteOrder(orderId).unwrap();
            console.log("Delete result:", result);

            if (result && result.code == ApiResponse.success.code) {
                toastMessage("success", result.message || "Order deleted successfully.", true);
            } else {
                toastMessage("error", result.message || "Failed to delete order.", true);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete order.";
            toastMessage("error", errorMessage);
        }
    }

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
                                (order.status === OrderStatusCode.SHIPPED) &&
                                (
                                    <DropdownMenuItem
                                        className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                        asChild
                                    >
                                        <ViewInvoice order={order} variant="ghost" className="flex items-center justify-start" />
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                (order.status === OrderStatusCode.DELIVERED) &&
                                (
                                    <DropdownMenuItem
                                        className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                        asChild
                                    >
                                        <ViewReceipt order={order} variant="ghost" className="flex items-center justify-start" />
                                    </DropdownMenuItem>
                                )
                            }
                            <DropdownMenuItem
                                className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer"
                                asChild
                            >
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer text-sm">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete this order?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>No</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteOrder(order.id)}
                                        >
                                            Yes
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
        cell: ({ row }) => {
            return <div>{row.getValue("orderNumber")}</div>;
        },
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
        cell: ({ row }) => <div>{<OrderStatusBadge status={row.getValue("status")} />}</div>,
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
            cell: ({ row }) => <div className="flex items-end justify-end px-4">{row.getValue("totalAmount")}</div>,
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
                placeholder="Filter Order Number..."
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
