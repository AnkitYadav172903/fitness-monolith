import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ToastContainer() {
    const [position, setPosition] = useState(() =>
        window.innerWidth >= 768 ? "top-right" : "bottom-center"
    );

    useEffect(() => {
        const handleResize = () =>
            setPosition(window.innerWidth >= 768 ? "top-right" : "bottom-center");

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Toaster
            position={position}
            gutter={8}
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
                duration: 3000,
                style: {
                    background: "var(--surface)",
                    color: "var(--text)",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 8px 24px -6px rgb(15 23 42 / 0.25)",
                    fontSize: "14px",
                    fontWeight: 500,
                },
                success: {
                    iconTheme: {
                        primary: "var(--success)",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "var(--danger)",
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
}