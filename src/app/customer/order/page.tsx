"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import { TCustomer } from "@/types/TCustomer";
import { useGetCustomerByEmailQuery } from "@/lib/redux/services/customersApi";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading/Loading";
import { TOrder } from "@/types/TOrder";
import { useGetOrdersByCustomerIdQuery } from "@/lib/redux/services/ordersApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "./components/OrdersTable";
import OrderDetails from "./components/OrderDetails";
import { OrderStatusCode } from "@/enums/OrderStatus";

const Order: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [customer, setCustomer] = useState<TCustomer>({} as TCustomer);
    const [orders, setOrders] = useState<TOrder[]>([]);
    const customerId = customer.id ?? null;
    const {data: customerData, isLoading: customerLoading} = useGetCustomerByEmailQuery(session?.user?.email as string, { skip: !session?.user?.email });
    const {data: ordersData, isLoading: ordersLoading} = useGetOrdersByCustomerIdQuery({customerId, status: OrderStatusCode.CANCELLED, excludeStatus: true});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // ✅ Only redirect when status is fully known
        if (status === "unauthenticated") {
            router.push(paths.customer.login.main.path);
        }

        if (status === "loading" || customerLoading || ordersLoading) {
            setIsLoading(true);
            return;
        }

        if (customerData && customerData.data) {
            setCustomer(customerData.data);
        }

        if (ordersData && ordersData.data) {
            setOrders(ordersData.data);
        }

    }, [status, router, customerData, ordersData, customerLoading, ordersLoading]);

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }
    // Filter out orders that are delivered or cancelled
    /* const activeOrders = orders.filter(o => 
        o.status !== OrderStatusCode.DELIVERED && o.status !== OrderStatusCode.CANCELLED
    ); */

    return (
        <section className="container mx-auto min-h-screen">
            <Navbar />
            <Tabs defaultValue="ongoing_orders" className="py-16 px-4">
                <TabsList>
                    <TabsTrigger value="ongoing_orders">Your Orders</TabsTrigger>
                    <TabsTrigger value="order_list">Order List</TabsTrigger>
                </TabsList>
                <TabsContent value="ongoing_orders">
                    {orders.length > 0 ? (
                        <div>
                            <div>
                                <p className="mb-4">You have {orders.length} {orders.length === 1 ? "active order" : "active orders"}.</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4">
                                {orders.map((order) => {
                                    return (
                                        <OrderDetails key={order.id} order={order} />
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                    <div className="text-center mt-20">
                        <h1 className="text-2xl font-bold mb-4">Your Order is Empty</h1>
                        <p className="mb-4">Looks like you have not added any items to your cart yet.</p>
                        <Button 
                            onClick={() => router.push(paths.home)}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                    )}
                </TabsContent>
                <TabsContent value="order_list">
                    <OrdersTable customerId={customer.id} />
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default Order;