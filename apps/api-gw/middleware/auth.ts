import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido o malformado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { sub: string };

    if (!payload?.sub) {
      res.status(403).json({ error: "Token inválido: sub no encontrado" });
      return;
    }

    (req as any).user = { id: payload.sub };

    next();
  } catch (err) {
    res.status(403).json({ error: "Token no válido" });
  }
};
