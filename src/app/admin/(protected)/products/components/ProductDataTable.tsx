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
import { TProduct, TUpdateProduct } from "@/types"
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
import { useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/lib/redux/services/productsApi"
import Link from "next/link"
import paths from "@/utils/paths"

const updateProductDefault: TUpdateProduct = {
    tags: [],
    sku: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    images: [],
    isActive: true,
}

const formUpdateProductSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().min(0, "Stock must be positive"),
    brand: z.string().min(1, "Brand is required"),
    images: z.array(z.string().min(1, "Image URL is required")),
    isActive: z.boolean(),
});

export function ProductDataTable() {
    const { data: response, error, isLoading: productLoading } = useGetProductsQuery();
    const [doUpdate] = useUpdateProductMutation();
    const [doDelete] = useDeleteProductMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<TProduct[]>([]);
    const [updateProductId, setUpdateProductId] = useState("");
    const [lastDeletedProduct, setLastDeletedProduct] = useState<TProduct | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const [productUpdateFormData, setProductUpdateFormData] = useState(updateProductDefault);

    const form = useForm<z.infer<typeof formUpdateProductSchema>>({
        resolver: zodResolver(formUpdateProductSchema),
        defaultValues: productUpdateFormData,
    });

    const onUpdateProduct = async (data: z.infer<typeof formUpdateProductSchema>) => {
        try {
            const response = await doUpdate({ id: updateProductId, product: data }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(response.message || "Product updated successfully!");

                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updateProductId ? {
                            ...product,
                            ...data,
                            updatedAt: new Date().toLocaleString('sv-SE')
                        } : product
                    )
                );
            } else {
                toast.error(response?.message || "Product failed to update!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }

        setProductUpdateFormData(updateProductDefault);
    };

    const onError = (errors: any) => {
         console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    useEffect(() => {
        if (productLoading) {
            setIsLoading(productLoading);
            return;
        }

        setProducts(response?.data?.content ?? []);
    }, [productLoading, response]);

    const handleDelete = async (e: MouseEvent<HTMLButtonElement>, product : TProduct): Promise<void> => {
        e.preventDefault();

        try {
            const response = await doDelete(product.id).unwrap();
  
            if (response?.code == Response.SUCCESS) {
                toast.success(response.data.message || "Deleted successfully!");
                setProducts((prev) => prev.filter((prevProduct) => prevProduct.id !== product.id));
                setLastDeletedProduct(null);
            } else {
                toast.error(response?.message || "Product failed to delete!");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    
    const columns = useMemo<ColumnDef<TProduct, any>[]>(() => [
    {
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;

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
                                    <Link href={`${paths.admin.products.edit.path}/${product.id}`} target="__blank">
                                        <FilePenLine className="size-4" />
                                        {paths.admin.products.edit.name}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer disabled:cursor-not-allowed"
                                    onClick={() => {
                                        setLastDeletedProduct(product);
                                    }}
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
        accessorKey: "tags",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tags
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const tags = row.original.tags.join(', ');
            return (<div>{tags}</div>)
        },
    },
    {
        accessorKey: "sku",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    SKU
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const description = row.original.description;
            return (<div>{description}</div>)
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("price")}</div>,
    },
    {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
        accessorKey: "brand",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Brand
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("brand")}</div>,
    },
    {
        accessorKey: "images",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Images
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const images = row.original.images;
            return (<div>{images && images.join(", ")}</div>)
        },
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

    const table = useReactTable<TProduct>({
        data: products,
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
            { productUpdateFormData && updateProductId &&
                (<Dialog open={!!productUpdateFormData.sku} onOpenChange={(open) => {
                    if (!open) {
                        setProductUpdateFormData(updateProductDefault);
                    }
                }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product Details</DialogTitle>
                        <DialogDescription>
                            Click save after updating the product details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onUpdateProduct, onError)}
                            className="grid gap-4"
                        >
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`name-${updateProductId}`}
                                                        type="text"
                                                        placeholder="Name"
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
                lastDeletedProduct && (
                    <AlertDialog open={!!lastDeletedProduct} onOpenChange={(open) => {
                        if (!open) {
                            setLastDeletedProduct(null);
                        }
                    }}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete product {lastDeletedProduct.name} and remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async (e) => {
                                        await handleDelete(e, lastDeletedProduct);
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
                placeholder="Filter products..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
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
