import { Router } from "express";
import { ContactCreate, ContactUpdate, Contact, UUID } from "@panot/types";
import { validateBody } from "../utils/validate";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";

export const contactsRouter = Router();
type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

const ContactIdsSchema = z.object({
  ids: z.array(UUID).min(1),
});
type ContactIdsShape = z.infer<typeof ContactIdsSchema>;

// CREATE
contactsRouter.post(
  "/",
  validateBody(ContactCreate),
  async (req, res, next) => {
    try {
      const sb = getSbClient((req as any).userJwt);
      const payload = (req as any).validated as ContactCreateShape;

      const { data, error } = await sb
        .from("contacts")
        .insert({ ...payload })
        .select("*")
        .single();

      if (error) throw error;
      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }
);

// LIST ALL
contactsRouter.get("/", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const { data, error } = await sb.from("contacts").select("*");
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

// UPDATE
contactsRouter.patch(
  "/:id",
  validateBody(ContactUpdate),
  async (req, res, next) => {
    try {
      const sb = getSbClient((req as any).userJwt);
      const payload = (req as any).validated as ContactUpdateShape;
      const id = req.params.id;

      const { data, error } = await sb
        .from("contacts")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }
);

// DELETE
contactsRouter.delete("/:id", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const { error } = await sb
      .from("contacts")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET CONTACTS BY IDS
/*
(Using POST because we need to send a potentially large array of IDs in the request body)
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
*/
contactsRouter.post(
  "/list",
  validateBody(ContactIdsSchema),
  async (req, res, next) => {
    try {
      const sb = getSbClient((req as any).userJwt);
      const { ids } = (req as any).validated as ContactIdsShape;

      const { data, error } = await sb
        .from("contacts")
        .select("*")
        .in("id", ids);

      if (error) throw error;
      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }
);
