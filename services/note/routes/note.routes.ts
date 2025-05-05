import { Router } from "express";
import {
  getNotes,
  getNoteById,
  getNoteByTripId,
  getNoteByContactId,
  getNoteByTripAndContactId,
  updateNote,
  deleteNote,
  createNote,
} from "../controllers/note.controllers";

const router = Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.get("/trip/:tripId", getNoteByTripId);
router.get("/contact/:contactId", getNoteByContactId);
router.get("/trip/:tripId/contact/:contactId", getNoteByTripAndContactId);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/", createNote);

export default router;
