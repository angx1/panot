import { z } from "zod";

export const ErrorShape = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});
export type ErrorShape = z.infer<typeof ErrorShape>;
