// ToastErrorBox.jsx
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

const ErrorMessage = ({ message = "Something went wrong!", duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeout);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-red-100 text-red-800 border border-red-300 shadow-lg rounded-xl p-4 flex items-start gap-3 animate-slide-up-fade">
        <AlertTriangle className="w-6 h-6 mt-0.5 text-red-500" />
        <div className="flex-1">
            <h4 className="font-semibold text-base">Error</h4>
            <p className="text-sm mt-1">{message}</p>
        </div>
        <button
            onClick={() => setVisible(false)}
            className="text-red-400 hover:text-red-600 transition"
            aria-label="Close"
        >
            <X className="w-4 h-4" />
        </button>
        </div>
    );
};

export default ErrorMessage;
