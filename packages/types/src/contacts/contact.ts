import { z } from "zod";
import { UUID, ChannelKind, Timestamp } from "../common/primitives";

export const ContactCard = z.object({
  first_name: z.string().min(1).describe("Primer nombre del contacto"),
  last_name: z.string().describe("Apellido del contacto"),
  company: z.string().describe("Empresa del contacto"),
  job_title: z.string().describe("Cargo o puesto del contacto"),
  department: z.string().describe("Departamento del contacto"),
  address: z.string().describe("Dirección del contacto"),
  birthday: z.iso.date().describe("Fecha de nacimiento en formato ISO"),
  notes: z.string().describe("Notas adicionales sobre el contacto"),
});

export const Channel = z.object({
  id: UUID.describe("Identificador único del canal"),
  kind: ChannelKind.describe("Tipo de canal (email, teléfono, etc.)"),
  label: z.string().describe("Etiqueta del canal"),
  value: z
    .string()
    .min(1)
    .describe("Valor del canal (ej: dirección de email, número de teléfono)"),
});

export const ContactCreate = ContactCard.extend({
  channels: z.array(Channel.omit({ id: true })),
  is_self: z.boolean().default(false),
});

export const ContactUpdate = ContactCard.partial().extend({
  id: UUID,
  channels: z.array(
    Channel.extend({
      _op: z.enum(["add", "update", "delete"]).default("update"),
    })
  ),
});

export const Contact = ContactCard.extend({
  id: UUID,
  owner_id: UUID,
  is_self: z.boolean(),
  created_at: Timestamp,
});

export type Contact = z.infer<typeof Contact>;
