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

const GOAL_BY_TYPE = {
    RUNNING: "ENDURANCE",
    CYCLING: "ENDURANCE",
    SWIMMING: "ENDURANCE",
    CARDIO: "ENDURANCE",
    WEIGHT_TRAINING: "MUSCLE_GAIN",
    HIIT: "MUSCLE_GAIN",
    YOGA: "WEIGHT_LOSS",
    STRETCHING: "WEIGHT_LOSS",
    WALKING: "WEIGHT_LOSS",
};

const DIFFICULTY_BY_TYPE = {
    RUNNING: "ADVANCED",
    HIIT: "ADVANCED",
    SWIMMING: "ADVANCED",
    WEIGHT_TRAINING: "INTERMEDIATE",
    CYCLING: "INTERMEDIATE",
    CARDIO: "INTERMEDIATE",
    YOGA: "BEGINNER",
    STRETCHING: "BEGINNER",
    WALKING: "BEGINNER",
};

const titleFromType = (type) => {
    if (!type) return "Workout Recommendation";
    return type
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

const mapToUi = (recommendation) => {
    const type = recommendation.type || "OTHER";

    return {
        id: recommendation.id,
        title: titleFromType(type),
        description: recommendation.recommendation || "",
        goal: GOAL_BY_TYPE[type] || "WEIGHT_LOSS",
        difficulty: DIFFICULTY_BY_TYPE[type] || "BEGINNER",
        workout: (recommendation.improvements || []).join(", "),
        diet: (recommendation.suggestions || []).join(", "),
        durationMinutes: recommendation.durationMinutes || 0,
    };
};

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
        try {
            return JSON.parse(localStorage.getItem(cacheKey) || "[]");
        } catch {
            return [];
        }
    }
};

export const getRecommendationByGoal = async (goal) => {
    const recommendations = await getRecommendations();
    if (!goal || goal === "ALL") return recommendations;
    return recommendations.filter((recommendation) => recommendation.goal === goal);
};