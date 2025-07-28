import { z } from "zod";
import { ActionList } from "./action";

export const ExecuteRequest = ActionList;
export type ExecuteRequest = z.infer<typeof ExecuteRequest>;

export const ExecuteResponse = z.object({
  results: z.array(z.any()),
});
export type ExecuteResponse = z.infer<typeof ExecuteResponse>;
