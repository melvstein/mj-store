"use client"

import Image from "next/image";
import { useEffect } from "react";
import ProductRating from "./ProductRating"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchProducts } from "@/lib/redux/slices/productSlice";

const Products: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center pt-[180px]">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
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
        if (!session?.user) {
            router.push("/customer/signin");
        }
    }

    return (
        <section>
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {
                items.map((product, index) => {
                    return (
                        <div key={index} className="flex flex-col items-center justify-center px-4 rounded-xl shadow border space-y-2">
                            <div className="flex items-center justify-center w-full min-w-[200px] max-w-[300px] p-8">
                                {
                                    product.images.map((images) => (
                                        <Image src={images} width={500} height={500} key={index} alt={product.name} priority className="flex items-center justify-center" />
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
                                <button onClick={handleAddToCart} className="bg-blue-400 text-white rounded-md px-2 py-1">Add to cart</button>
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