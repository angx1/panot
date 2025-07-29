import { z } from "zod";

export const env = z
  .object({
    PORT: z.string().default("3004"),
    SUPABASE_URL: z.url(),
    SERVICE_ROLE_KEY: z.string().min(30),
  })
  .parse(process.env);
