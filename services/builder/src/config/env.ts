import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("3002"),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(10),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = EnvSchema.parse(process.env);
