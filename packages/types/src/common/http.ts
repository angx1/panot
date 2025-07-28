import { z } from "zod";

export const ErrorShape = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});
export type ErrorShape = z.infer<typeof ErrorShape>;

export const ResultShape = z.object({
  ok: z.boolean().default(true),
  data: z.any().optional(),
});
export type ResultShape = z.infer<typeof ResultShape>;
