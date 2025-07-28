import { ManualEnvelope, ExecuteResponse } from "@panot/types";
import { callDbExecutor } from "../clients/db";
import { z } from "zod";

type ManualEnvelopeData = z.infer<typeof ManualEnvelope>;

export async function runManualFlow(
  userId: string,
  env: ManualEnvelopeData
): Promise<ExecuteResponse> {
  return callDbExecutor(userId, env.actions);
}
