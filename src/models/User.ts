import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import type { TUser } from "@/types";

const UserSchema = new Schema<TUser>({
    role: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: { 
        type: String,
    },
    email: { 
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    encryptedPassword: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    image: {
        type: String,
        default: null,
    },
    provider: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.pre("save", function (next) {
    if (this.isModified("updatedAt") || this.isNew) {
        this.updatedAt = new Date();
    }

    next()
});

const User = models.User || model<TUser>("User", UserSchema);

export default User;