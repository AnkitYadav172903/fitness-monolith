import { Flame } from "lucide-react";

export default function StreakCard({
                                       streak,
                                   }) {
    return (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-6 text-white">
            <Flame size={34} />

            <h1 className="text-5xl font-bold mt-6">
                {streak}
            </h1>

            <p className="mt-3">Day Workout Streak</p>
        </div>
    );
}