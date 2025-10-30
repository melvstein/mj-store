import { Badge } from "@/components/ui/badge";
import { OrderStatusCode, OrderStatusText } from "@/enums/OrderStatus";
import clsx from "clsx";

const OrderStatusBadge = ({ status }: { status: number }) => {
    let statusText = "";
    let badgeColor = "";

    switch (status) {
        case OrderStatusCode.PENDING:
            statusText = OrderStatusText.PENDING;
            badgeColor = "yellow";
            break;
        case OrderStatusCode.PROCESSING:
            statusText = OrderStatusText.PROCESSING;
            badgeColor = "blue";
            break;
        case OrderStatusCode.SHIPPED:
            statusText = OrderStatusText.SHIPPED;
            badgeColor = "purple";
            break;
        case OrderStatusCode.DELIVERED:
            statusText = OrderStatusText.DELIVERED;
            badgeColor = "green";
            break;
        case OrderStatusCode.CANCELLED:
            statusText = OrderStatusText.CANCELLED;
            badgeColor = "red";
            break;
        default:
            statusText = "Unknown";
            badgeColor = "gray";
    }

    return (
        <Badge className={clsx(
            badgeColor === "yellow" && "bg-yellow-100 text-yellow-800",
            badgeColor === "blue" && "bg-blue-100 text-blue-800",
            badgeColor === "purple" && "bg-purple-100 text-purple-800",
            badgeColor === "green" && "bg-green-100 text-green-800",
            badgeColor === "red" && "bg-red-100 text-red-800",
            badgeColor === "gray" && "bg-gray-100 text-gray-800",
        )}>
            {statusText}
        </Badge>
    );
}

export default OrderStatusBadge;