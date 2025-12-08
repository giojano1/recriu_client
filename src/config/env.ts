import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_URL: z.string().url("API_URL must be a valid URL"),
  API_KEY: z.string().min(1, "API_KEY is required"),
});

function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid server environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

export const env =
  typeof window === "undefined"
    ? validateServerEnv()
    : ({} as z.infer<typeof serverEnvSchema>);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
