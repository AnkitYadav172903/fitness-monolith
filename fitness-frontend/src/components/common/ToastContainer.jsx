import { Toaster } from "react-hot-toast";

export default function ToastContainer() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#0F172A",
                    color: "#fff",
                    borderRadius: "16px",
                },
                success: {
                    iconTheme: {
                        primary: "#16A34A",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#DC2626",
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
}