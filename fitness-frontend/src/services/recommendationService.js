import api from "./api";
import { retryRequest } from "../utils/retryRequest";

const getUserId = () => {
    try {
        const saved = JSON.parse(localStorage.getItem("fitness_user") || "null");
        return saved?.id;
    } catch {
        return null;
    }
};

const mapToUi = (recommendation) => ({
    id: recommendation.id,
    title: recommendation.type || "Workout Recommendation",
    description: recommendation.recommendation || "",
    goal: "",
    difficulty: "",
    workout: (recommendation.improvements || []).join(", "),
    diet: (recommendation.suggestions || []).join(", "),
    durationMinutes: 0,
});

export const getRecommendations = async () => {
    const cacheKey = "recommendation_cache";
    try {
        const response = await retryRequest(() =>
            api.get(`/recommendation/user/${getUserId()}`)
        );
        const recommendations = response.data.map(mapToUi);

        localStorage.setItem(
            cacheKey,
            JSON.stringify(recommendations)
        );
        return recommendations;
    } catch {
        return JSON.parse(localStorage.getItem(cacheKey) || "[]");
    }
};

export const getRecommendationByGoal = async (_goal) => {
    const recommendations = await getRecommendations();
    return recommendations;
};