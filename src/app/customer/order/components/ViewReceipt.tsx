import { Button } from "@/components/ui/button";
import { TOrder } from "@/types/TOrder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AppLogo from "@/components/AppLogo";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TCartItem } from "@/types/TCart";
import { useGetProductBySkuQuery } from "@/lib/redux/services/productsApi";
import { TCurrencyCode } from "@/types";
import Config from "@/utils/config";
import clsx from "clsx";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;
const currencySymbol = Config.getCurrencySymbol(currencyCode);

const ViewReceipt = ({ order, variant, className } : { order: TOrder; variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined; className?: string; }) => {

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={variant} className={clsx("flex items-center justify-center gap-2 w-full p-2 cursor-pointer text-sm", className)}>
                        View Receipt
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] sm:min-w-[700px] sm:min-h-[700px]">
                    <div className="flex items-center justify-between flex-col">
                        <DialogHeader className="w-full">
                            <div className="flex items-center justify-start sm:justify-between w-full flex-col sm:flex-row">
                                <div className="flex items-center gap-4 w-full">
                                    <AppLogo className="size-[40px] sm:size-[80px] fill-skin-primary stroke-skin-primary" />
                                    <div>
                                        <DialogTitle className="flex flex-col">
                                            <p className="text-xl sm:text-3xl font-bold">RECEIPT</p>
                                        </DialogTitle>
                                            <p className="text-sm sm:text-lg">{order.receipt.receiptNumber}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 mt-4 sm:mt-0">
                                <div className="flex items-start flex-col">
                                    <p className="mt-4">Billed To:</p>
                                    <p className="font-bold">{order.shippingDetails.receiverFirstName} {order.shippingDetails.receiverLastName}</p>
                                    <p>{order.shippingDetails.receiverEmailAddress}</p>
                                    <p>{order.shippingDetails.receiverContactNumber}</p>
                                </div>
                                <div className="flex items-start flex-col">
                                    <p className="mt-4">Address Type: {order.shippingDetails.shippingAddress.addressType}</p>
                                    <p>Shipping Address:</p>
                                    <p>{order.shippingDetails.shippingAddress.street}, {order.shippingDetails.shippingAddress.district}</p>
                                    <p>{order.shippingDetails.shippingAddress.city}, {order.shippingDetails.shippingAddress.zipCode}</p>
                                    <p>{order.shippingDetails.shippingAddress.country}</p>
                                </div>
                                <div className="flex items-start flex-col">
                                    <p className="mt-4">Payment Method: {order.paymentMethod}</p>
                                    <p>
                                        Receipt Date: {order.receipt.createdAt ? new Date(order.receipt.createdAt).toLocaleDateString() + " " + new Date(order.receipt.createdAt).toLocaleTimeString() : ''}
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex items-center justify-center overflow-x-auto w-[350px] sm:w-full mt-4 sm:mt-0">
                            <Table>
                                <TableCaption>A list of your items.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">SKU</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRows key={item.sku} item={item} />
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={5}>Total</TableCell>
                                        <TableCell className="text-right">{currencySymbol} {order.totalAmount}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end w-full py-4 sm:mt-0">
                            <p className="text-xl sm:text-3xl font-bold">Thank you!</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const TableRows = ({item} : {item: TCartItem}) => {
    const {data: Response} = useGetProductBySkuQuery(item.sku);
    const product = Response?.data;

    return (
        <TableRow>
            <TableCell className="font-medium">{product?.sku}</TableCell>
            <TableCell>{product?.name}</TableCell>
            <TableCell>{product?.description}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{product?.price}</TableCell>
            <TableCell className="text-right">{item.quantity * (product?.price ?? 0)}</TableCell>
        </TableRow>
    );
}

export default ViewReceipt;