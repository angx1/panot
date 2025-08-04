import { Router } from "express";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";

import { actionRouter } from "./actions";

const IdParam = z.object({ id: z.uuid() });

export const jobRouter = Router();

jobRouter.use("/:id/action", actionRouter);

/* 
    ---- JOBS
  /job/:id/approve

*/

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
