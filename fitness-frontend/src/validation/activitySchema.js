import { z } from "zod";

export const activitySchema = z.object({
    activityType: z.string().min(1, "Select an activity type"),
    caloriesBurned: z.coerce
        .number()
        .min(1, "Calories required")
        .max(10000, "Calories too high"),
    durationMinutes: z.coerce
        .number()
        .min(1, "Minutes required")
        .max(1440, "Invalid duration"),
    activityDate: z.string().min(1, "Date is required"),
});