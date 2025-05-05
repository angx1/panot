import { Router } from "express";
import {
  getUserContacts,
  getContactById,
  updateContact,
  deleteContact,
  createContact,
} from "../controllers/contact.controllers";

const contactRoutes = Router();
contactRoutes.get("/", getUserContacts);
contactRoutes.get("/:id", getContactById);
contactRoutes.put("/:id", updateContact);
contactRoutes.delete("/:id", deleteContact);
contactRoutes.post("/", createContact);

export default contactRoutes;
