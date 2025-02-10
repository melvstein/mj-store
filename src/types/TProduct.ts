export type TProduct = {
    _id: string[];
    tags: string[];
    sku: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    brand?: string;
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
};