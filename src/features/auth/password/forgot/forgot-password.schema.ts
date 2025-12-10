import z from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(255, "Email must be 255 characters or less")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export default forgotPasswordSchema;
export const forgotPasswordDefaultValues: ForgotPasswordFormType = {
  email: "",
};
