"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { themeStyles } from "@/app/admin/components/react-select/themeStyles";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAddProductMutation } from "@/lib/redux/services/productsApi";
import Loading from "@/components/Loading/Loading";

interface IOptions {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

const ProductAddPage = () => {
    const [addProduct, { isLoading: addingProduct }] = useAddProductMutation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (addingProduct) {
            setIsLoading(true);
            return;
        }
    }, [addingProduct]);

    const defaultValues = {
        tags: [],
        sku: "",
        name: "",
        description: "",
        price: 0,
        stock: 0,
        brand: "",
        isActive: true,
    }
    
    const formSchema = z.object({
        tags: z.array(z.string()).min(1, "At least 1 tag is required").max(3, "Maximum 3 tags allowed"),
        sku: z.string().min(1, "SKU is required"),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        price: z.coerce.number().min(0, "Price must be positive"),
        stock: z.coerce.number().min(0, "Stock must be positive"),
        brand: z.string().optional(),
        isActive: z.boolean(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form submitted with data:", data);

        try {
            const response = await addProduct(data).unwrap();
            console.log("Product added successfully:", response);
            toast.success("Product added successfully!");
            form.reset(defaultValues); // Reset form to default values after successful submission
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product. Please try again.");
            return;
        }
    };

    const onError = (errors: any) => {
         console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${error.message}`);
            toast.error(`${error.message}`);
        });
    };

    const productTagOptions: IOptions[] = [
        { value: 'electronics', label: 'Electronics', color: '#3B82F6' },
        { value: 'clothing', label: 'Clothing', color: '#8B5CF6' },
        { value: 'accessories', label: 'Accessories', color: '#F59E0B' },
        { value: 'sports', label: 'Sports', color: '#10B981' },
        { value: 'books', label: 'Books', color: '#F97316' },
        { value: 'home-garden', label: 'Home & Garden', color: '#84CC16' },
        { value: 'beauty', label: 'Beauty & Health', color: '#EC4899' },
        { value: 'automotive', label: 'Automotive', color: '#6B7280' },
        { value: 'toys', label: 'Toys & Games', color: '#EF4444' },
        { value: 'food-beverage', label: 'Food & Beverage', color: '#14B8A6' },
        { value: 'technology', label: 'Technology', color: '#3B82F6' },
        { value: 'furniture', label: 'Furniture', color: '#92400E' },
        { value: 'jewelry', label: 'Jewelry', color: '#7C3AED' },
        { value: 'pet-supplies', label: 'Pet Supplies', color: '#059669' },
        { value: 'office', label: 'Office Supplies', color: '#4B5563' },
    ];

    const animatedComponents = makeAnimated();

    if (isLoading) {
        return (
            <Loading onComplete={() => setIsLoading(false)} />
        );
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Add New Product
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="col-span-full">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                            </div>
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Tags (1-3 required)</FormLabel>
                                                <div className={`text-sm mt-1 ${
                                                    !field.value || field.value.length === 0 
                                                        ? 'text-orange-400' 
                                                        : field.value.length > 3 
                                                            ? 'text-destructive' 
                                                            : 'text-muted-foreground'
                                                }`}>
                                                    {field.value?.length || 0}/3 tags selected
                                                    {(!field.value || field.value.length === 0) && " (minimum 1 required)"}
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={productTagOptions}
                                                    styles={themeStyles}
                                                    value={productTagOptions.filter(option => 
                                                        field.value?.includes(option.value)
                                                    )}
                                                    onChange={(newValue, _actionMeta) => {
                                                        const selectedOptions = newValue as readonly IOptions[] | null;
                                                        const values = selectedOptions ? 
                                                            selectedOptions.map((option) => option.value) : 
                                                            [];
                                                        
                                                        if (values.length <= 3) {
                                                            field.onChange(values);
                                                        } else {
                                                            toast.error("Maximum 3 tags allowed");
                                                        }
                                                    }}
                                                    placeholder="Select product tags (max 3)"
                                                    isOptionDisabled={() => field.value?.length >= 3}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                        </CardContent>
                        <CardFooter className="flex items-center justify-end">
                            <Button type="submit">
                                Add
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}

export default ProductAddPage;