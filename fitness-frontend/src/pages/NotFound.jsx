import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import AnimatedPage from "../components/common/AnimatedPage";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[color:var(--background)] flex flex-col justify-center items-center text-center px-6">
            <AnimatedPage>
                <h1 className="text-8xl text-blue-500 font-black">
                    404
                </h1>

                <h2 className="text-[color:var(--text)] text-3xl font-bold mt-6">
                    Page Not Found
                </h2>

                <p className="text-[color:var(--text-secondary)] mt-4 max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link
                    to="/dashboard"
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl flex gap-2 items-center"
                >
                    <Home size={18} />
                    Back to Dashboard
                </Link>
            </AnimatedPage>
        </div>
    );
}