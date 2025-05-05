import { describe } from "node:test";
import { supabase } from "../supabaseClient";
import { Contact } from "../types";

export const getUserContactsFromDB = async (userId: string) => {
  const { data, error } = await supabase
    .from("contactos")
    .select("*")
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getContactByIdFromDB = async (
  userId: string,
  contactId: string
) => {
  const { data, error } = await supabase
    .from("contactos")
    .select("*")
    .eq("id", contactId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateContactFromDB = async (
  userId: string,
  contactId: string,
  updates: any
) => {
  const { data, error } = await supabase
    .from("contactos")
    .update(updates)
    .eq("id", contactId)
    .eq("usuario_id", userId)
    .select();

  if (error) throw new Error(error.message);
};

export const deleteContactFromDB = async (
  userId: string,
  contactId: string
) => {
  const { error } = await supabase
    .from("contactos")
    .delete()
    .eq("id", contactId)
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
};

export const createContactInDB = async (
  userId: string,
  contactData: Contact
) => {
  const { data: trip, error } = await supabase
    .from("contactos")
    .insert([
      {
        usuario_id: userId,
        viaje_id: contactData.tripId ?? null,
        nombre: contactData.name,
        email: contactData.email ?? null,
        telefono: contactData.phone ?? null,
        descripcion: contactData.description ?? null,
      },
    ])
    .select();
};
