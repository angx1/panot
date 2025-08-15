import { z } from "zod";

export const env = {
  SUPABASE_URL: z.string().url().parse(process.env.EXPO_PUBLIC_SUPABASE_URL),
  SUPABASE_ANON_KEY: z
    .string()
    .min(30)
    .parse(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
} as const;
