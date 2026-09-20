import { memo } from "react";
import { Trophy } from "lucide-react";

function ProgressCard({ percentage }) {
    return (
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Weekly Progress</h2>
                <Trophy />
            </div>

            <h1 className="text-5xl font-bold mt-6">{percentage}%</h1>

            <div className="w-full bg-green-900 rounded-full h-3 mt-6">
                <div
                    className="bg-white h-3 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className="mt-4 opacity-90">
                Keep pushing towards your weekly goal.
            </p>
        </div>
    );
}

export default memo(ProgressCard);