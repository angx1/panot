import { z } from "zod";
import { UUID } from "../common/primitives";
import { ContactCreate, ContactUpdate } from "../contacts/contact";

export const CreateContactAction = z.object({
  type: z.literal("create_contact").describe("Tipo de acción: crear contacto"),
  payload: ContactCreate.describe("Datos para crear un nuevo contacto"),
});

export const UpdateContactAction = z.object({
  type: z
    .literal("update_contact")
    .describe("Tipo de acción: actualizar contacto"),
  payload: ContactUpdate.describe(
    "Datos para actualizar un contacto existente"
  ),
});

export const DeleteContactAction = z.object({
  type: z
    .literal("delete_contact")
    .describe("Tipo de acción: eliminar contacto"),
  payload: z.object({ id: UUID.describe("ID del contacto a eliminar") }),
});

export const Action = z.union([
  CreateContactAction,
  UpdateContactAction,
  DeleteContactAction,
]);

export type Action = z.infer<typeof Action>;

export const ActionList = z.array(Action).min(1);
