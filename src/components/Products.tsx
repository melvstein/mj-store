"use client"

import ProductRating from "./ProductRating"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TCurrencyCode, TProduct } from "@/types";
import Config from "@/utils/config";
import { useGetProductsQuery } from "@/lib/redux/services/productsApi";
import Loading from "./Loading/Loading";
import { useEffect, useState } from "react";
import ProductImagesCarousel from "./ProductImagesCarousel";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

const Products = () => {
    const { status } = useSession();
    const router = useRouter();
    const { data: response, error, isLoading: productsLoading } = useGetProductsQuery();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

    useEffect(() => {
        if (productsLoading) {
            setIsLoading(true);
            return;
        }

        if (response?.data?.content) {
            setProducts(response.data.content);
            setIsLoading(false);
        }
    }, [productsLoading, response]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center pt-[180px]">
                <Loading onComplete={ () => setIsLoading(false) } />
            </div>
        );
    }

    if (error) {
        const errorMessage =
            "status" in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : "An unknown error occurred";
    
        return <p>{errorMessage}</p>;
    }

    /* function calculateAverageRating(reviews: Record<number, number>): number {
        let totalScore = 0;
        let totalReviews = 0;
      
        for (const [rating, count] of Object.entries(reviews)) {
          totalScore += Number(rating) * count;
          totalReviews += count;
        }
      
        return totalReviews === 0 ? 0 : parseFloat((totalScore / totalReviews).toFixed(1));
      } */

    const handleAddToCart = () => {
        if (status === 'unauthenticated') {
            router.push("/customer/login");
        }
    }

    return (
        <section>
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {
                products.filter((product) => product.isActive).map((product : TProduct) => {
                    console.log(product);
                    return (
                        <Card key={String(product.id)}>
                            <CardHeader>
                                <div className="flex items-center justify-center px-8 w-full">
                                    <ProductImagesCarousel key={String(product.id)} images={product.images} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center flex-col gap-4">
                                    <div className="flex items-center justify-center space-x-2 text-yellow-500">
                                        <ProductRating rating={3.5}/>
                                    </div>
                                    <div className="flex flex-col items-start justify-center w-full">
                                        <div className="flex items-center justify-between w-full font-bold">
                                            <p className="first-letter:uppercase">{ product.name }</p>
                                            <p>{ Config.getCurrencySymbol(currencyCode) } { product.price }</p>
                                        </div>
                                        <p className="text-sm">{ product.description }</p>
                                    </div>
                                    <div className="flex items-center justify-between w-full py-4">
                                        <p className="text-sm">Stock:<span className="font-bold">{ product.stock }</span></p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-end">
                                <Button type="submit">Add to cart</Button>
                            </CardFooter>
                        </Card>
                    );
                })
            }
            </div>
        </section>
    );
}

export default Products;