import { z } from "zod";
import { UUID } from "../common/primitives";

export const EmailUpdate = z.object({ new_email: z.email() });
export type EmailUpdate = z.infer<typeof EmailUpdate>;

export const PasswordUpdate = z.object({ new_password: z.string().min(8) });
export type PasswordUpdate = z.infer<typeof PasswordUpdate>;
