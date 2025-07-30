import { TUser } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (user: TUser) => {
    if (user?.firstName && user?.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }

    if (user?.username) {
        return user.username.substring(0, 2).toUpperCase();
    }
    
    return "MJ"; // Default fallback
};