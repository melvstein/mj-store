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

export type ShippingDetails = {
    receiverFirstName: string;
    receiverMiddleName?: string;
    receiverLastName: string;
    receiverContactNumber: string;
    shippingAddress: ShippingAddress;
    isDefault?: boolean;
}

export type ShippingAddress = {
    addressType: string;
    street: string;
    district: string;
    city: string;
    province: string;
    country: string;
    zipCode: number;
};

export type TCheckoutOrder = {
    customerId: string;
    paymentMethod: string;
    shippingDetails: ShippingDetails;
}