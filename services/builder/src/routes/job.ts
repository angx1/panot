import { Router } from "express";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";
import { actionRouter, buildAction } from "./actions";

const IdParam = z.object({ id: z.uuid() });

export const jobRouter = Router();

export async function getJobActions(jobId, auth) {
  const sb = getSbClient(auth);
  const { data, error } = await sb
    .from("actions")
    .select("*")
    .eq("job_id", jobId);
  if (error) throw error;
  return data;
}

export async function deleteJobIfDone(jobId, auth) {
  try {
    const sb = getSbClient(auth);
    const { data: actionList, error } = await sb
      .from("actions")
      .select("*")
      .eq("job_id", jobId);
    if (error) throw error;
    if (actionList.length == 0) {
      const { data, error } = await sb
        .from("jobs")
        .delete()
        .eq("job_id", jobId);
      if (error) throw error;
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    throw error;
  }
}

jobRouter.use("/:id/action", actionRouter);

jobRouter.get("/all", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const { data, error } = await sb.from("jobs").select(`
        *,
        actions (
          *
        )
      `);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

jobRouter.get("/:id", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const parsed = IdParam.safeParse(req.params);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid job id" });

    const { data, error } = await sb
      .from("jobs")
      .select("*")
      .eq("job_id", req.params.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

jobRouter.delete("/:id/deny", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const parsed = IdParam.safeParse(req.params);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid job id" });

    const { data, error } = await sb
      .from("jobs")
      .delete()
      .eq("job_id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

jobRouter.post("/:id/approve", async (req, res, next) => {
  try {
    const sb = getSbClient((req as any).userJwt);
    const parsed = IdParam.safeParse(req.params);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid job id" });

    const actions = await getJobActions(req.params.id, (req as any).userJwt);
    const actionPromises = actions.map(async (action) => {
      return await buildAction(action, (req as any).userJwt);
    });
    const actionResults = await Promise.all(actionPromises);

    // If any failed, return details (or at least log them)
    const failed = actionResults.filter((r) => !r.success);
    if (failed.length) {
      // Helpful while debugging:
      console.error("Action approval failed:", failed);

      return res.status(400).json({
        error: "Failed to approve actions",
        details: failed.map((f) => f.error).filter(Boolean),
      });
    }

    const successActions = actionResults.filter((action) => action.success);
    if (successActions.length !== actions.length) {
      return res.status(400).json({ error: "Failed to approve actions" });
    }
    const jobDeleted = await deleteJobIfDone(
      req.params.id,
      (req as any).userJwt
    );

    return res.json(jobDeleted);
  } catch (e) {
    next(e);
  }
});
