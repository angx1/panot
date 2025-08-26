import { supabase } from "@/lib/supabase";

export const signOutAction = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }
  return {
    error: null,
    success: true,
  };
};
