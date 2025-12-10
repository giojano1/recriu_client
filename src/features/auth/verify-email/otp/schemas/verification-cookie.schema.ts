import z from "zod";

export const verificationCookieSchema = z.object({
  sessionId: z.uuid(),
  email: z.email(),
});
export type VerificationCookieData = z.infer<typeof verificationCookieSchema>;
