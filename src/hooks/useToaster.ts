"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";

const useToaster = () => {
    // Show any stored message after reload
    useEffect(() => {
        const successMessage = localStorage.getItem("toaster_success_message");
        const errorMessage = localStorage.getItem("toaster_error_message");

        if (successMessage) {
            toast.success(successMessage);
            localStorage.removeItem("toaster_success_message");
        }

        if (errorMessage) {
            toast.error(errorMessage);
            localStorage.removeItem("toaster_error_message");
        }
    }, []);

    // Function to set a message and optionally reload the page
    const setToasterMessage = useCallback((type: "success" | "error" | "info" | "warning", message: string, reload = false) => {
        const showToast = () => {
            if (type === "success") toast.success(message);
            else if (type === "error") toast.error(message);
            else if (type === "info") toast.info(message);
            else toast.warning(message);
        };

        if (reload) {
            localStorage.setItem(`toaster_${type}_message`, message);
            window.location.reload();
        } else {
            showToast();
        }
    }, []);

    return [setToasterMessage] as const;
};

export default useToaster;
