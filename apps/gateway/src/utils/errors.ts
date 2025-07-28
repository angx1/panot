import { Request, Response, NextFunction } from "express";
import { ErrorShape } from "@panot/types";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // pino-http adds req.log
  req.log?.error?.(err);

  if (err?.body?.error?.code) {
    const e: ErrorShape = err.body;
    return res.status(err.status ?? 500).json(e);
  }

  const fallback: ErrorShape = {
    error: { code: "INTERNAL_ERROR", message: "Unexpected error" },
  };
  return res.status(500).json(fallback);
}
