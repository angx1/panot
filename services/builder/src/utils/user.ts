import { getSbClient } from "../lib/supabase";

export async function getUser(auth) {
  const sb = await getSbClient(auth);
  const {
    data: { user },
    error: userError,
  } = await sb.auth.getUser();
  if (userError) throw new Error(`Failed to get user: ${userError.message}`);
  return user;
}
