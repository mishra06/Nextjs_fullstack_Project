import { z } from "zod";

export const usernameValidation = z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must not exceed 20 characters")
        .regex(/^\w+$/, "Username can only contain alphanumeric characters and underscores");



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase, one lowercase, one number, and one special character"),
})