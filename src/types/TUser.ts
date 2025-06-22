export type TUser = {
    id: string[];
    role: string;
    name?: string;
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
