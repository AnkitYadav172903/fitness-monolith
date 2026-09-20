import { Sparkles } from "lucide-react";

export default function RecommendationHero() {
    return (
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3">
                <Sparkles size={32} />
                <h1 className="text-3xl font-bold">
                    AI Fitness Recommendations
                </h1>
            </div>

            <p className="mt-4 text-lg opacity-90">
                Personalized workout and diet recommendations based on your fitness goal.
            </p>
        </div>
    );
}