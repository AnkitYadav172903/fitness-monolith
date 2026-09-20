import { z } from "zod";

export const registerSchema = z
    .object({
        fullName: z.string().min(3, "Minimum 3 characters"),
        email: z.string().email("Enter a valid email"),
        password: z
            .string()
            .min(8, "Minimum 8 characters")
            .regex(/[A-Z]/, "One uppercase letter required")
            .regex(/[0-9]/, "One number required")
            .regex(/[!@#$%^&*]/, "One special character required"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });