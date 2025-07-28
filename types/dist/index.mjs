// src/common/primitives.ts
import { z } from "zod";
var UUID = z.uuid();
var Timestamp = z.iso.datetime();
var IdempotencyKey = z.string().min(10).max(100);
var ChannelKind = z.enum(["phone", "email", "url", "social"]);

// src/common/envelope.ts
import { z as z4 } from "zod";

// src/actions/action.ts
import { z as z3 } from "zod";

// src/contacts/contact.ts
import { z as z2 } from "zod";
var Channel = z2.object({
  id: UUID.optional(),
  kind: ChannelKind,
  label: z2.string().optional(),
  value: z2.string().min(1)
});
var ContactCard = z2.object({
  first_name: z2.string().min(1),
  last_name: z2.string().optional(),
  company: z2.string().optional(),
  job_title: z2.string().optional(),
  department: z2.string().optional(),
  address: z2.string().optional(),
  birthday: z2.iso.date().optional(),
  notes: z2.string().optional()
});
var ContactCreate = ContactCard.extend({
  channels: z2.array(Channel.omit({ id: true })).optional(),
  is_self: z2.boolean().default(false)
});
var ContactUpdate = ContactCard.partial().extend({
  id: UUID,
  channels: z2.array(
    Channel.extend({
      _op: z2.enum(["add", "update", "delete"]).default("update")
    })
  ).optional()
});
var Contact = ContactCard.extend({
  id: UUID,
  owner_id: UUID,
  is_self: z2.boolean(),
  created_at: Timestamp
});

// src/actions/action.ts
var CreateContactAction = z3.object({
  type: z3.literal("create_contact"),
  payload: ContactCreate
});
var UpdateContactAction = z3.object({
  type: z3.literal("update_contact"),
  payload: ContactUpdate
});
var DeleteContactAction = z3.object({
  type: z3.literal("delete_contact"),
  payload: z3.object({ id: UUID })
});
var Action = z3.union([
  CreateContactAction,
  UpdateContactAction,
  DeleteContactAction
  // add more here
]);
var ActionList = z3.array(Action).min(1);

// src/common/envelope.ts
var ManualEnvelope = z4.object({
  mode: z4.literal("manual"),
  idempotency_key: IdempotencyKey.optional(),
  actions: ActionList
});
var NlpEnvelope = z4.object({
  mode: z4.literal("nlp"),
  idempotency_key: IdempotencyKey.optional(),
  transcript: z4.string().min(5)
});
var CommandEnvelope = z4.union([ManualEnvelope, NlpEnvelope]);

// src/common/errors.ts
import { z as z5 } from "zod";
var ErrorShape = z5.object({
  error: z5.object({
    code: z5.string(),
    message: z5.string(),
    details: z5.any().optional()
  })
});
export {
  Action,
  ActionList,
  Channel,
  ChannelKind,
  CommandEnvelope,
  Contact,
  ContactCard,
  ContactCreate,
  ContactUpdate,
  CreateContactAction,
  DeleteContactAction,
  ErrorShape,
  IdempotencyKey,
  ManualEnvelope,
  NlpEnvelope,
  Timestamp,
  UUID,
  UpdateContactAction
};
