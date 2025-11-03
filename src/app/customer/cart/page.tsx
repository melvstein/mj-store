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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TCheckoutOrder } from "@/types/TOrder";
import { useCheckoutItemsMutation } from "@/lib/redux/services/ordersApi";
import { toastMessage } from "@/lib/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

type TCart = {
    items: TCartItemWithPrice[] | [];
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
            const itemsWithPrice = cartData.data.items.map((item: TCartItemWithPrice) => ({
                ...item,
                price: item.price ?? 0
            }));

            const totalAmount = cartData.data.items.reduce((sum: number, item: TCartItemWithPrice) => sum + ((item.price ?? 0) * (item.quantity || 1)), 0);
            
            setCart({
                items: itemsWithPrice,
                itemCount: cartData.data.items.length,
                totalAmount
            });
        }
    }, [status, router, customerData, cartData, customerLoading, cartLoading]);

    useEffect(() => {
        if (cart.items.length > 0) {
            const totalAmount = cart.items.reduce(
            (sum, item: TCartItemWithPrice) => sum + ((item.price ?? 0) * (item.quantity || 1)), 0);

            setCart(prev => ({
                ...prev,
                totalAmount,
                itemCount: prev.items.length
            }));
        }
    }, [cart.items, cart.totalAmount]);

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <section className="container mx-auto min-h-screen">
            <Navbar />
            <div className="py-20 px-4">
                {cart.itemCount > 0 ? (
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
                                Your Shopping Cart
                                <CheckoutItems customer={customer} />
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

const CheckoutItems = ({ customer } : {customer:TCustomer}) => {
    //const [setToasterMessage] = useToaster();
    const [checkoutItems] = useCheckoutItemsMutation();

    const formSchema = z.object({
        customerId: z.string(),
        paymentMethod: z.string().min(3, "Payment method is required"),
        shippingDetails: z.object({
            receiverFirstName: z.string().min(1, "First name is required"),
            receiverMiddleName: z.string().optional(),
            receiverLastName: z.string().min(1, "Last name is required"),
            receiverContactNumber: z.string().min(11, "Contact number is required"),
            shippingAddress: z.object({
                addressType: z.string(),
                street: z.string(),
                district: z.string(),
                city: z.string(),
                province: z.string(),
                country: z.string(),
                zipCode: z.number(),
            }),
            isDefault: z.boolean().optional(),
        }),
    });

    const form = useForm<TCheckoutOrder>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerId: customer?.id || "",
            paymentMethod: "",
            shippingDetails: {
            receiverFirstName: customer?.firstName || "",
            receiverMiddleName: customer?.middleName || "",
            receiverLastName: customer?.lastName || "",
            receiverContactNumber: customer?.contactNumber || "",
            shippingAddress: {
                addressType: customer?.address?.addressType || "",
                street: customer?.address?.street || "",
                district: customer?.address?.district || "",
                city: customer?.address?.city || "",
                province: customer?.address?.province || "",
                country: customer?.address?.country || "",
                zipCode: customer?.address?.zipCode || 0,
            },
            isDefault: false,
            },
        },
    });

    useEffect(() => {
        if (customer) {
            form.reset({
            customerId: customer.id,
            paymentMethod: "",
            shippingDetails: {
                receiverFirstName: customer.firstName,
                receiverMiddleName: customer.middleName || "",
                receiverLastName: customer.lastName,
                receiverContactNumber: customer.contactNumber,
                shippingAddress: {
                    addressType: customer.address?.addressType || "",
                    street: customer.address?.street || "",
                    district: customer.address?.district || "",
                    city: customer.address?.city || "",
                    province: customer.address?.province || "",
                    country: customer.address?.country || "",
                    zipCode: customer.address?.zipCode || 0,
                },
                isDefault: false,
            },
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const onSubmit = async (data: TCheckoutOrder, event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        
        try {
            const response = await checkoutItems(data).unwrap();

            if (response && response.code == ApiResponse.success.code) {
                toastMessage("success", "Checkout successful!", true);
            } else {
                toastMessage("error", response?.message || "Checkout failed. Please try again.", true);
            }
        } catch {
            toastMessage("error", "An error occurred during checkout. Please try again.", true);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Checkout</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Shipping Details</DialogTitle>
                    <DialogDescription>
                        Please provide your shipping details to complete the purchase.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96">
                    <form id="form-checkout-items"  onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="grid grid-cols-1 md:grid-cols-4">
                                    <Controller
                                        name="paymentMethod"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-checkout-items-payment-method">
                                                        Payment Method
                                                    </FieldLabel>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Payment Method" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Payment Methods</SelectLabel>
                                                                <SelectItem value="cod">COD</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    />
                                    <Controller
                                        name="shippingDetails.receiverFirstName"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-receiver-first-name">
                                                Receiver First Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-receiver-first-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Receiver First Name"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.receiverMiddleName"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-receiver-middle-name">
                                                Receiver Middle Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-receiver-middle-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Receiver Middle Name (Optional)"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.receiverLastName"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-receiver-last-name">
                                                Receiver Last Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-receiver-last-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Receiver Last Name"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.receiverContactNumber"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-receiver-contact-number">
                                                Receiver Contact Number
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                id="form-checkout-items-receiver-contact-number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Receiver Contact Number"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </FieldSet>
                            <FieldSeparator />
                            <FieldSet>
                                <FieldLegend>Shipping Address</FieldLegend>
                                <FieldGroup className="grid grid-cols-1 md:grid-cols-4">
                                    <Controller
                                        name="shippingDetails.shippingAddress.addressType"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-checkout-items-address-type">
                                                        Address Types
                                                    </FieldLabel>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Address Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Address Types</SelectLabel>
                                                                <SelectItem value="home">Home</SelectItem>
                                                                <SelectItem value="work">work</SelectItem>
                                                                <SelectItem value="other">other</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            );
                                        }}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.street"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-street">
                                                Street
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-street"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Street"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.district"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-district">
                                                District
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-district"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="District"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.city"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-city">
                                                City
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-city"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="City"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.province"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-province">
                                                Province
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-province"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Province"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.country"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-country">
                                                Country
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-checkout-items-country"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Country"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                    <Controller
                                        name="shippingDetails.shippingAddress.zipCode"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-checkout-items-zipCode">
                                                Zip Code
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                id="form-checkout-items-zipCode"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Zip Code"
                                                autoComplete="on"
                                            />
                                            {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </ScrollArea>
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                        <Button type="submit" form="form-checkout-items">proceed</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

type TGetProductItemProps = {
    customer: TCustomer;
    item: TCartItem;
    setCart: React.Dispatch<React.SetStateAction<TCart>>;
}

const GetProductItem = ({ customer, item, setCart } : TGetProductItemProps) => {
    //const [setToasterMessage] = useToaster();
    const { data: productData, error, isLoading: productLoading } = useGetProductBySkuQuery(item.sku, { skip: !item.sku });
    const [product, setProduct] = useState({} as TProduct);
    const [updateItem, { isLoading: updateLoading }] = useUpdateCartMutation();
    const [removeItem] = useRemoveItemFromCartMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);
    const [isRemoved, setIsRemoved] = useState(false);
    const subTotal = Number(quantity) * Number(product.price) || 0;

    // Keep local quantity in sync when parent updates the cart item
    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    useEffect(() => {
        if (productLoading || updateLoading) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }

        if (productData && productData.data) {
            setProduct(productData.data);
        }

        setCart((prev) => {
            const itemsWithPrice = prev.items.map((item: TCartItemWithPrice) => (item.sku === product.sku ? { ...item, price: product.price } : item));

            return {
                ...prev,
                items: itemsWithPrice,
            }
        });

    }, [productLoading, updateLoading, productData, setCart, product.price, product.sku]);

    const handleUpdateCartItems = async (action : string) => {
        if (action == "decrease") {
            if (quantity > 1) {
                const result = await updateItem({ 
                    customerId: customer.id,
                    action,
                    items: [
                        {
                            sku: product.sku,
                            quantity: 1
                        }
                    ] 
                }).unwrap();

                if (result && result.code == ApiResponse.success.code) {
                    if (result.data) {
                        setQuantity(quantity - 1);

                        setCart((prev) => {
                            const itemsWithPrice = prev.items.map((item) =>
                                item.sku === product.sku
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                            );

                            return {
                                ...prev,
                                items: itemsWithPrice
                            };
                        });

                        toast.success(`Item ${capitalize(product.name)} quantity decreased`);
                    }
                } else {
                    toast.error(result?.message || "Failed to decrease item quantity");
                }
            }
        }

        if (action == "increase") {
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
                    setQuantity(quantity + 1);

                    setCart((prev) => {
                        const itemsWithPrice = prev.items.map((item) =>
                            item.sku === product.sku
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                        );

                        return {
                            ...prev,
                            items: itemsWithPrice
                        };
                    });

                    toast.success(`Item ${capitalize(product.name)} quantity increased`);
                }
            } else {
                toast.error(result?.message || "Failed to increase item quantity");
            }
        }
    };

    const handleRemoveItem = async () => {
        const result = await removeItem({ 
            customerId: customer.id,
            sku: product.sku
        }).unwrap();

        if (result && result.code == ApiResponse.success.code) {
            // Update local removed state for immediate UI feedback
            setIsRemoved(true);

            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.sku !== product.sku),
                itemCount: prev.items.filter((item) => item.sku !== product.sku).length
            }));

            toastMessage("success", `Item ${capitalize(product.name)} removed from cart`, true);
        } else {
            toast.error(result?.message || "Failed to remove item from cart");
        }
    };

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
                                    { subTotal }
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
                                onClick={handleRemoveItem}
                            >
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <ButtonGroup>
                        <Button 
                            className={clsx({ "opacity-50 cursor-not-allowed": quantity <= 1 })}
                            onClick={() => handleUpdateCartItems("decrease")}
                            disabled={ quantity <= 1}
                        >
                            <FaMinus />
                        </Button>
                        <ButtonGroupSeparator />
                        <Button 
                            onClick={() => handleUpdateCartItems("increase")}
                            className={clsx({ "opacity-50 cursor-not-allowed": quantity >= product.stock })}
                            disabled={quantity >= product.stock}
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