export type TCart = {
    id: string;
    customerId: string;
    items: TCartItem[] | [];
    createdAt?: Date;
    updatedAt?: Date;
};

export type TCartItem = {
    sku: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TCartItemWithPrice = TCartItem & {
    price?: number;
}

export type TUpdateCart = {
    customerId: string;
    action: "increase" | "decrease";
    items: TCartItem[];
}

export type TRemoveItemFromCartRequest = {
    customerId: string;
    sku: string;
}