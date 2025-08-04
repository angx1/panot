import { Router } from "express";
import { ContactCreate, ContactUpdate, Contact, UUID } from "@panot/types";
import { validateBody } from "../utils/validate";
import { getSbClient } from "../lib/supabase";
import { z } from "zod";

import { contactRouter } from "./contact";
import { jobRouter } from "./job";

export const builderRouter = Router();
type ContactCreateShape = z.infer<typeof ContactCreate>;
type ContactUpdateShape = z.infer<typeof ContactUpdate>;

builderRouter.use("/contact", contactRouter);
builderRouter.use("/job", jobRouter);
