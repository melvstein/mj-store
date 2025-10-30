import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TOrder } from "@/types/TOrder";
import OrderStatusBadge from "./OrderStatusBadge";
import { TCurrencyCode } from "@/types";
import Config from "@/utils/config";
import { Button } from "@/components/ui/button";
import { OrderStatusCode } from "@/enums/OrderStatus";
import OrderItemCard from "./OrderItemCard";
import Invoice from "./Invoice";
import { useUpdateOrderStatusMutation } from "@/lib/redux/services/ordersApi";
import ApiResponse from "@/lib/apiResponse";
import useToaster from "@/hooks/useToaster";
import { TCartItem } from "@/types/TCart";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;
const currencySymbol = Config.getCurrencySymbol(currencyCode);

const OrderDetails = ({ order } : { order: TOrder }) => {
    const [setToasterMessage] = useToaster();
    const [doUpdateStatus] = useUpdateOrderStatusMutation();

    const handleCancelOrder = async () => {
        try {
            const result = await doUpdateStatus({ orderId: order.id, status: OrderStatusCode.CANCELLED }).unwrap();
            
            if (result && result.code === ApiResponse.success.code) {
                setToasterMessage("success", "Order cancelled successfully.", true);
            }
        } catch (error) {
            console.error("Failed to cancel order:", error);
            setToasterMessage("error", "Failed to cancel order. Please try again.", true);
        }
    }

    return (
        <div key={order.id} className="w-full gap-4 flex flex-col">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between w-full">
                        <div>
                            <div className="flex items-center gap-2">
                                <p>Order ID: {order.id}</p>
                                <Badge> {order.paymentMethod} </Badge>
                                {<OrderStatusBadge status={order.status} />}
                            </div>
                            <p>Total Amount: {currencySymbol} {order.totalAmount}</p>
                        </div>
                        {
                            order.status === OrderStatusCode.PENDING 
                            ? (<Button 
                                    variant="destructive"
                                    onClick={() => handleCancelOrder()}
                                >Cancel</Button>)
                            : (order.status !== OrderStatusCode.CANCELLED && order.status !== OrderStatusCode.DELIVERED && <Invoice order={order} />)
                        }
                    </CardTitle>
                </CardHeader>
            </Card>
            <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
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