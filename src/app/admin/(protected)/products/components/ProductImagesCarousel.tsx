"use client"

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
import { useUploadProductImagesMutation } from "@/lib/redux/services/productsApi";
import { TProduct } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ProductImagesCarousel = ({ product }: { product: TProduct | null }) => {
    console.log("ProductImagesCarousel component loaded with product:", product);
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const [uploadProductImages] = useUploadProductImagesMutation();
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
        if (!product?.id) {
            toast.error("Product ID is required");
            return;
        }

        if (!data.images || data.images.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        console.log("=== UPLOAD START ===");
        console.log("Uploading files:", data.images.map(f => f.name));
        console.log("Current productImages state before upload:", productImages);
        console.log("Product prop images:", product?.images);

        try {
            // Upload all files in a single request
            const response = await uploadProductImages({
                id: product.id,
                files: data.images,
            }).unwrap();

            console.log("=== UPLOAD RESPONSE ===");
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Response images:", response.data?.images);

            if (response?.code === Response.SUCCESS) {
                toast.success(`Successfully uploaded ${data.images.length} image(s)!`);
                
                // Method 1: If API returns all product images
                if (response.data?.images && Array.isArray(response.data.images)) {
                    console.log("=== STATE UPDATE ===");
                    console.log("Setting productImages to:", response.data.images);
                    // Reverse the array to show newest images first
                    setProductImages([...response.data.images].reverse());
                } 
                // Method 2: If API only returns new images, merge with existing
                else if (response.data?.newImages && Array.isArray(response.data.newImages)) {
                    console.log("=== MERGE NEW IMAGES ===");
                    console.log("New images to add:", response.data.newImages);
                    setProductImages(prev => {
                        // Add new images to the beginning of the array
                        const combined = [...response.data.newImages, ...prev];
                        const unique = Array.from(new Set(combined));
                        console.log("Previous images:", prev);
                        console.log("Combined unique images:", unique);
                        return unique;
                    });
                }
                // Method 3: Manual merge if API returns single image URL
                else if (response.data?.imageUrl || response.data?.url) {
                    const newImageUrl = response.data.imageUrl || response.data.url;
                    console.log("=== SINGLE IMAGE URL ===");
                    console.log("Adding single image:", newImageUrl);
                    setProductImages(prev => {
                        // Add new image to the beginning of the array
                        const updated = [newImageUrl, ...prev];
                        console.log("Updated images:", updated);
                        return updated;
                    });
                }
                // Fallback: Force page refresh
                else {
                    console.log("=== NO IMAGES IN RESPONSE - RELOADING ===");
                    window.location.reload();
                }
                
                // Reset form after successful upload
                form.reset();
                
                // Navigate to the first slide (newest image) after upload
                if (api) {
                    api.scrollTo(0);
                }
                
            } else {
                toast.error(response?.message || "Upload failed!");
            }
        } catch (err: any) {
            console.error("=== UPLOAD ERROR ===", err);
            toast.error(err.message || "Upload failed");
        }
    };

    const onError = (errors: any) => {
        console.log("Validation Errors:", errors);

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            console.log(`${fieldName}: ${error.message}`);
            toast.error(`${fieldName}: ${error.message}`);
        });
    };

    const removeSelectedFile = (indexToRemove: number) => {
        const currentFiles = form.getValues('images');
        const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
        form.setValue('images', updatedFiles);
    };

    // Initialize productImages when product prop changes
    useEffect(() => {
        console.log("=== PRODUCT PROP CHANGED ===");
        console.log("Product:", product);
        console.log("Product images:", product?.images);
        
        if (product?.images && Array.isArray(product.images)) {
            console.log("Setting productImages from product prop:", product.images);
            // Reverse the array to show newest images first
            setProductImages([...product.images].reverse());
        } else {
            console.log("No images in product or product is null, setting empty array");
            setProductImages([]);
        }
    }, [product?.id, product?.images]); // Watch both product ID and images

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
        console.log("New productImages state:", productImages);
        console.log("Length:", productImages.length);
    }, [productImages]);

    // Use productImages state for display to show updated images
    const imagesToDisplay = productImages.length > 0 ? productImages : (product?.images || []).slice().reverse();

    console.log("=== RENDER ===");
    console.log("Images to display:", imagesToDisplay);
    console.log("Display count:", imagesToDisplay.length);

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-start gap-2">
                        <Images className="size-4" />
                        Images ({imagesToDisplay.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-col gap-4">
                    {imagesToDisplay.length > 0 ? (
                        <>
                            <Carousel setApi={setApi} className="w-full max-w-xs">
                                <CarouselContent>
                                    {imagesToDisplay.map((image, index) => {
                                        console.log(`Rendering image ${index}:`, image);
                                        return (
                                            <CarouselItem 
                                                key={`${image}-${index}`}
                                                className="flex items-center justify-center aspect-square"
                                            >
                                                <Image 
                                                    src={image} 
                                                    alt={`Product Image ${index + 1}`} 
                                                    width={300} 
                                                    height={300} 
                                                    className="object-cover w-full h-full rounded-lg"
                                                />
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
                                                        className="cursor-pointer"
                                                    />
                                                </FormControl>
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
                                <div className="flex items-center justify-end w-full">
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