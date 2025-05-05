import { supabase } from "../supabaseClient";
import { Note } from "../types";

export const getUserNotesFromDB = async (userId: string) => {
  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getNoteByIdFromDB = async (userId: string, noteId: string) => {
  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("id", noteId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getNoteByTripIdFromDB = async (userId: string, tripId: string) => {
  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("viaje_id", tripId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getNoteByContactIdFromDB = async (
  userId: string,
  contactId: string
) => {
  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .eq("id", contactId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getNoteByTripAndContactIdFromDB = async (
  userId: string,
  tripId: string,
  contactId: string
) => {
  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("viaje_id", tripId)
    .eq("contacto_id", contactId)
    .eq("usuario_id", userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateNoteFromDB = async (
  userId: string,
  noteId: string,
  updates: any
) => {
  const { data, error } = await supabase
    .from("notas")
    .update(updates)
    .eq("id", noteId)
    .eq("usuario_id", userId)
    .select();

  if (error) throw new Error(error.message);
};

export const deleteNoteFromDB = async (userId: string, noteId: string) => {
  const { error } = await supabase
    .from("notas")
    .delete()
    .eq("id", noteId)
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
};

export const createNoteInDB = async (userId: string, noteData: Note) => {
  const { data: trip, error } = await supabase
    .from("notas")
    .insert([
      {
        viaje_id: noteData.tripId ?? null,
        contacto_id: noteData.contactId ?? null,
        contenido: noteData.content,
        usuario_id: userId,
      },
    ])
    .select();
};
