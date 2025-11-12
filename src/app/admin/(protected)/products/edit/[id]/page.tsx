/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import BreadCrumb from "@/components/Breadcrumb";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Response from "@/constants/Response";
import { useGetProductQuery, useUpdateProductMutation } from "@/lib/redux/services/productsApi";
import { TProduct, TUpdateProduct } from "@/types";
import paths from "@/utils/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ProductImagesCarousel from "../../components/ProductImagesCarousel";

const breadcrumbMain = {
    path: paths.admin.dashboard.main.path,
    name: paths.admin.dashboard.main.name,
};

const breadcrumbPaths = [
    {
        path: paths.admin.products.main.path,
        name: paths.admin.products.main.name,
    }
];

interface PageProps {
    params: Promise<{ id: string }>;
}

const ProductEditPage = ({ params }: PageProps) => {
    const { id } = use(params);

    const { data: response, isLoading: productLoading } = useGetProductQuery(id, {
        skip: !id,
    });

    const [product, setProduct] = useState<TProduct | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (productLoading) {
            setIsLoading(true);
            return;
        }

        if (response?.data) {
            setProduct(response.data);
            setIsLoading(false);
        }
    }, [productLoading, response]);

    if (isLoading) {
        return <Loading onComplete={() => setIsLoading(false)} />;
    }

    return (
        <div className="flex flex-col items-center justify-start gap-4">
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <ProductDetails product={product} />
            <ProductImagesCarousel product={product} />
        </div>
    );
};

export default ProductEditPage;

const updateProductDefault: TUpdateProduct = {
    tags: [],
    sku: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    isActive: true,
}

const formUpdateProductSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    brand: z.string().min(1, "Brand is required"),
    /* images: z.array(z.string().min(1, "Image URL is required")), */
    isActive: z.boolean(),
});

const ProductDetails = ({ product }: { product: TProduct | null }) => {
    const [doUpdate] = useUpdateProductMutation();
    const [productUpdateFormData, setProductUpdateFormData] = useState(updateProductDefault);

    const form = useForm<z.infer<typeof formUpdateProductSchema>>({
        resolver: zodResolver(formUpdateProductSchema),
        defaultValues: productUpdateFormData,
    });

    const onUpdateProduct = async (data: z.infer<typeof formUpdateProductSchema>) => {
        //console.log(data);

        try {
            const response = await doUpdate({ id: product?.id, product: data }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(response.message || "Product updated successfully!");

                form.reset({
                sku: data.sku,
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: data.price,
                stock: data.stock,
                isActive: data.isActive,
            });
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
            console.log("Field Error:", fieldName, error?.message);
            toast.error(`${error.message}`);
        });
    };

    useEffect(() => {
        if (product) {
            form.reset({
                sku: product.sku,
                name: product.name,
                brand: product.brand,
                description: product.description,
                price: product.price,
                stock: product.stock,
                isActive: product.isActive,
            });
        }
    }, [product]);

    return (
        <div className="flex flex-col items-center justify-start gap-4 w-full">
            <Form {...form}>
                <form 
                    className="w-full"
                    onSubmit={form.handleSubmit(onUpdateProduct, onError)} 
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-start gap-2">
                                <FilePenLine className="size-4" />
                                Edit Details
                            </CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="SKU"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Name"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Brand"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Price"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Stock"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    {field.value ? "Enabled" : "Disabled" }
                                                </FormLabel>
                                                <FormDescription>
                                                    Toggle to show or hide this product
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
                                <div className="col-span-full">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Description"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end">
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}