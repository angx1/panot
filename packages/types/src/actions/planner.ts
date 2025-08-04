import { z } from "zod";
import { ActionList } from "../actions/action";

export const PlannerRequest = z.object({
  transcript: z.string().min(5),
});
export type PlannerRequest = z.infer<typeof PlannerRequest>;

export const PlannerResponse = z.object({
  actions: ActionList.describe(
    "Lista de acciones a realizar basadas en la transcripción"
  ),
  transcript: z.string().min(5),
});
export type PlannerResponse = z.infer<typeof PlannerResponse>;
