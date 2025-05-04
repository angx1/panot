import { supabase } from "../supabaseClient";

export const getUserTrips = async (userId: string) => {
  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getTripById = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const tripId = (req as any).id;

  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .eq("id", tripId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTrip = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const tripId = (req as any).id;
  const updates = req.body;

  const { data, error } = await supabase
    .from("viajes")
    .update(updates)
    .eq("id", tripId)
    .eq("usuario_id", userId)
    .select();

  if (error) throw new Error(error.message);
};

export const deleteTrip = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const tripId = (req as any).id;

  const { error } = await supabase
    .from("viajes")
    .delete()
    .eq("id", tripId)
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
};
