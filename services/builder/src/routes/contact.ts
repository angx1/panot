import { Router } from "express";
import { ContactCreate, ContactUpdate, Contact, UUID } from "@panot/types";
import { validateBody } from "../utils/validate";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";

export const contactRouter = Router();
type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

const ContactIdsSchema = z.object({
  ids: z.array(UUID).min(1),
});

type ContactIdsShape = z.infer<typeof ContactIdsSchema>;

contactRouter.post("/", validateBody(ContactCreate), async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const payload = (req as any).validated as ContactCreateShape;
    const contactChannels = payload.channels ?? [];
    delete payload.channels;

    const { data, error } = await sb
      .from("contacts")
      .insert({ ...payload })
      .select("*")
      .single();

    if (error) throw error;
    const contactId = data.id;
    if (contactChannels.length > 0) {
      payload.channels.map(async (channel) => {
        const { data, error } = await sb
          .from("channels")
          .insert({ id: contactId, ...channel })
          .select("*")
          .single();
        if (error) throw error;
      });
    }
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

contactRouter.get("/all", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const { data, error } = await sb.from("contacts").select(`
        *,
        channels (
          *
        )
      `);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

contactRouter.patch(
  "/:id",
  validateBody(ContactUpdate),
  async (req, res, next) => {
    try {
      const sb = getSbClient((req as any).userJwt);
      const payload = (req as any).validated as ContactUpdateShape;
      const id = req.params.id;

      const contactChannels = payload.channels ?? [];
      delete payload.channels;

      const { data, error } = await sb
        .from("contacts")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;

      if (contactChannels.length > 0) {
        payload.channels.map(async (channel) => {
          const { data, error } = await sb
            .from("channels")
            .insert({ id: id, ...channel })
            .select("*")
            .single();
          if (error) throw error;
          res.json({ success: false });
        });
      }

      if (error) throw error;
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  }
);

contactRouter.delete("/:id", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const { error } = await sb
      .from("contacts")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

contactRouter.post(
  /*
    (Using POST because we need to send a potentially large array of IDs in the request body)
    {
      "ids": ["uuid1", "uuid2", "uuid3"]
    }
  */
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
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  }
);
