import { z } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ErrorShape } from "@panot/types";

export const validateBody =
  <S extends z.ZodTypeAny>(schema: S): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err: ErrorShape = {
        error: {
          code: "BAD_BODY",
          message: "Invalid payload",
          details: z.treeifyError(result.error),
        },
      };
      return next({ status: 400, body: err });
    }
    (req as any).validated = result.data;
    next();
  };
