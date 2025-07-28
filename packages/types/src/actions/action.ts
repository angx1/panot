import { z } from "zod";
import { UUID } from "../common/primitives";
import { ContactCreate, ContactUpdate } from "../contacts/contact";

export const CreateContactAction = z.object({
  type: z.literal("create_contact"),
  payload: ContactCreate,
});

export const UpdateContactAction = z.object({
  type: z.literal("update_contact"),
  payload: ContactUpdate,
});

export const DeleteContactAction = z.object({
  type: z.literal("delete_contact"),
  payload: z.object({ id: UUID }),
});

export const Action = z.union([
  CreateContactAction,
  UpdateContactAction,
  DeleteContactAction,
  // add more here
]);

export type Action = z.infer<typeof Action>;

export const ActionList = z.array(Action).min(1);
