import { verify, JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { makeError } from "../utils/makeError";
import { env } from "../config/env";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return next(makeError("NO_TOKEN", "Missing token", undefined, 401));
  }
  try {
    const token = h.slice(7);
    const payload = verify(token, env.SUPABASE_JWT_SECRET) as JwtPayload;
    (req as any).user = { id: payload.sub };
    return next();
  } catch (e) {
    return next(makeError("BAD_TOKEN", "Invalid token", e, 401));
  }
}
