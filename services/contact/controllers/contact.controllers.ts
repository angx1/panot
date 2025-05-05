import { Request, Response } from "express";
import { Contact } from "../types";
import {
  getUserContactsFromDB,
  getContactByIdFromDB,
  updateContactFromDB,
  deleteContactFromDB,
  createContactInDB,
} from "../servicies/contact.service";

export const getUserContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const notes = await getUserContactsFromDB(userId);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const contactId = req.params.id;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const contact = await getContactByIdFromDB(userId, contactId);
    res.status(200).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const contactId = req.params.id;
  const updates = req.body;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const contact = await updateContactFromDB(userId, contactId, updates);
    res.status(200).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const contactId = req.params.id;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    await deleteContactFromDB(userId, contactId);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const contactData = req.body;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const contact = await createContactInDB(userId, contactData as Contact);
    res.status(200).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
