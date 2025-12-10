import { z } from "zod";
export const resendOtpSchema = z
  .email("Invalid email address")
  .min(1, "Email is required")
  .toLowerCase()
  .trim();

export type ResendOtpSchemaType = z.infer<typeof resendOtpSchema>;
