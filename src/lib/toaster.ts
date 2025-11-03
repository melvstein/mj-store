import { toast } from "sonner";

export type ToasterType = "success" | "error" | "info" | "warning";

const STORAGE_PREFIX = "toaster_";

export const showStoredToasterMessages = () => {
    if (typeof window === "undefined") return; // SSR guard

    (["success", "error", "info", "warning"] as ToasterType[]).forEach((type) => {
        const key = `${STORAGE_PREFIX}${type}_message`;
        const msg = localStorage.getItem(key);
        if (!msg) return;

        // Invoke correct toast method
        toast[type](msg);
        localStorage.removeItem(key);
    });
};

export const setToasterMessage = (
    type: ToasterType,
    message: string,
    reload = false,
    options?: { delay?: number; useHardReload?: boolean }
    ) => {
    const run = () => {
        toast[type](message);
    };

    if (reload) {
        if (typeof window === "undefined") return;
        localStorage.setItem(`${STORAGE_PREFIX}${type}_message`, message);

        // Allow a soft refresh alternative
        if (options?.useHardReload) {
        window.location.reload();
        } else {
        // Hard reload fallback if no router available. Replace with router.refresh() where possible.
        window.location.href = window.location.href;
        }
    } else {
        if (options?.delay) {
            setTimeout(run, options.delay);
        } else {
            run();
        }
    }
};

export const toastMessage = (type: "success" | "error" | "info" | "warning", message: string, reload = false, reloadDelay = 1000) => {
    const showToast = () => {
        if (type === "success") toast.success(message);
        else if (type === "error") toast.error(message);
        else if (type === "info") toast.info(message);
        else toast.warning(message);
    };

    showToast();

    if (reload) {
        setTimeout(() => {
            window.location.reload();
        }, reloadDelay);
    }
};