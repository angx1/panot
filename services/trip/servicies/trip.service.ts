// services/trip.service.ts
import { supabase } from "../supabaseClient";

export const getTripsFromDB = async (userId: string) => {
  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
  return data;
};
