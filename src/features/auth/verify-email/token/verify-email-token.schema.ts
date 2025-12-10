import { z } from "zod";

const verifyEmailTokenSchema = z.object({
  token: z.string().min(1, "Token is required").trim(),
});

export type VerifyEmailTokenSchemaType = z.infer<typeof verifyEmailTokenSchema>;

export default verifyEmailTokenSchema;
