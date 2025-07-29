var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../packages/types/dist/index.js
var require_dist = __commonJS({
  "../../packages/types/dist/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports2 = {};
    __export(index_exports2, {
      Action: () => Action,
      ActionList: () => ActionList2,
      Channel: () => Channel,
      ChannelKind: () => ChannelKind,
      CommandEnvelope: () => CommandEnvelope2,
      Contact: () => Contact,
      ContactCard: () => ContactCard,
      ContactCreate: () => ContactCreate,
      ContactUpdate: () => ContactUpdate,
      CreateContactAction: () => CreateContactAction,
      DeleteContactAction: () => DeleteContactAction,
      EmailUpdate: () => EmailUpdate,
      ErrorShape: () => ErrorShape,
      ExecuteRequest: () => ExecuteRequest,
      ExecuteResponse: () => ExecuteResponse2,
      IdempotencyKey: () => IdempotencyKey,
      ManualEnvelope: () => ManualEnvelope2,
      NlpEnvelope: () => NlpEnvelope3,
      PasswordUpdate: () => PasswordUpdate,
      PlannerRequest: () => PlannerRequest,
      PlannerResponse: () => PlannerResponse2,
      ResultShape: () => ResultShape,
      Timestamp: () => Timestamp,
      UUID: () => UUID,
      UpdateContactAction: () => UpdateContactAction
    });
    module2.exports = __toCommonJS2(index_exports2);
    var import_zod3 = require("zod");
    var UUID = import_zod3.z.uuid();
    var Timestamp = import_zod3.z.iso.datetime();
    var IdempotencyKey = import_zod3.z.string().min(10).max(100);
    var ChannelKind = import_zod3.z.enum(["phone", "email", "url", "social"]);
    var import_zod22 = require("zod");
    var ErrorShape = import_zod22.z.object({
      error: import_zod22.z.object({
        code: import_zod22.z.string(),
        message: import_zod22.z.string(),
        details: import_zod22.z.any().optional()
      })
    });
    var ResultShape = import_zod22.z.object({
      ok: import_zod22.z.boolean().default(true),
      data: import_zod22.z.any().optional()
    });
    var import_zod5 = require("zod");
    var import_zod4 = require("zod");
    var import_zod32 = require("zod");
    var Channel = import_zod32.z.object({
      id: UUID.optional(),
      kind: ChannelKind,
      label: import_zod32.z.string().optional(),
      value: import_zod32.z.string().min(1)
    });
    var ContactCard = import_zod32.z.object({
      first_name: import_zod32.z.string().min(1),
      last_name: import_zod32.z.string().optional(),
      company: import_zod32.z.string().optional(),
      job_title: import_zod32.z.string().optional(),
      department: import_zod32.z.string().optional(),
      address: import_zod32.z.string().optional(),
      birthday: import_zod32.z.iso.date().optional(),
      notes: import_zod32.z.string().optional()
    });
    var ContactCreate = ContactCard.extend({
      channels: import_zod32.z.array(Channel.omit({ id: true })).optional(),
      is_self: import_zod32.z.boolean().default(false)
    });
    var ContactUpdate = ContactCard.partial().extend({
      id: UUID,
      channels: import_zod32.z.array(
        Channel.extend({
          _op: import_zod32.z.enum(["add", "update", "delete"]).default("update")
        })
      ).optional()
    });
    var Contact = ContactCard.extend({
      id: UUID,
      owner_id: UUID,
      is_self: import_zod32.z.boolean(),
      created_at: Timestamp
    });
    var CreateContactAction = import_zod4.z.object({
      type: import_zod4.z.literal("create_contact"),
      payload: ContactCreate
    });
    var UpdateContactAction = import_zod4.z.object({
      type: import_zod4.z.literal("update_contact"),
      payload: ContactUpdate
    });
    var DeleteContactAction = import_zod4.z.object({
      type: import_zod4.z.literal("delete_contact"),
      payload: import_zod4.z.object({ id: UUID })
    });
    var Action = import_zod4.z.union([
      CreateContactAction,
      UpdateContactAction,
      DeleteContactAction
      // add more here
    ]);
    var ActionList2 = import_zod4.z.array(Action).min(1);
    var ManualEnvelope2 = import_zod5.z.object({
      mode: import_zod5.z.literal("manual"),
      idempotency_key: IdempotencyKey.optional(),
      actions: ActionList2
    });
    var NlpEnvelope3 = import_zod5.z.object({
      mode: import_zod5.z.literal("nlp"),
      idempotency_key: IdempotencyKey.optional(),
      transcript: import_zod5.z.string()
    });
    var CommandEnvelope2 = import_zod5.z.union([ManualEnvelope2, NlpEnvelope3]);
    var import_zod6 = require("zod");
    var ExecuteRequest = ActionList2;
    var ExecuteResponse2 = import_zod6.z.object({
      results: import_zod6.z.array(import_zod6.z.any())
    });
    var import_zod7 = require("zod");
    var PlannerRequest = import_zod7.z.object({
      transcript: import_zod7.z.string().min(5)
    });
    var PlannerResponse2 = import_zod7.z.object({
      actions: ActionList2
    });
    var import_zod8 = require("zod");
    var EmailUpdate = import_zod8.z.object({ new_email: import_zod8.z.email() });
    var PasswordUpdate = import_zod8.z.object({ new_password: import_zod8.z.string().min(8) });
  }
});

// src/index.ts
var index_exports = {};
module.exports = __toCommonJS(index_exports);

// src/server.ts
var import_config = require("dotenv/config");
var import_pino_http = __toESM(require("pino-http"));

// src/middlewares/auth.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/utils/makeError.ts
function makeError(code, message, details, status = 400) {
  const body = { error: { code, message, details } };
  return { status, body };
}

// src/config/env.ts
var import_zod = require("zod");
var EnvSchema = import_zod.z.object({
  PORT: import_zod.z.string().optional(),
  SUPABASE_JWT_SECRET: import_zod.z.string().min(10),
  SVC_DB_URL: import_zod.z.url(),
  SVC_IA_URL: import_zod.z.url(),
  SVC_AUTH_URL: import_zod.z.url(),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development")
});
var env = EnvSchema.parse(process.env);

// src/middlewares/auth.ts
function auth(req, _res, next) {
  const h = req.headers.authorization;
  if (!(h == null ? void 0 : h.startsWith("Bearer "))) {
    return next(makeError("NO_TOKEN", "Missing token", void 0, 401));
  }
  try {
    const token = h.slice(7);
    const payload = (0, import_jsonwebtoken.verify)(token, env.SUPABASE_JWT_SECRET);
    req.user = { id: payload.sub };
    return next();
  } catch (e) {
    return next(makeError("BAD_TOKEN", "Invalid token", e, 401));
  }
}

// src/routes/commands.ts
var import_express = require("express");
var import_types2 = __toESM(require_dist());

// src/middlewares/validate.ts
var import_zod2 = require("zod");
var validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(
      makeError(
        "BAD_BODY",
        "Invalid payload",
        import_zod2.z.treeifyError(result.error),
        400
      )
    );
  }
  req.validated = result.data;
  next();
};

// src/utils/http.ts
async function postJSON(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw { status: res.status, body: json };
  }
  return json;
}

// src/clients/db.ts
async function callDbExecutor(userId, actions) {
  return postJSON(
    `${env.SVC_DB_URL}/execute`,
    actions,
    {
      "x-user-id": userId
    }
  );
}

// src/orchestrators/manualFlow.ts
async function runManualFlow(userId, env2) {
  return callDbExecutor(userId, env2.actions);
}

// src/orchestrators/nlpFlow.ts
var import_types = __toESM(require_dist());

// src/clients/ai.ts
async function callPlanner(userId, transcript) {
  const body = { transcript };
  return postJSON(
    `${env.SVC_IA_URL}/plan`,
    body,
    {
      "x-user-id": userId
    }
  );
}

// src/orchestrators/nlpFlow.ts
async function runNlpFlow(userId, env2) {
  const plan = await callPlanner(userId, env2.transcript);
  const actions = import_types.ActionList.parse(plan.actions);
  return callDbExecutor(userId, actions);
}

// src/routes/commands.ts
var commandsRouter = (0, import_express.Router)();
commandsRouter.post(
  "/",
  validateBody(import_types2.CommandEnvelope),
  async (req, res, next) => {
    try {
      const env2 = req.validated;
      const userId = req.user.id;
      if (env2.mode === "manual") {
        const result = await runManualFlow(userId, env2);
        return res.json({ ok: true, data: result });
      } else {
        const result = await runNlpFlow(userId, env2);
        return res.json({ ok: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  }
);

// src/utils/errors.ts
function errorHandler(err, req, res, _next) {
  var _a, _b, _c, _d;
  (_b = (_a = req.log) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, err);
  if ((_d = (_c = err == null ? void 0 : err.body) == null ? void 0 : _c.error) == null ? void 0 : _d.code) {
    const e = err.body;
    return res.status(err.status ?? 500).json(e);
  }
  const fallback = {
    error: { code: "INTERNAL_ERROR", message: "Unexpected error" }
  };
  return res.status(500).json(fallback);
}

// src/server.ts
var import_http_proxy_middleware = require("http-proxy-middleware");
var express = require("express");
var app = express();
app.use(express.json());
app.use((0, import_pino_http.default)());
app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/v1/commands", auth, commandsRouter);
app.use(
  "/v1/account",
  auth,
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    target: env.SVC_AUTH_URL,
    changeOrigin: true,
    pathRewrite: { "^/v1/account": "/v1/account" },
    onProxyReq(proxyReq, req) {
      proxyReq.setHeader("x-request-id", req.id);
    }
  })
);
app.use(errorHandler);
var port = process.env.PORT ?? 3e3;
app.listen(port, () => console.log(`Gateway on :${port}`));
