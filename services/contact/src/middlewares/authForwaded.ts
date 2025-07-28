import { Request, Response, NextFunction } from "express";

export function authForwarded(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { code: "NO_TOKEN", message: "Missing forwarded token" },
    });
  }
  (req as any).userJwt = auth.slice(7);
  (req as any).userId = req.headers["x-user-id"];
  next();
}
