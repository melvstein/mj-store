"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TOrder } from "@/types/TOrder";
import OrderStatusBadge from "./OrderStatusBadge";
import { TCurrencyCode } from "@/types";
import Config from "@/utils/config";
import { Button } from "@/components/ui/button";
import { OrderStatusCode } from "@/enums/OrderStatus";
import OrderItemCard from "./OrderItemCard";
import ViewInvoice from "./ViewInvoice";
import { useUpdateOrderStatusMutation } from "@/lib/redux/services/ordersApi";
import ApiResponse from "@/lib/apiResponse";
import { TCartItem } from "@/types/TCart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toastMessage } from "@/lib/toaster";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;
const currencySymbol = Config.getCurrencySymbol(currencyCode);

const OrderDetails = ({ order } : { order: TOrder }) => {
    //const [setToasterMessage] = useToaster();
    const [doUpdateStatus] = useUpdateOrderStatusMutation();

    const handleCancelOrder = async (event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        
        try {
            const result = await doUpdateStatus({ orderId: order.id, status: OrderStatusCode.CANCELLED }).unwrap();
            
            if (result && result.code === ApiResponse.success.code) {
                toastMessage("success", "Order cancelled successfully.", true);
            }
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toastMessage("error", "Failed to cancel order. Please try again.", true);
        }
    }

    return (
        <div key={order.id} className="w-full gap-4 flex flex-col">
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between w-full space-y-4 md:space-y-0">
                        <div className="flex flex-col items-start space-y-2">
                            <div className="flex space-x-2">
                                <Badge> {order.paymentMethod} </Badge>
                                {<OrderStatusBadge status={order.status} />}
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                                <p>Order ID: {order.id}</p>
                            </div>
                            <p>Total Amount: {currencySymbol} {order.totalAmount}</p>
                        </div>
                        {
                            order.status === OrderStatusCode.PENDING 
                            ? (
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructive"
                                    >Cancel</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. Proceeding will permanently cancel your order.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleCancelOrder()}
                                    > Continue
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            )
                            : (order.status !== OrderStatusCode.CANCELLED && order.status !== OrderStatusCode.PROCESSING && order.status !== OrderStatusCode.DELIVERED && <ViewInvoice variant="default" order={order} />)
                        }
                    </CardTitle>
                </CardHeader>
            </Card>
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
                {order.items.map((item: TCartItem) => {
                    return (
                        <OrderItemCard key={item.sku} item={item} />
                    );
                })}
            </div>
        </div>
    );
}

export default OrderDetails;