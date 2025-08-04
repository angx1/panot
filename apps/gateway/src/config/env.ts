import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().min(10),
  SVC_BUILDER_URL: z.url(),
  SVC_PLANNER_URL: z.url(),
  SVC_AUTH_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = EnvSchema.parse(process.env);
