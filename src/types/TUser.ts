export type TUser = {
    _id: string[];
    role: string;
    name: string;
    username: string;
    email: string;
    password: string;
    encryptedPassword: string;
    contactNumber: string;
    address: string;
    image: string;
    provider: string;
    createdAt?: Date;
    updatedAt?: Date;
};