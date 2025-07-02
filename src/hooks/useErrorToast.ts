// hooks/useErrorToast.ts
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

export const useErrorToast = (message: string | null | undefined) => {
    useEffect(() => {
        if (message) {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
        });
        }
    }, [message]);
};
