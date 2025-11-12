import OrderDetails from "@/app/customer/order/components/OrderDetails";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderStatusCode, OrderStatusText } from "@/enums/OrderStatus";
import { useUpdateOrderStatusMutation } from "@/lib/redux/services/ordersApi";
import { TOrder } from "@/types/TOrder";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toastMessage } from "@/lib/toaster";
import ApiResponse from "@/lib/apiResponse";

const ViewItems = ({ order }: { order: TOrder }) => {
    const [doUpdateStatus] = useUpdateOrderStatusMutation();
    const [status, setStatus] = useState<number>(order.status || OrderStatusCode.PENDING);

    const updateStatus = async (event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        
        try {
            const result = await doUpdateStatus({ orderId: order.id, status }).unwrap();
            
            if (result && result.code === ApiResponse.success.code) {
                toastMessage("success", "Order updated successfully.", true);
            }
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toastMessage("error", "Failed to update order. Please try again.", true);
        }
    }
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer text-sm">
                    View Items
                </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4 gap-4">
                <DrawerHeader>
                    <DrawerTitle>All Items</DrawerTitle>
                </DrawerHeader>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <Select value={status.toString()} onValueChange={(value) => setStatus(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Order Status</SelectLabel>
                                        <SelectItem value={OrderStatusCode.PENDING.toString()}>
                                            {OrderStatusText.PENDING}
                                        </SelectItem>
                                        <SelectItem value={OrderStatusCode.PROCESSING.toString()}>
                                            {OrderStatusText.PROCESSING}
                                        </SelectItem>
                                        <SelectItem value={OrderStatusCode.SHIPPED.toString()}>
                                            {OrderStatusText.SHIPPED}
                                        </SelectItem>
                                        <SelectItem value={OrderStatusCode.DELIVERED.toString()}>
                                            {OrderStatusText.DELIVERED}
                                        </SelectItem>
                                        <SelectItem value={OrderStatusCode.CANCELLED.toString()}>
                                            {OrderStatusText.CANCELLED}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button onClick={updateStatus}>Update Status</Button>
                        </div>
                    </CardHeader>
                </Card>
                <ScrollArea className="h-[600px]">
                    <OrderDetails order={order} />
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}

export default ViewItems;