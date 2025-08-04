var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var index_exports = {};
module.exports = __toCommonJS(index_exports);

// src/server.ts
var import_config = require("dotenv/config");
var import_pino_http = __toESM(require("pino-http"));

// src/middlewares/authMiddleware.ts
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
  SVC_BUILDER_URL: import_zod.z.url(),
  SVC_PLANNER_URL: import_zod.z.url(),
  SVC_AUTH_URL: import_zod.z.url(),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development")
});
var env = EnvSchema.parse(process.env);

// src/middlewares/authMiddleware.ts
function authMiddleware(req, _res, next) {
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
app.use(
  "/v1/commands/planner",
  authMiddleware,
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    target: env.SVC_PLANNER_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.includes("/health")) return "/health";
      return "/v1/commands/planner" + path;
    },
    on: {
      proxyReq(proxyReq, req) {
        proxyReq.setHeader("x-request-id", req.id);
        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      }
    }
  })
);
app.use(
  "/v1/commands/builder",
  authMiddleware,
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    target: env.SVC_BUILDER_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.includes("/health")) return "/health";
      return "/v1/commands/builder" + path;
    },
    on: {
      proxyReq(proxyReq, req) {
        proxyReq.setHeader("x-request-id", req.id);
        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      }
    }
  })
);
app.use(
  "/v1/account",
  authMiddleware,
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    target: env.SVC_AUTH_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.startsWith("/v1/account/health")) return "/health";
      return "/v1/account" + path;
    },
    on: {
      proxyReq(proxyReq, req) {
        proxyReq.setHeader("x-request-id", req.id);
        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      }
    }
  })
);
app.use(errorHandler);
var port = process.env.PORT ?? 3005;
app.listen(port, () => console.log(`Gateway on :${port}`));
