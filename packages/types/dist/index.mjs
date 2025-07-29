// src/common/primitives.ts
import { z } from "zod";
var UUID = z.uuid();
var Timestamp = z.iso.datetime();
var IdempotencyKey = z.string().min(10).max(100);
var ChannelKind = z.enum(["phone", "email", "url", "social"]);

// src/common/http.ts
import { z as z2 } from "zod";
var ErrorShape = z2.object({
  error: z2.object({
    code: z2.string(),
    message: z2.string(),
    details: z2.any().optional()
  })
});
var ResultShape = z2.object({
  ok: z2.boolean().default(true),
  data: z2.any().optional()
});

// src/common/envelope.ts
import { z as z5 } from "zod";

// src/actions/action.ts
import { z as z4 } from "zod";

// src/contacts/contact.ts
import { z as z3 } from "zod";
var Channel = z3.object({
  id: UUID.optional(),
  kind: ChannelKind,
  label: z3.string().optional(),
  value: z3.string().min(1)
});
var ContactCard = z3.object({
  first_name: z3.string().min(1),
  last_name: z3.string().optional(),
  company: z3.string().optional(),
  job_title: z3.string().optional(),
  department: z3.string().optional(),
  address: z3.string().optional(),
  birthday: z3.iso.date().optional(),
  notes: z3.string().optional()
});
var ContactCreate = ContactCard.extend({
  channels: z3.array(Channel.omit({ id: true })).optional(),
  is_self: z3.boolean().default(false)
});
var ContactUpdate = ContactCard.partial().extend({
  id: UUID,
  channels: z3.array(
    Channel.extend({
      _op: z3.enum(["add", "update", "delete"]).default("update")
    })
  ).optional()
});
var Contact = ContactCard.extend({
  id: UUID,
  owner_id: UUID,
  is_self: z3.boolean(),
  created_at: Timestamp
});

// src/actions/action.ts
var CreateContactAction = z4.object({
  type: z4.literal("create_contact"),
  payload: ContactCreate
});
var UpdateContactAction = z4.object({
  type: z4.literal("update_contact"),
  payload: ContactUpdate
});
var DeleteContactAction = z4.object({
  type: z4.literal("delete_contact"),
  payload: z4.object({ id: UUID })
});
var Action = z4.union([
  CreateContactAction,
  UpdateContactAction,
  DeleteContactAction
  // add more here
]);
var ActionList = z4.array(Action).min(1);

// src/common/envelope.ts
var ManualEnvelope = z5.object({
  mode: z5.literal("manual"),
  idempotency_key: IdempotencyKey.optional(),
  actions: ActionList
});
var NlpEnvelope = z5.object({
  mode: z5.literal("nlp"),
  idempotency_key: IdempotencyKey.optional(),
  transcript: z5.string()
});
var CommandEnvelope = z5.union([ManualEnvelope, NlpEnvelope]);

// src/actions/executor.ts
import { z as z6 } from "zod";
var ExecuteRequest = ActionList;
var ExecuteResponse = z6.object({
  results: z6.array(z6.any())
});

// src/actions/planner.ts
import { z as z7 } from "zod";
var PlannerRequest = z7.object({
  transcript: z7.string().min(5)
});
var PlannerResponse = z7.object({
  actions: ActionList
});

// src/account/account.ts
import { z as z8 } from "zod";
var EmailUpdate = z8.object({ new_email: z8.email() });
var PasswordUpdate = z8.object({ new_password: z8.string().min(8) });
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
  EmailUpdate,
  ErrorShape,
  ExecuteRequest,
  ExecuteResponse,
  IdempotencyKey,
  ManualEnvelope,
  NlpEnvelope,
  PasswordUpdate,
  PlannerRequest,
  PlannerResponse,
  ResultShape,
  Timestamp,
  UUID,
  UpdateContactAction
};
