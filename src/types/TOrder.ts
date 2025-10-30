import { TCartItem } from "./TCart";

export type TOrder = {
    id: string;
    orderNumber: number;
    customerId: string;
    paymentMethod: string;
    status: number;
    items: TCartItem[] | [];
    totalAmount: bigint;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TUpdateOrderStatus = {
    orderId: string;
    status: number;
};