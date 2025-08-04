import { Request, Response, NextFunction } from "express";
import { ErrorShape } from "@panot/types";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  req.log?.error?.(err);

  if (err?.body?.error?.code) {
    return res.status(err.status ?? 500).json(err.body);
  }

  // Errors from Supabase come as { message, details, hint, code }
  if (err?.message) {
    const body: ErrorShape = {
      error: {
        code: "DB_ERROR",
        message: err.message,
        details: err.details ?? err,
      },
    };
    return res.status(500).json(body);
  }

  const fallback: ErrorShape = {
    error: { code: "INTERNAL_ERROR", message: "Unexpected error" },
  };
  res.status(500).json(fallback);
}
