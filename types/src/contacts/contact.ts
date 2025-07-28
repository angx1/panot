import { z } from "zod";
import { UUID, ChannelKind, Timestamp } from "../common/primitives";

export const Channel = z.object({
  id: UUID.optional(),
  kind: ChannelKind,
  label: z.string().optional(),
  value: z.string().min(1),
});

export const ContactCard = z.object({
  first_name: z.string().min(1),
  last_name: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  birthday: z.iso.date().optional(),
  notes: z.string().optional(),
});

export const ContactCreate = ContactCard.extend({
  channels: z.array(Channel.omit({ id: true })).optional(),
  is_self: z.boolean().default(false),
});

export const ContactUpdate = ContactCard.partial().extend({
  id: UUID,
  channels: z
    .array(
      Channel.extend({
        _op: z.enum(["add", "update", "delete"]).default("update"),
      })
    )
    .optional(),
});

export const Contact = ContactCard.extend({
  id: UUID,
  owner_id: UUID,
  is_self: z.boolean(),
  created_at: Timestamp,
});

export type Contact = z.infer<typeof Contact>;
