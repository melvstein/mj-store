/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Spinner from "@/components/Loading/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Response from "@/constants/Response";
import { useDeleteProductImagesMutation, useUploadProductImagesMutation } from "@/lib/redux/services/productsApi";
import { TProduct } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import { Badge } from "@/components/ui/badge";

const ProductImagesCarousel = ({ product }: { product: TProduct | null }) => {
    const [uploadProductImages, { isLoading: uploading }] = useUploadProductImagesMutation();
    const [deleteProductImages, { isLoading: deleting }] = useDeleteProductImagesMutation();
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [productImages, setProductImages] = useState<string[]>([]);

    // Updated schema to handle multiple files
    const formUploadImageSchema = z.object({
        images: z
            .array(z.instanceof(File))
            .min(1, "At least one image is required")
            .max(10, "Maximum 10 images allowed")
            .refine((files) => files.every(file => file.size <= 5_000_000), {
                message: "Each file size should be less than 5MB",
            })
            .refine((files) => files.every(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type)), {
                message: "Only JPEG, PNG, and WebP files are allowed",
            }),
    });

    const form = useForm<z.infer<typeof formUploadImageSchema>>({
        resolver: zodResolver(formUploadImageSchema),
        defaultValues: {
            images: [],
        },
    });

    const onSubmit = async (data: z.infer<typeof formUploadImageSchema>) => {
        setIsLoading(true);

        if (!product?.id) {
            toast.error("Product ID is required");
            return;
        }

        if (!data.images || data.images.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        try {
            // Upload all files in a single request
            const response = await uploadProductImages({
                id: product.id,
                files: data.images,
            }).unwrap();

            if (response?.code === Response.SUCCESS) {
                toast.success(`Successfully uploaded ${data.images.length} image(s)!`);

                if (response.data?.productImageUrls && Array.isArray(response.data.productImageUrls)) {
                    console.log("=== STATE UPDATE ===");
                    console.log("Setting productImages to:", response.data.images);
                    // Reverse the array to show newest images first
                    setProductImages([...response.data.productImageUrls].reverse());
                }
                
                resetForm();
                
                // Navigate to the first slide (newest image) after upload
                if (api) {
                    api.scrollTo(0);
                }
            } else {
                toast.error(response?.data.message || "Upload failed!");
            }
        } catch (err: any) {
            console.error("=== UPLOAD ERROR ===", err);
            toast.error(err.message || "Upload failed");
        }
    };

    const onError = (errors: any) => {
        console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log("Field Error:", fieldName, error?.message);
            toast.error(`${error.message}`);
        });
    };

    const removeSelectedFile = (indexToRemove: number) => {
        const currentFiles = form.getValues('images');
        const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
        form.setValue('images', updatedFiles);

        // If no files left, clear the input
        if (updatedFiles.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const resetForm = () => {
        form.reset();
        // Clear the file input manually
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = async (index: number) => {
        console.log("Deleting image at index:", index);
        
        if (!product?.id) {
            toast.error("Product ID is required");
            return;
        }

        try {
            const response = await deleteProductImages({
                id: product.id,
                imageIndexes: [index],
            }).unwrap();
            
            if (response?.code === Response.SUCCESS) {
                toast.success("Image deleted successfully!");
                
                if (response?.data.productImageUrls && Array.isArray(response.data.productImageUrls) && response.data.productImageUrls.length > 0) {
                    const newImages = [...response.data.productImageUrls].reverse();
                    setProductImages(newImages);
                    setCount(newImages.length);
                    
                    // After deletion, adjust current position
                    // If we deleted the last image, go to the previous one
                    // If we deleted from the middle, stay at the same position (but content will shift)
                    const newCurrent = Math.min(current, newImages.length);
                    setCurrent(newCurrent > 0 ? newCurrent : 1);
                    
                    // Navigate carousel to the adjusted position
                    if (api && newCurrent > 0) {
                        // Use setTimeout to ensure state has updated
                        setTimeout(() => {
                            api.scrollTo(newCurrent - 1); // scrollTo uses 0-based index
                        }, 100);
                    }
                } else {
                    // No images left
                    setCurrent(0);
                    setCount(0);
                    setProductImages([]);
                }
            } else {
                toast.error(response?.data.message || "Failed to delete image");
            }
        } catch (err: any) {
            console.error("Error deleting image:", err);
            toast.error("Failed to delete image: " + (err.data?.message || "Unknown error"));
        }
    };

    // Initialize productImages when product prop changes
    useEffect(() => {
        if (product?.images && Array.isArray(product.images)) {
            console.log("Setting productImages from product prop:", product.images);
            // Reverse the array to show newest images first
            setProductImages([...product.images].reverse());
        } else {
            console.log("No images in product or product is null, setting empty array");
            setProductImages([]);
        }
    }, [product]);

    // Setup carousel when API is ready
    useEffect(() => {
        if (!api) {
            return;
        }

        const updateCarousel = () => {
            setCount(api.scrollSnapList().length);
            setCurrent(api.selectedScrollSnap() + 1);
        };

        updateCarousel();
        api.on("select", updateCarousel);

        return () => {
            api.off("select", updateCarousel);
        };
    }, [api]);

    // Debug state changes
    useEffect(() => {
        console.log("=== PRODUCT IMAGES STATE CHANGED ===");
        console.log("Length:", productImages.length);
        setCount(productImages.length);
        form.reset();

        if (uploading || deleting) {
            setIsLoading(true);
            return;
        }
    }, [productImages, uploading, deleting, form]);

    // Use productImages state for display to show updated images
    const imagesToDisplay = productImages.length > 0 ? productImages : (product?.images || []).slice().reverse();

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-start gap-2">
                        <Images className="size-4" />
                        Images <Badge variant="secondary">{imagesToDisplay.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-col gap-4">
                    {imagesToDisplay.length > 0 ? (
                        <>
                            <Carousel setApi={setApi} className="w-full max-w-xs">
                                <CarouselContent>
                                    {imagesToDisplay.map((image, index) => {
                                        index = imagesToDisplay.length - 1 - index; // Reverse index to show newest first
                                        return (
                                            <CarouselItem 
                                                key={`${image}-${index}`}
                                                className="flex items-center justify-center aspect-square"
                                            >
                                                {
                                                    isLoading ? (
                                                        <Spinner 
                                                            onComplete={() => {
                                                                setIsLoading(false);
                                                            }} 
                                                        />
                                                    ) : (
                                                        <div className="grid gap-2">
                                                            <Image 
                                                                src={image} 
                                                                alt={`Product Image ${index + 1}`} 
                                                                width={300} 
                                                                height={300} 
                                                                className="object-cover w-full h-full rounded-lg"
                                                            />
                                                            
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" className="hover:bg-red-500">Remove</Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the from the product.
                                                                    </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 focus:ring-offset-red-200"
                                                                        onClick={() => handleDeleteImage(index)}
                                                                    >
                                                                        Continue
                                                                    </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    )
                                                }
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                            <div className="text-muted-foreground py-2 text-center text-sm">
                                Slide {current} of {count}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <div className="text-center">
                                <Images className="size-8 mx-auto mb-2" />
                                <p>No images available</p>
                            </div>
                        </div>
                    )}

                    <div className="w-full">
                        <Form {...form}>
                            <form 
                                className="flex flex-col items-center justify-between gap-4 h-full"
                                onSubmit={form.handleSubmit(onSubmit, onError)}
                            >
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Add Product Images (Max 10)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            console.log("Files selected:", files.map(f => f.name));
                                                            if (files.length > 0) {
                                                                field.onChange(files);
                                                            }
                                                        }}
                                                        className="cursor-pointer hidden"
                                                    />
                                                </FormControl>
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {field.value && field.value.length > 0 ? (
                                                            <div className="flex-1 overflow-hidden">
                                                                {field.value.length === 1 ? (
                                                                    <span className="truncate">{field.value[0].name}</span>
                                                                ) : field.value.length <= 3 ? (
                                                                    <span className="truncate">
                                                                        {field.value.map(f => f.name).join(', ')}
                                                                    </span>
                                                                ) : (
                                                                    <span className="truncate">
                                                                        {field.value.slice(0, 2).map(f => f.name).join(', ')} and {field.value.length - 2} more...
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">Choose files...</span>
                                                        )}
                                                    </div>
                                                {/* Display selected files */}
                                                {field.value && field.value.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Selected files: {field.value.length}
                                                        </p>
                                                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                                                            {field.value.map((file: File, index: number) => (
                                                                <div key={`${file.name}-${index}`} className="flex items-center justify-between text-xs bg-secondary px-2 py-1 rounded">
                                                                    <span className="truncate flex-1 mr-2">
                                                                        {file.name}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-4 w-4 p-0"
                                                                        onClick={() => removeSelectedFile(index)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-end w-full gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!form.watch('images') || form.watch('images').length === 0}
                                    >
                                        Upload {form.watch('images')?.length || 0} Image(s)
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductImagesCarousel;