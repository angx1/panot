import {
  NlpEnvelope,
  PlannerResponse,
  ExecuteResponse,
  ActionList,
} from "@panot/types";
import { callPlanner } from "../clients/ai";
import { callDbExecutor } from "../clients/db";
import { z } from "zod";

type NlpEnvelopeData = z.infer<typeof NlpEnvelope>;

export async function runNlpFlow(
  userId: string,
  env: NlpEnvelopeData
): Promise<ExecuteResponse> {
  const plan: PlannerResponse = await callPlanner(userId, env.transcript);
  const actions = ActionList.parse(plan.actions);
  return callDbExecutor(userId, actions);
}
