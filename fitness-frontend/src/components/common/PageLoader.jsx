import { Dumbbell } from "lucide-react";

export default function PageLoader() {
    return (
        <div className="h-screen flex justify-center items-center bg-[color:var(--background)]">
            <div className="flex flex-col items-center gap-5">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

                <div className="flex items-center gap-2 text-[color:var(--text)]">
                    <Dumbbell className="text-blue-500" />
                    <h2>Loading Fitness Monolith...</h2>
                </div>
            </div>
        </div>
    );
}