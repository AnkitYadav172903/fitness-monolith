import api from "./api";
import { retryRequest } from "../utils/retryRequest";

const FRONTEND_TO_BACKEND_TYPE = {
    GYM: "WEIGHT_TRAINING",
};

const BACKEND_TO_FRONTEND_TYPE = {
    WEIGHT_TRAINING: "GYM",
};

const mapToUi = (activity) => ({
    id: activity.id,
    activityType:
        BACKEND_TO_FRONTEND_TYPE[activity.type] || activity.type,
    caloriesBurned: activity.caloriesBurned,
    durationMinutes: activity.duration,
    activityDate: (activity.startTime || "").slice(0, 10),
});

const mapToApi = (data) => ({
    type: FRONTEND_TO_BACKEND_TYPE[data.activityType] || data.activityType,
    duration: Number(data.durationMinutes),
    caloriesBurned: Number(data.caloriesBurned),
    startTime: `${data.activityDate || new Date().toISOString().slice(0, 10)}T00:00:00`,
    additionalMetrics: null,
});

export const getActivities = async () => {
    try {
        const response = await retryRequest(() => api.get("/activities"));
        const activities = response.data.map(mapToUi);

        localStorage.setItem(
            "activities_cache",
            JSON.stringify(activities)
        );
        return activities;
    } catch {
        return JSON.parse(
            localStorage.getItem("activities_cache") || "[]"
        );
    }
};

export const createActivity = async (activityData) => {
    const response = await api.post("/activities", mapToApi(activityData));
    return mapToUi(response.data);
};