import { z } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { makeError } from "../utils/makeError";

export const validateBody =
  <S extends z.ZodTypeAny>(schema: S): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        makeError("BAD_BODY", "Invalid payload", result.error.flatten(), 400)
      );
    }
    (req as any).validated = result.data as z.infer<S>;
    next();
  };
