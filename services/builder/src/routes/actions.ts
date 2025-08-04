import { Router } from "express";
import { ContactCreate, ContactUpdate } from "@panot/types";

import { getSbClient } from "../lib/supabase";
import { Action } from "@panot/types";
import { z } from "zod";

type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

export const actionRouter = Router();
/*
    ---- ACTIONS
  /job/:id/action/:id/approve

*/

export async function buildApprovedActionCreate(action: Action, auth) {
  if (action.type !== "create_contact")
    return {
      success: false,
      error: "Invalid action type: expected 'create_contact'",
    };
  try {
    const sb = getSbClient(auth);
    const payload = action.payload as ContactCreateShape;
    const contactChannels = payload.channels ?? [];
    delete payload.channels;

    const { data, error } = await sb
      .from("contacts")
      .insert({ ...payload })
      .select("*")
      .single();

    if (error) throw new Error(`Failed to create contact: ${error.message}`);
    const contactId = data.id;
    if (contactChannels.length > 0) {
      contactChannels.map(async (channel) => {
        const { data, error } = await sb
          .from("channels")
          .insert({ id: contactId, ...channel })
          .select("*")
          .single();
        if (error)
          throw new Error(
            `Failed to create channel for contact ${contactId}: ${error.message}`
          );
      });
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "Failed to create contact" };
  }
}

export async function buildApprovedActionUpdate(action: Action, auth) {
  if (action.type !== "update_contact")
    return {
      success: false,
      error: "Invalid action type: expected 'update_contact'",
    };
  try {
    const sb = getSbClient(auth);
    const payload = action.payload as ContactUpdateShape;
    const id = payload.id;
    const contactChannels = payload.channels ?? [];
    delete payload.channels;

    const { data, error } = await sb
      .from("contacts")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`Failed to update contact: ${error.message}`);

    if (contactChannels.length > 0) {
      contactChannels.map(async (channel) => {
        const { data, error } = await sb
          .from("channels")
          .insert({ id: id, ...channel })
          .select("*")
          .single();
        if (error)
          throw new Error(
            `Failed to update channel for contact ${id}: ${error.message}`
          );
      });
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "Failed to update contact" };
  }
}

export async function buildApprovedActionDelete(action: Action, auth) {
  if (action.type !== "delete_contact")
    return {
      success: false,
      error: "Invalid action type: expected 'delete_contact'",
    };
  try {
    const sb = getSbClient(auth);
    const id = action.payload.id;

    const { data, error } = await sb.from("contacts").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete contact: ${error.message}`);

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "Failed to delete contact" };
  }
}

actionRouter.get("/all", async (req, res, next) => {
  try {
    const auth = (req as any).userJwt;
    const sb = getSbClient(auth);

    const { data, error } = await sb.from("actions").select("*");
    if (error) throw new Error(`Failed to fetch actions: ${error.message}`);
    res.json({ success: true, data });
  } catch (e) {
    next(new Error(`Error fetching actions: ${e.message}`));
  }
});

actionRouter.get("/:id", async (req, res, next) => {
  try {
    const auth = (req as any).userJwt;
    const sb = getSbClient(auth);

    const { data, error } = await sb
      .from("actions")
      .select("*")
      .eq("action_id", req.params.id);
    if (error) throw new Error(`Failed to fetch action: ${error.message}`);
    res.json({ success: true, data });
  } catch (e) {
    next(new Error(`Error fetching action ${req.params.id}: ${e.message}`));
  }
});

actionRouter.delete("/:id/deny", async (req, res, next) => {
  try {
    const auth = (req as any).userJwt;
    const sb = getSbClient(auth);

    const { data, error } = await sb
      .from("actions")
      .delete()
      .eq("action_id", req.params.id);
    if (error) throw new Error(`Failed to deny action: ${error.message}`);
    res.json({ success: true, data });
  } catch (e) {
    next(new Error(`Error denying action ${req.params.id}: ${e.message}`));
  }
});

actionRouter.post("/:id/approve", async (req, res, next) => {
  try {
    const auth = (req as any).userJwt;
    const sb = getSbClient(auth);

    const { data: action, error } = await sb
      .from("actions")
      .select("*")
      .eq("action_id", req.params.id)
      .single();
    if (error)
      throw new Error(`Failed to fetch action for approval: ${error.message}`);

    if (!action) {
      return res.status(404).json({
        success: false,
        error: `Action with ID ${req.params.id} not found`,
      });
    }

    let result;
    if (action.type === "create_contact") {
      result = await buildApprovedActionCreate(action, auth);
    } else if (action.type === "update_contact") {
      result = await buildApprovedActionUpdate(action, auth);
    } else if (action.type === "delete_contact") {
      result = await buildApprovedActionDelete(action, auth);
    } else {
      return res
        .status(400)
        .json({ success: false, error: `Invalid action type: ${action.type}` });
    }
    if (result.success) {
      const { error: deleteError } = await sb
        .from("actions")
        .delete()
        .eq("action_id", req.params.id);
      if (deleteError)
        throw new Error(
          `Failed to delete approved action: ${deleteError.message}`
        );
    }
    res.json(result);
  } catch (e) {
    next(new Error(`Error approving action ${req.params.id}: ${e.message}`));
  }
});
