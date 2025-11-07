import { TCartItem } from "./TCart";

export type TOrder = {
    id: string;
    orderNumber: number;
    customerId: string;
    paymentMethod: string;
    status: number;
    items: TCartItem[] | [];
    totalAmount: bigint;
    invoice: TInvoice;
    receipt: TReceipt;
    shippingDetails: ShippingDetails;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TInvoice = {
    invoiceNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TReceipt = {
    receiptNumber: string;
    remarks?: string;
    transactionId?: string;
    refundedAt?: Date;
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
    receiverEmailAddress: string;
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