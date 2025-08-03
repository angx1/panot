import "dotenv/config";
const express = require("express");

import pinoHttp from "pino-http";
// import { requestId } from "./middlewares/requestId";
// import { rateLimit } from "./middlewares/rateLimit";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./utils/errors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "./config/env";
import { IncomingMessage } from "http";

interface ExpressRequest extends IncomingMessage {
  body?: any;
}

const app = express();
//app.use(requestId);
//app.use(rateLimit());

app.use(express.json());
app.use(pinoHttp());

app.get("/health", (_, res) => res.json({ ok: true }));

app.use(
  "/v1/commands/planner",
  authMiddleware,
  createProxyMiddleware({
    target: env.SVC_IA_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.includes("/health")) return "/health";
      return "/v1/commands/planner" + path;
    },
    on: {
      proxyReq(proxyReq, req: ExpressRequest) {
        proxyReq.setHeader("x-request-id", (req as any).id);

        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      },
    },
  })
);
app.use(
  "/v1/commands/executer",
  authMiddleware,
  createProxyMiddleware({
    target: env.SVC_DB_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.includes("/health")) return "/health";
      return "/v1/commands/executer" + path;
    },
    on: {
      proxyReq(proxyReq, req: ExpressRequest) {
        proxyReq.setHeader("x-request-id", (req as any).id);

        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      },
    },
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
      proxyReq(proxyReq, req: ExpressRequest) {
        proxyReq.setHeader("x-request-id", (req as any).id);

        if (req.body) {
          const data = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(data));
          proxyReq.write(data);
        }
      },
    },
  })
);

app.use(errorHandler);

const port = process.env.PORT ?? 3005;
app.listen(port, () => console.log(`Gateway on :${port}`));
