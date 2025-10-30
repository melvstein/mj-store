import { TCartItem } from "./TCart";

export type TOrder = {
    id: string;
    customerId: string;
    paymentMethod: string;
    status: number;
    items: TCartItem[] | [];
    totalAmount: bigint;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TUpdateOrderStatus = {
    customerId: string;
    paymentMethod: string;
};