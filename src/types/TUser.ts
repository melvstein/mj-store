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
    lastLoginAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
