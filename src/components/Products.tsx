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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ButtonGroup } from "./ui/button-group";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Input } from "./ui/input";
import { useUpdateCartMutation } from "@/lib/redux/services/cartsApi";
import { useGetCustomerByEmailQuery } from "@/lib/redux/services/customersApi";
import { TCustomer } from "@/types/TCustomer";
import { isEmpty } from "lodash"
import useToaster from "@/hooks/useToaster";
import clsx from "clsx";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

const Products = () => {
    const { data: session, status } = useSession();
    const {data: customerData, isLoading: customerLoading} = useGetCustomerByEmailQuery(session?.user?.email as string, { skip: !session?.user?.email });
    const { data: response, error, isLoading: productsLoading } = useGetProductsQuery();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customer, setCustomer] = useState<TCustomer>({} as TCustomer);

    useEffect(() => {
        if (productsLoading || customerLoading) {
            setIsLoading(true);
            return;
        }

        if (response?.data?.content) {
            setProducts(response.data.content);
            setIsLoading(false);
        }

        if (customerData && customerData.data) {
            setCustomer(customerData.data);
        }
    }, [productsLoading, customerLoading, response, customerData]);

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

    return (
        <section>
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {
                products.filter((product) => product.isActive).map((product : TProduct) => {
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
                                <AddToCart customer={customer} product={product} />
                            </CardFooter>
                        </Card>
                    );
                })
            }
            </div>
        </section>
    );
}

const AddToCart = ({ customer, product } : { customer: TCustomer; product: TProduct }) => {
    const [setToasterMessage] = useToaster();
    const [updateItem, { isLoading: updateLoading }] = useUpdateCartMutation();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (updateLoading) {
            setIsLoading(updateLoading);
        }
    }, [updateLoading]);

    const increase = () => {
        setQuantity((prev) => Math.min(prev + 1, product.stock))
    }

    const decrease = () => {
        setQuantity((prev) => Math.max(prev - 1, 1))
    }

    const handleAddToCart = async () => {
        if (isEmpty(customer)) {
            router.push("/customer/login");
            return;
        }

        const result = await updateItem({ 
                    customerId: customer.id,
                    action: "increase",
                    items: [
                        {
                            sku: product.sku,
                            quantity
                        }
                    ] 
                }).unwrap();

                console.log("result", result);
                setToasterMessage("success", "Added to cart successfully!", true);
    };

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="submit">Add to cart</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Cart</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center px-8 w-full">
                    <ProductImagesCarousel key={String(product.id)} images={product.images} />
                </div>
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
                <DialogFooter>
                    <div className="flex items-center justify-between w-full gap-28">
                        <ButtonGroup>
                            <Button 
                                onClick={decrease}
                                className={clsx({ "opacity-50 cursor-not-allowed": quantity <= 1 })}
                                disabled={ quantity <= 1}
                            >
                                <FaMinus />
                            </Button>
                            <Input
                                type="number"
                                value={quantity}
                                min={1}
                                max={product.stock}
                                className="
                                    appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none
                                    [&::-webkit-outer-spin-button]:appearance-none
                                    text-center
                                "
                                onChange={(e) => {
                                    const val = Number(e.target.value)
                                    if (!isNaN(val)) {
                                        setQuantity(Math.max(1, Math.min(val, product.stock)))
                                    }
                                }}
                            />
                            <Button 
                                onClick={increase}
                                className={clsx({ "opacity-50 cursor-not-allowed": quantity >= product.stock })}
                                disabled={quantity >= product.stock}
                            >
                                <FaPlus />
                            </Button>
                        </ButtonGroup>
                        <Button
                            onClick={handleAddToCart}
                        >
                            Add to cart
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Products;