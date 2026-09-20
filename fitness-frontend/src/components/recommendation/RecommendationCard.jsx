import { memo } from "react";
import {
    Flame,
    Dumbbell,
    Salad,
    Timer,
} from "lucide-react";

import {
    difficultyColor,
    goalColor,
} from "../../utils/recommendationColor";

function RecommendationCard({
                                recommendation,
                            }) {
    return (
        <div className="surface border border-theme rounded-3xl p-6 hover:scale-[1.02] transition">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-[color:var(--text)] text-2xl font-bold">
                        {recommendation.title}
                    </h2>

                    <p className="text-[color:var(--text-secondary)] mt-2">
                        {recommendation.description}
                    </p>
                </div>

                <Flame className="text-orange-400" />
            </div>

<div className="flex gap-3 mt-5 flex-wrap">
        {recommendation.goal && (
            <span
                className={`${goalColor(
                    recommendation.goal
                )} text-white px-3 py-1 rounded-full text-sm`}
            >
          {recommendation.goal.replace("_", " ")}
        </span>
        )}

                {recommendation.difficulty && (
                    <span
                        className={`${difficultyColor(
                            recommendation.difficulty
                        )} text-white px-3 py-1 rounded-full text-sm`}
                    >
          {recommendation.difficulty}
        </span>
                )}
        </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="surface-secondary border border-theme rounded-xl p-4">
                    <Dumbbell className="text-blue-400" />
                    <p className="text-[color:var(--text-secondary)] mt-2 text-sm">
                        Workout
                    </p>
                    <p className="text-[color:var(--text)] font-semibold">
                        {recommendation.workout}
                    </p>
                </div>

                <div className="surface-secondary border border-theme rounded-xl p-4">
                    <Salad className="text-green-400" />
                    <p className="text-[color:var(--text-secondary)] mt-2 text-sm">
                        Diet
                    </p>
                    <p className="text-[color:var(--text)] font-semibold">
                        {recommendation.diet}
                    </p>
                </div>
            </div>

            {recommendation.durationMinutes > 0 && (
                <div className="flex items-center gap-2 mt-6 text-cyan-400">
                    <Timer size={18} />
                    <span>{recommendation.durationMinutes} Minutes</span>
                </div>
            )}
        </div>
    );
}

export default memo(RecommendationCard);