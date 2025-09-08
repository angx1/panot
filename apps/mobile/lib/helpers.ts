import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export const signOutAction = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }
  router.replace("/");
  return {
    error: null,
    success: true,
  };
};
