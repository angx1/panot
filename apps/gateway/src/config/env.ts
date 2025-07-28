import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().min(10),
  SVC_DB_URL: z.url(),
  SVC_IA_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = EnvSchema.parse(process.env);
