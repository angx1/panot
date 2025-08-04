import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

export function getSbClient(userJwt: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `${userJwt}` } },
  });
}
