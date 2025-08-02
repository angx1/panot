import { z } from "zod";
export const env = z
  .object({
    PORT: z.string().default("3006"),
    MODEL_KEY: z.string().min(20),
    MODEL: z.string(),
    GATEWAY_TO_DB_URL: z.url(),
  })
  .parse(process.env);
