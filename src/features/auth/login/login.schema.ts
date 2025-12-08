import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(255, "Email must be 255 characters or less")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormType = {
  email: "",
  password: "",
};
