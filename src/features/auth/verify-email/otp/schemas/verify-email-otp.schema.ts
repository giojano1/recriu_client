import { z } from "zod";
const verifyEmailOtpSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  otp: z
    .string()
    .min(6, "OTP must be 6 characters")
    .max(6, "OTP must be 6 characters")
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});
export type VerifyEmailOtpFormType = z.infer<typeof verifyEmailOtpSchema>;

export default verifyEmailOtpSchema;
