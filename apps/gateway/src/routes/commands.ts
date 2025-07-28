import { Router } from "express";
import { CommandEnvelope, ManualEnvelope, NlpEnvelope } from "@panot/types";
import { validateBody } from "../middlewares/validate";
import { runManualFlow } from "../orchestrators/manualFlow";
import { runNlpFlow } from "../orchestrators/nlpFlow";
import { z } from "zod";

type NlpEnvelopeData = z.infer<typeof NlpEnvelope>;
type ManualEnvelopeData = z.infer<typeof ManualEnvelope>;

export const commandsRouter = Router();

commandsRouter.post(
  "/",
  validateBody(CommandEnvelope),
  async (req, res, next) => {
    try {
      const env = (req as any).validated as CommandEnvelope;
      const userId = (req as any).user.id;

      if (env.mode === "manual") {
        const result = await runManualFlow(userId, env as ManualEnvelopeData);
        return res.json({ ok: true, data: result });
      } else {
        const result = await runNlpFlow(userId, env as NlpEnvelopeData);
        return res.json({ ok: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  }
);
