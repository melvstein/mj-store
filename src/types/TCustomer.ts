export type TCustomer = {
    id: string;
    provider: string;
    username: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    contactNumber: string;
    profileImageUrl?: string;
    address: TAddress;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TAddress = {
    addressType: string;
    street: string;
    district: string;
    city: string;
    province: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export type TUpdateCustomer = {
    username: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    contactNumber: string;
    profileImageUrl?: string;
    address?: TAddress;
    isActive: boolean;
    isVerified: boolean;
}