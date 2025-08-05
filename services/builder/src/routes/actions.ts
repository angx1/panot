import { Router } from "express";
import { ContactCreate, ContactUpdate, ActionList } from "@panot/types";
import { getUser } from "../utils/user";
import { getSbClient } from "../lib/supabase";
import { Action } from "@panot/types";
import { z } from "zod";
import { UUID } from "crypto";

type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

export const actionRouter = Router();

export async function buildAction(action: Action, auth) {
  if (action.type === "create_contact") {
    return buildApprovedActionCreate(action, auth);
  }
  if (action.type === "update_contact") {
    return buildApprovedActionUpdate(action, auth);
  }
  if (action.type === "delete_contact") {
    return buildApprovedActionDelete(action, auth);
  } else {
    return {
      success: false,
      error: `Invalid action type: ${(action as Action).type}`,
    };
  }
}

async function buildApprovedActionCreate(action: Action, auth) {
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

    const user = await getUser(auth);

    const { data, error } = await sb
      .from("contacts")
      .insert({ ...payload, owner_id: user.id })
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

async function buildApprovedActionUpdate(action: Action, auth) {
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

async function buildApprovedActionDelete(action: Action, auth) {
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

async function deleteJobIfLast(actionJobId: string, auth) {
  const sb = getSbClient(auth);
  const { data: actionList, error } = await sb
    .from("actions")
    .select("*")
    .eq("action_job_id", actionJobId);
  if (error) throw new Error(`Failed to fetch actions: ${error.message}`);
  if (actionList.length == 0) {
    const { data, error } = await sb
      .from("jobs")
      .delete()
      .eq("job_id", actionJobId);
  }
  if (error) throw new Error(`Failed to delete job: ${error.message}`);
}

async function deleteAction(actionId: string, auth) {
  const sb = getSbClient(auth);
  const { data, error } = await sb
    .from("actions")
    .delete()
    .eq("action_id", actionId);
  if (error) throw new Error(`Failed to delete action: ${error.message}`);
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
    const result = await buildAction(action, auth);
    const actionJobId = action.action_job_id;
    if (result.success) {
      await deleteAction(req.params.id, auth);
      await deleteJobIfLast(actionJobId, auth);
    }
    res.json(result);
  } catch (e) {
    next(new Error(`Error approving action ${req.params.id}: ${e.message}`));
  }
});
