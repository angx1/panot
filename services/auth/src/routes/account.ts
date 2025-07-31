import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { EmailUpdate, PasswordUpdate } from "@panot/types";
import { validateBody } from "../utils/validate";
import { makeError } from "../utils/makeError";

const supabase_admin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);
export const accountRouter = Router();

// GET USER'S INFO
accountRouter.get("/", async (req, res, next) => {
  try {
    const { sub: userId } = JSON.parse(
      Buffer.from((req as any).userJwt.split(".")[1], "base64").toString()
    );
    const { data: user, error } = await supabase_admin.auth.admin.getUserById(
      userId
    );
    if (error) throw error;
    res.json(user);
  } catch (e) {
    next(makeError("GET_USER_FAIL", "Could not get user info", e, 500));
  }
});

// DELETE /v1/account/termiante
accountRouter.delete("/terminate", async (req, res, next) => {
  try {
    const { sub: userId } = JSON.parse(
      Buffer.from((req as any).userJwt.split(".")[1], "base64").toString()
    );
    const { error } = await supabase_admin.auth.admin.deleteUser(userId);
    if (error) throw error;
    res.status(204).end();
  } catch (e) {
    next(makeError("ACCOUNT_DELETE_FAIL", "Delete failed", e, 500));
  }
});

// PATCH /v1/account/email
accountRouter.patch(
  "/email",
  validateBody(EmailUpdate),
  async (req, res, next) => {
    try {
      const { sub: userId } = JSON.parse(
        Buffer.from((req as any).userJwt.split(".")[1], "base64").toString()
      );
      const { new_email } = (req as any).validated as EmailUpdate;
      const { error } = await supabase_admin.auth.admin.updateUserById(userId, {
        email: new_email,
      });
      if (error) throw error;
      res.json({ ok: true });
    } catch (e) {
      next(makeError("EMAIL_UPDATE_FAIL", "Email update failed", e, 500));
    }
  }
);

// PATCH /v1/account/password
accountRouter.patch(
  "/password",
  validateBody(PasswordUpdate),
  async (req, res, next) => {
    try {
      const { sub: userId } = JSON.parse(
        Buffer.from((req as any).userJwt.split(".")[1], "base64").toString()
      );
      const { new_password } = (req as any).validated as PasswordUpdate;
      const { error } = await supabase_admin.auth.admin.updateUserById(userId, {
        password: new_password,
      });
      if (error) throw error;
      res.json({ ok: true });
    } catch (e) {
      next(makeError("PWD_UPDATE_FAIL", "Password update failed", e, 500));
    }
  }
);

// POST /v1/account/revoke-sessions
accountRouter.post("/revoke-sessions", async (req, res, next) => {
  try {
    const { sub: userId } = JSON.parse(
      Buffer.from((req as any).userJwt.split(".")[1], "base64").toString()
    );
    const { error } = await supabase_admin.auth.admin.signOut(userId);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    next(makeError("SESSION_REVOKE_FAIL", "Could not revoke sessions", e, 500));
  }
});
