// hooks/useToastMessage.ts
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Bounce, toast, TypeOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

export const useToastMessage = (
  message: string | null | undefined,
  type: ToastType = "info"
) => {
    const { theme } = useTheme();

  useEffect(() => {
    if (message) {
      toast(message, {
        type, // dynamic toast type
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme,
        transition: Bounce,
      });
    }
  }, [message, type]);
};
