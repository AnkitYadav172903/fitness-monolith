import { z } from "zod";

export const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Minimum 8 characters")
            .regex(/[A-Z]/, "One uppercase letter required")
            .regex(/[0-9]/, "One number required")
            .regex(/[!@#$%^&*]/, "One special character required"),
        confirm: z.string().min(1, "Confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirm, {
        path: ["confirm"],
        message: "Passwords do not match",
    });