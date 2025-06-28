export type TProduct = {
    id: string[];
    tags: string[];
    sku: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    brand?: string;
    images: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};