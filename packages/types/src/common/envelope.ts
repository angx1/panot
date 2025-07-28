import { z } from "zod";
import { IdempotencyKey } from "./primitives";
import { ActionList } from "../actions/action";

export const ManualEnvelope = z.object({
  mode: z.literal("manual"),
  idempotency_key: IdempotencyKey.optional(),
  actions: ActionList,
});

export const NlpEnvelope = z.object({
  mode: z.literal("nlp"),
  idempotency_key: IdempotencyKey.optional(),
  transcript: z.string(),
});

export const CommandEnvelope = z.union([ManualEnvelope, NlpEnvelope]);
export type CommandEnvelope = z.infer<typeof CommandEnvelope>;
