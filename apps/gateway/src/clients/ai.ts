import { PlannerRequest, PlannerResponse } from "@panot/types";
import { env } from "../config/env";
import { postJSON } from "../utils/http";

export async function callPlanner(
  userId: string,
  transcript: string
): Promise<PlannerResponse> {
  const body: PlannerRequest = { transcript };
  return postJSON<PlannerRequest, PlannerResponse>(
    `${env.SVC_IA_URL}/plan`,
    body,
    {
      "x-user-id": userId,
    }
  );
}
