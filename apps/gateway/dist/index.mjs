var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/server.ts
import "dotenv/config";
import pinoHttp from "pino-http";

// src/middlewares/authMiddleware.ts
import { verify } from "jsonwebtoken";

// src/utils/makeError.ts
function makeError(code, message, details, status = 400) {
  const body = { error: { code, message, details } };
  return { status, body };
}

// src/config/env.ts
import { z } from "zod";
var EnvSchema = z.object({
  PORT: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().min(10),
  SVC_BUILDER_URL: z.url(),
  SVC_PLANNER_URL: z.url(),
  SVC_AUTH_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development")
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
    const payload = verify(token, env.SUPABASE_JWT_SECRET);
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
import { createProxyMiddleware } from "http-proxy-middleware";
var express = __require("express");
var app = express();
app.use(express.json());
app.use(pinoHttp());
app.get("/health", (_, res) => res.json({ ok: true }));
app.use(
  "/v1/commands/planner",
  authMiddleware,
  createProxyMiddleware({
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
  createProxyMiddleware({
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
  createProxyMiddleware({
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
