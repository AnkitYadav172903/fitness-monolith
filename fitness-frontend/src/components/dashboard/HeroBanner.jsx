import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner({ user }) {
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
            ? "Good Afternoon"
            : "Good Evening";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
                opacity: { duration: 0.5 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-8 text-white"
        >
            <p className="opacity-90">{greeting}</p>

            <h1 className="text-4xl font-bold mt-2">
                {user?.fullName || "Fitness Warrior"} 💪
            </h1>

            <div className="flex items-center gap-3 mt-6">
                <Flame className="text-orange-300" />

                <span>Today's Goal : Burn 800 Calories</span>
            </div>
        </motion.div>
    );
}