import { supabase } from "../supabaseClient";
import { Trip, Location } from "../types";

const getLocationIdFromDB = async (location: Location) => {
  const { data: existingLocation, error: locationError } = await supabase
    .from("localizaciones")
    .select("id")
    .eq("nombre", location.nombre)
    .single();

  let locationId;

  if (locationError && !existingLocation) {
    const { data: newLocation, error: createLocationError } = await supabase
      .from("localizaciones")
      .insert([
        {
          nombre: location.nombre,
          latitud: location.latitud,
          longitud: location.longitud,
        },
      ])
      .select()
      .single();

    if (createLocationError) {
      return { error: "Failed to create location" };
    }

    return newLocation.id;
  } else {
    return existingLocation.id;
  }
};

export const getUserTripsFromDB = async (userId: string) => {
  const { data, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getTripByIdFromDB = async (userId: string, tripId: string) => {
  const { data, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("id", tripId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTripFromDB = async (
  userId: string,
  tripId: string,
  updates: any
) => {
  const { data, error } = await supabase
    .from("viajes")
    .update(updates)
    .eq("id", tripId)
    .eq("usuario_id", userId)
    .select();

  if (error) throw new Error(error.message);
};

export const deleteTripFromDB = async (userId: string, tripId: string) => {
  const { error } = await supabase
    .from("viajes")
    .delete()
    .eq("id", tripId)
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
};

export const createTripInDB = async (userId: string, tripData: Trip) => {
  const locationId = await getLocationIdFromDB(tripData.localizaciones);

  const { data: trip, error } = await supabase
    .from("viajes")
    .insert([
      {
        nombre: tripData.name,
        fecha_inicio: tripData.startDate,
        fecha_fin: tripData.endDate,
        descripcion: tripData.description,
        usuario_id: userId,
        localizacion_id: locationId,
      },
    ])
    .select();
};
