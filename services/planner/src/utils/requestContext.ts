import { AsyncLocalStorage } from "node:async_hooks";

export type Ctx = { auth: string; requestId?: string };
export const requestContext = new AsyncLocalStorage<Ctx>();

export function getAuth() {
  return requestContext.getStore()?.auth ?? "";
}
