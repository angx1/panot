import { Router } from "express";
import { PlannerRequest, PlannerResponse } from "@panot/types";
import { validateBody } from "../middlewares/validate";
import { planActions } from "../lib/plan";
import { makeError } from "../utils/makeError";
import { z } from "zod";

export const planRouter = Router();

planRouter.post(
  "/plan",
  validateBody(PlannerRequest),
  async (req, res, next) => {
    try {
      const { transcript } = (req as any).validated as PlannerRequest;
      const plan = await planActions(transcript);
      res.json(plan);
    } catch (err) {
      next(err);
    }
  }
);
