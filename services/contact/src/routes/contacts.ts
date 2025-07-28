import { Router } from "express";
import { ContactCreate, ContactUpdate, Contact } from "@panot/types";
import { validateBody } from "../utils/validate";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";

export const contactsRouter = Router();
type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

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

// LIST
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
