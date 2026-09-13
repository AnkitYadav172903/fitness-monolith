import { memo } from "react";
import { Target } from "lucide-react";
import { motion } from "framer-motion";

function GoalCard({ completed, target }) {
    const progress = Math.round((completed / target) * 100);

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <div className="flex justify-between">
                <h2 className="text-[color:var(--text)] font-semibold">
                    Workout Goal
                </h2>
                <Target className="text-blue-400" />
            </div>

            <h1 className="text-[color:var(--text)] text-4xl font-bold mt-5">
                {completed}/{target}
            </h1>

            <p className="text-blue-400 mt-2">{progress}% Completed</p>

            <div className="w-full surface-secondary rounded-full h-2 mt-5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-500 rounded-full h-2"
                />
            </div>
        </div>
    );
}

export default memo(GoalCard);