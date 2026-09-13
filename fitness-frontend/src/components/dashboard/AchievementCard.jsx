import { Award } from "lucide-react";

export default function AchievementCard({
                                            workouts,
                                        }) {
    const level =
        workouts > 20
            ? "Gold"
            : workouts > 10
            ? "Silver"
            : "Bronze";

    return (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-6 text-white">
            <Award size={36} />

            <h2 className="text-2xl font-bold mt-5">
                {level} Athlete
            </h2>

            <p className="mt-3">
                {workouts} Workouts Completed
            </p>

            <p className="mt-2 opacity-90">
                Keep exercising to unlock the next badge.
            </p>
        </div>
    );
}