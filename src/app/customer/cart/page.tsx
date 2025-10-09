"use client"

import { useEffect, useState } from "react";
import { TCurrencyCode, TProduct } from "@/types";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import { TCustomer } from "@/types/TCustomer";
import { TCartItem } from "@/types/TCart";
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

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

type TCart = {
    items: TCartItem[] | [];
    itemCount: number;
    totalAmount?: number;
};

const Cart: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [customer, setCustomer] = useState<TCustomer>({} as TCustomer);
    const [cart, setCart] = useState<TCart>({
        items: [],
        itemCount: 0,
        totalAmount: 0
    });
    const {data: customerData, isLoading: customerLoading} = useGetCustomerByEmailQuery(session?.user?.email as string, { skip: !session?.user?.email });
    const {data: cartData, isLoading: cartLoading} = useGetCartByCustomerIdQuery(customer.id, { skip: !customer.id });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      // ✅ Only redirect when status is fully known
      if (status === "unauthenticated") {
        router.push(paths.customer.login.main.path);
      }

      if (status === "loading" || customerLoading || cartLoading) {
          setIsLoading(true);
          return;
      }

      if (customerData && customerData.data) {
          setCustomer(customerData.data);
      }

      if (cartData && cartData.data) {
          setCart({
              items: cartData.data.items,
              itemCount: cartData.data.items.length,
              totalAmount: 0
          });
      }
    }, [status, router, customerData, cartData, customerLoading, cartLoading]);

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
                            <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
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

type TGetProductItemProps = {
    customer: TCustomer;
    item: TCartItem;
    setCart?: React.Dispatch<React.SetStateAction<TCart>>;
}

const GetProductItem = ({ customer, item, setCart } : TGetProductItemProps) => {
    const { data: productData, error, isLoading: productLoading } = useGetProductBySkuQuery(item.sku, { skip: !item.sku });
    const [product, setProduct] = useState({} as TProduct);
    const [updateItem, { isLoading: updateLoading }] = useUpdateCartMutation();
    const [removeItem] = useRemoveItemFromCartMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        if (productLoading || updateLoading) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }

        if (productData && productData.data) {
            setProduct(productData.data);
        }

        if (setCart) {
            setCart(prev => {
                if (prev) {
                    return {
                        ...prev,
                        totalAmount: (prev.totalAmount || 0) + (item.quantity * product.price)
                    }
                }
                return prev;
            });
        }

    }, [productLoading, updateLoading, productData, item.quantity, product.price, setCart]);

    if (error) return <p>Error loading product.</p>;

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <Card className={clsx("flex flex-col justify-between", { "hidden": isRemoved })}>
            <CardHeader>
                <div className="flex items-center justify-center px-8 w-full">
                    <ProductImagesCarousel key={String(product.id)} images={product.images} />
                </div>
            </CardHeader>
            <div>
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
                        <div className="flex items-center justify-between w-full">
                            <p className="text-sm">Stock:<span className="font-bold">{ product.stock }</span></p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-sm">Quantity:<span className="font-bold">{ quantity }</span></p>
                            <p className="text-sm">
                                Total Amount:
                                <span className="font-bold">
                                    { Number(quantity) * Number(product.price) || 0 }
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <FaTimes />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Remove Item?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={
                                    async () => {
                                        const result = await removeItem({ 
                                            customerId: customer.id,
                                            sku: product.sku
                                        }).unwrap();

                                        if (result && result.code == ApiResponse.success.code) {
                                            setIsRemoved(true);
                                            toast.success(`Item ${capitalize(product.name)} removed from cart`);
                                        } else {
                                            toast.error(result?.message || "Failed to remove item from cart");
                                        }
                                    }
                                }
                            >
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <ButtonGroup>
                        <Button 
                            className={clsx({ "opacity-50 cursor-not-allowed": quantity <= 1 })}
                            onClick={
                                async () => {
                                    if (quantity > 1) {
                                        const result = await updateItem({ 
                                            customerId: customer.id,
                                            action: "decrease",
                                            items: [
                                                {
                                                    sku: product.sku,
                                                    quantity: 1
                                                }
                                            ] 
                                        }).unwrap();

                                        if (result && result.code == ApiResponse.success.code) {
                                            if (result.data) {
                                                setQuantity(result.data.items.find(i => i.sku === item.sku)?.quantity || quantity - 1);
                                                
                                                if (setCart) {
                                                    setCart(prev => {
                                                        if (prev) {
                                                            return {
                                                                ...prev,
                                                                totalAmount: prev.totalAmount ? prev.totalAmount - product.price : 0
                                                            }
                                                        }
                                                        return prev;
                                                    });
                                                }

                                                toast.success(`Item ${capitalize(product.name)} quantity decreased`);
                                            }
                                        } else {
                                            toast.error(result?.message || "Failed to decrease item quantity");
                                        }
                                    }
                                }
                            }
                        >
                            <FaMinus />
                        </Button>
                        <ButtonGroupSeparator />
                        <Button 
                            onClick={
                                async () => {
                                    const result = await updateItem({ 
                                        customerId: customer.id,
                                        action: "increase",
                                        items: [
                                            {
                                                sku: product.sku,
                                                quantity: 1
                                            }
                                        ] 
                                    }).unwrap();

                                    if (result && result.code == ApiResponse.success.code) {
                                        if (result.data) {
                                            setQuantity(result.data.items.find(i => i.sku === item.sku)?.quantity || quantity + 1);
                                            
                                            if (setCart) {
                                                setCart(prev => {
                                                    if (prev) {
                                                        return {
                                                            ...prev,
                                                            totalAmount: prev.totalAmount ? prev.totalAmount + product.price : 0
                                                        }
                                                    }
                                                    return prev;
                                                });
                                            }
                                            
                                            toast.success(`Item ${capitalize(product.name)} quantity increased`);
                                        }
                                    } else {
                                        toast.error(result?.message || "Failed to increase item quantity");
                                    }
                                }
                            }
                        >
                            <FaPlus />
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </div>
        </Card>
    );
}

export default Cart;