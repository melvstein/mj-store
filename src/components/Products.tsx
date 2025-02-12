"use client"

import Image from "next/image";
import type { TProduct } from "@/types";
import { useEffect, useState } from "react";
import ProductRating from "./ProductRating"

const Products: React.FC = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("api/products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading...</p>
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

    return (
        <section>
            <div className="grid grid-cols-5 gap-4">
            {
                products.map((product, index) => {
                    return (
                        <div key={index} className="flex flex-col items-center justify-center px-4 bg-white rounded-xl shadow-xl border space-y-2">
                            <div className="flex items-center justify-center size-[300px] px-8">
                                {
                                    product.images.map((images) => (
                                        <Image src={images} width={500} height={500} key={index} alt={product.name} />
                                    ))
                                }
                            </div>
                            <div className="flex flex-col items-start justify-center w-full">
                                <div className="flex items-center justify-between w-full font-bold">
                                    <p>{ product.name }</p>
                                    <p>${ product.price }</p>
                                </div>
                                <p className="text-sm">{ product.description }</p>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-yellow-500">
                                <ProductRating rating={3.5}/>
                            </div>
                            <div className="flex items-center justify-between w-full py-4">
                                <p className="text-sm">Stock:<span className="font-bold">{ product.stock }</span></p>
                                <button className="bg-blue-400 text-white border rounded-md px-2 py-1">Add to cart</button>
                            </div>
                        </div>
                    );
                })
            }
            </div>
        </section>
    );
}

export default Products;