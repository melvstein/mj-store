"use client"

import { useEffect, useState } from "react";
import { TCurrencyCode, TProduct } from "@/types";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import { TCustomer } from "@/types/TCustomer";
import { TCartItem, TCartItemWithPrice } from "@/types/TCart";
import { useGetCustomerByEmailQuery } from "@/lib/redux/services/customersApi";
import { useGetCartByCustomerIdQuery, useRemoveItemFromCartMutation, useUpdateCartMutation } from "@/lib/redux/services/cartsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGetProductBySkuQuery } from "@/lib/redux/services/productsApi";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductRating from "@/components/ProductRating";
import Config from "@/utils/config";
import Loading from "@/components/Loading/Loading";
import ApiResponse from "@/lib/apiResponse";
import { toast } from "sonner";
import { capitalize } from "@/lib/utils";
import clsx from "clsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useToaster from "@/hooks/useToaster";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

const Order: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [customer, setCustomer] = useState<TCustomer>({} as TCustomer);
    const [cart, setCart] = useState<TCart>({
        items: [],
        itemCount: 0,
        totalAmount: 0
    });
    const {data: customerData, isLoading: customerLoading} = useGetCustomerByEmailQuery(session?.user?.email as string, { skip: !session?.user?.email });
    const {data: orderData, isLoading: orderLoading} = useGetCartByCustomerIdQuery(customer.id, { skip: !customer.id });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // ✅ Only redirect when status is fully known
        if (status === "unauthenticated") {
            router.push(paths.customer.login.main.path);
        }

        if (status === "loading" || customerLoading || orderLoading) {
            setIsLoading(true);
            return;
        }

        if (customerData && customerData.data) {
            setCustomer(customerData.data);
        }

    }, [status, router, customerData, orderData, customerLoading, orderLoading]);

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <section className="container mx-auto min-h-screen">
            <Navbar />
            <div className="pt-20 px-4">
                {cart.itemCount > 0 ? (
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
                                Your Shopping Cart
                                <Button
                                    onClick={() => handleCheckout()}
                                >
                                    Checkout
                                </Button>
                            </h1>
                            <p className="mb-4">You have {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart.</p>
                            <p className="mb-4 font-bold">Total Amount: { Config.getCurrencySymbol(currencyCode) } { cart.totalAmount }</p>
                        </div>
                        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                            {cart.items.map((item) => {
                                return (
                                    <GetProductItem key={item.sku} customer={customer} item={item} setCart={setCart} />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                <div className="text-center mt-20">
                    <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="mb-4">Looks like you havenot added any items to your cart yet.</p>
                    <Button 
                        onClick={() => router.push(paths.home)}
                    >
                        Continue Shopping
                    </Button>
                </div>
                )}
            </div>
        </section>
    )
}

export default Order;