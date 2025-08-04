import { ErrorShape } from "@panot/types";

export function makeError(
  code: string,
  message: string,
  details?: unknown,
  status = 400
) {
  const body: ErrorShape = { error: { code, message, details } };
  return { status, body };
}
