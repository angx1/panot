import { Request, Response } from "express";
import { Note } from "../types";
import {
  getUserNotesFromDB,
  getNoteByIdFromDB,
  getNoteByTripIdFromDB,
  getNoteByContactIdFromDB,
  getNoteByTripAndContactIdFromDB,
  updateNoteFromDB,
  deleteNoteFromDB,
  createNoteInDB,
} from "../servicies/note.service";

export const getUserNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const notes = await getUserNotesFromDB(userId);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const noteId = req.params.id;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const note = await getNoteByIdFromDB(userId, noteId);
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteByTripId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const tripId = req.params.tripId;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const note = await getNoteByTripIdFromDB(userId, tripId);
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteByContactId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const contactId = req.params.contactId;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const note = await getNoteByContactIdFromDB(userId, contactId);
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNoteByTripAndContactId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const tripId = req.params.tripId;
  const contactId = req.params.contactId;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const note = await getNoteByTripAndContactIdFromDB(
      userId,
      tripId,
      contactId
    );
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const noteId = req.params.id;
  const updates = req.body;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    await updateNoteFromDB(userId, noteId, updates);
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const noteId = req.params.id;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    await deleteNoteFromDB(userId, noteId);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"] as string;
  const noteData = req.body;

  if (!noteData) {
    res.status(400).json({ error: "Note information is missing" });
    return;
  }

  try {
    await createNoteInDB(userId, noteData as Note);
    res.status(200).json({ message: "Note created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
