"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Action: () => Action,
  ActionList: () => ActionList,
  Channel: () => Channel,
  ChannelKind: () => ChannelKind,
  CommandEnvelope: () => CommandEnvelope,
  Contact: () => Contact,
  ContactCard: () => ContactCard,
  ContactCreate: () => ContactCreate,
  ContactUpdate: () => ContactUpdate,
  CreateContactAction: () => CreateContactAction,
  DeleteContactAction: () => DeleteContactAction,
  EmailUpdate: () => EmailUpdate,
  ErrorShape: () => ErrorShape,
  ExecuteRequest: () => ExecuteRequest,
  ExecuteResponse: () => ExecuteResponse,
  IdempotencyKey: () => IdempotencyKey,
  ManualEnvelope: () => ManualEnvelope,
  NlpEnvelope: () => NlpEnvelope,
  PasswordUpdate: () => PasswordUpdate,
  PlannerRequest: () => PlannerRequest,
  PlannerResponse: () => PlannerResponse,
  ResultShape: () => ResultShape,
  Timestamp: () => Timestamp,
  UUID: () => UUID,
  UpdateContactAction: () => UpdateContactAction
});
module.exports = __toCommonJS(index_exports);

// src/common/primitives.ts
var import_zod = require("zod");
var UUID = import_zod.z.uuid();
var Timestamp = import_zod.z.iso.datetime();
var IdempotencyKey = import_zod.z.string().min(10).max(100);
var ChannelKind = import_zod.z.enum(["phone", "email", "url", "social"]);

// src/common/http.ts
var import_zod2 = require("zod");
var ErrorShape = import_zod2.z.object({
  error: import_zod2.z.object({
    code: import_zod2.z.string(),
    message: import_zod2.z.string(),
    details: import_zod2.z.any().optional()
  })
});
var ResultShape = import_zod2.z.object({
  ok: import_zod2.z.boolean().default(true),
  data: import_zod2.z.any().optional()
});

// src/common/envelope.ts
var import_zod5 = require("zod");

// src/actions/action.ts
var import_zod4 = require("zod");

// src/contacts/contact.ts
var import_zod3 = require("zod");
var ContactCard = import_zod3.z.object({
  first_name: import_zod3.z.string().min(1).describe("Primer nombre del contacto"),
  last_name: import_zod3.z.string().describe("Apellido del contacto"),
  company: import_zod3.z.string().describe("Empresa del contacto"),
  job_title: import_zod3.z.string().describe("Cargo o puesto del contacto"),
  department: import_zod3.z.string().describe("Departamento del contacto"),
  address: import_zod3.z.string().describe("Direcci\xF3n del contacto"),
  birthday: import_zod3.z.iso.date().describe("Fecha de nacimiento en formato ISO"),
  notes: import_zod3.z.string().describe("Notas adicionales sobre el contacto")
});
var Channel = import_zod3.z.object({
  id: UUID.describe("Identificador \xFAnico del canal"),
  kind: ChannelKind.describe("Tipo de canal (email, tel\xE9fono, etc.)"),
  label: import_zod3.z.string().describe("Etiqueta del canal"),
  value: import_zod3.z.string().min(1).describe("Valor del canal (ej: direcci\xF3n de email, n\xFAmero de tel\xE9fono)")
});
var ContactCreate = ContactCard.extend({
  channels: import_zod3.z.array(Channel.omit({ id: true })),
  is_self: import_zod3.z.boolean().default(false)
});
var ContactUpdate = ContactCard.partial().extend({
  id: UUID,
  channels: import_zod3.z.array(
    Channel.extend({
      _op: import_zod3.z.enum(["add", "update", "delete"]).default("update")
    })
  )
});
var Contact = ContactCard.extend({
  id: UUID,
  owner_id: UUID,
  is_self: import_zod3.z.boolean(),
  created_at: Timestamp
});

// src/actions/action.ts
var CreateContactAction = import_zod4.z.object({
  type: import_zod4.z.literal("create_contact").describe("Tipo de acci\xF3n: crear contacto"),
  payload: ContactCreate.describe("Datos para crear un nuevo contacto")
});
var UpdateContactAction = import_zod4.z.object({
  type: import_zod4.z.literal("update_contact").describe("Tipo de acci\xF3n: actualizar contacto"),
  payload: ContactUpdate.describe(
    "Datos para actualizar un contacto existente"
  )
});
var DeleteContactAction = import_zod4.z.object({
  type: import_zod4.z.literal("delete_contact").describe("Tipo de acci\xF3n: eliminar contacto"),
  payload: import_zod4.z.object({ id: UUID.describe("ID del contacto a eliminar") })
});
var Action = import_zod4.z.union([
  CreateContactAction,
  UpdateContactAction,
  DeleteContactAction
]);
var ActionList = import_zod4.z.array(Action).min(1);

// src/common/envelope.ts
var ManualEnvelope = import_zod5.z.object({
  mode: import_zod5.z.literal("manual"),
  idempotency_key: IdempotencyKey.optional(),
  actions: ActionList
});
var NlpEnvelope = import_zod5.z.object({
  mode: import_zod5.z.literal("nlp"),
  idempotency_key: IdempotencyKey.optional(),
  transcript: import_zod5.z.string()
});
var CommandEnvelope = import_zod5.z.union([ManualEnvelope, NlpEnvelope]);

// src/actions/executor.ts
var import_zod6 = require("zod");
var ExecuteRequest = ActionList;
var ExecuteResponse = import_zod6.z.object({
  results: import_zod6.z.array(import_zod6.z.any())
});

// src/actions/planner.ts
var import_zod7 = require("zod");
var PlannerRequest = import_zod7.z.object({
  transcript: import_zod7.z.string().min(5)
});
var PlannerResponse = import_zod7.z.object({
  actions: ActionList.describe(
    "Lista de acciones a realizar basadas en la transcripci\xF3n"
  ),
  transcript: import_zod7.z.string().min(5)
});

// src/account/account.ts
var import_zod8 = require("zod");
var EmailUpdate = import_zod8.z.object({ new_email: import_zod8.z.email() });
var PasswordUpdate = import_zod8.z.object({ new_password: import_zod8.z.string().min(8) });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
