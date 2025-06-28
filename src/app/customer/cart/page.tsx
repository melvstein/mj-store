"use client"

import { useEffect } from "react";
import ProductRating from "@/components/ProductRating";
import Loading from "@/components/Loading/Spinner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/redux/store";
import { getProducts } from "@/lib/redux/slices/productSlice";
import ProductImageSlider from "@/components/ProductImageSlider";
import CartSummary from "@/components/CartSummary";
import Config from "@/utils/config";
import { TCurrencyCode } from "@/types";

const Cart: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.products);
    const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

    useEffect(() => {
        dispatch(getProducts());
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

  return (
    <section>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
            <div className="col-span-3">
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {
                    items.map((product, index) => {
                        return (
                            <div key={index} className="flex flex-col items-center justify-between px-4 rounded-xl shadow border space-y-2">
                                <div className="flex items-center justify-center w-full min-w-[200px] max-w-[300px]">
                                    {
                                        /* product.images.map((images) => (
                                            <Image src={images} width={500} height={500} key={index} alt={product.name} priority className="flex items-center justify-center" />
                                        )) */
                                        
                                        <ProductImageSlider key={index} images={product.images} />
                                    }
                                </div>
                                <div className="flex flex-col items-start justify-center w-full">
                                    <div className="flex items-center justify-between w-full font-bold">
                                        <p>{ product.name }</p>
                                        <p>{ Config.getCurrencySymbol(currencyCode) } { product.price }</p>
                                    </div>
                                    <p className="text-sm">{ product.description }</p>
                                </div>
                                <div className="flex items-center justify-center space-x-2 text-yellow-500">
                                    <ProductRating rating={3.5}/>
                                </div>
                                <div className="flex items-center justify-between w-full py-4">
                                    <p className="text-sm">Stock:<span className="font-bold">{ product.stock }</span></p>
                                    <button className="bg-blue-400 text-white rounded-md px-2 py-1">Checkout</button>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
            <div className="col-span-1 md:order-last order-first px-4 space-y-2">
                <p className="text-3xl ">Summary</p>
                    <div className="space-y-2">
                        {items.map((product, index) => {
                            return (
                                <div key={index} className="flex items-center justify-between space-x-4">
                                    <input type="checkbox" id="" />
                                    <CartSummary product={product} />
                                </div>
                            );
                        })}
                    </div>
                <div className="flex items-center justify-between w-full">
                    <input type="checkbox" name="all" id="all" />
                    <p>
                        Total 111
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Cart;