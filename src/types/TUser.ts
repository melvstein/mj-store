export type TUser = {
    id: string;
    role: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    contactNumber?: string;
    address?: string;
    profileImageUrl: string;
    isActive: boolean;
    isVerified?: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TUpdateUser = {
    role: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    username: string;
    email: string;
}