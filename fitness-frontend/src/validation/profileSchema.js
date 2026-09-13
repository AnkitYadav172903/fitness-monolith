import { z } from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(3, "Minimum 3 characters"),
    email: z.string().email("Enter a valid email"),
    height: z.coerce
        .number()
        .min(100, "Minimum 100 cm")
        .max(250, "Maximum 250 cm"),
    weight: z.coerce
        .number()
        .min(30, "Minimum 30 kg")
        .max(300, "Maximum 300 kg"),
    bio: z.string().max(150, "Maximum 150 characters").optional(),
});