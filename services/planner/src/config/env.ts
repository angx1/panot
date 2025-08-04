import { z } from "zod";
export const env = z
  .object({
    PORT: z.string().default("3006"),
    MODEL_KEY: z.string().min(20),
    MODEL: z.string(),
    GATEWAY_TO_BUILDER_URL: z.url(),
    SUPABASE_URL: z.url(),
    SUPABASE_ANON_KEY: z.string(),
  })
  .parse(process.env);
