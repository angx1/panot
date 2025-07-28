import { ExecuteRequest, ExecuteResponse } from "@panot/types";
import { env } from "../config/env";
import { postJSON } from "../utils/http";

export async function callDbExecutor(
  userId: string,
  actions: ExecuteRequest
): Promise<ExecuteResponse> {
  return postJSON<ExecuteRequest, ExecuteResponse>(
    `${env.SVC_DB_URL}/execute`,
    actions,
    {
      "x-user-id": userId,
    }
  );
}
