import { Request, Response, NextFunction } from "express";
export function authForwarded(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: { code: "NO_TOKEN", message: "Missing token" } });
  }
  (req as any).userJwt = hdr.slice(7);
  next();
}
