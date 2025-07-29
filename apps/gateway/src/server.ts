import "dotenv/config";
const express = require("express");

import pinoHttp from "pino-http";
// import { requestId } from "./middlewares/requestId";
// import { rateLimit } from "./middlewares/rateLimit";
import { auth } from "./middlewares/auth";
import { commandsRouter } from "./routes/commands";
import { errorHandler } from "./utils/errors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "./config/env";

const app = express();
app.use(express.json());
//app.use(requestId);
app.use(pinoHttp());
//app.use(rateLimit());

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/v1/commands", auth, commandsRouter);

app.use(
  "/v1/account",
  auth,
  createProxyMiddleware({
    target: env.SVC_AUTH_URL,
    changeOrigin: true,
    pathRewrite: { "^/v1/account": "/v1/account" },
    onProxyReq(proxyReq, req) {
      proxyReq.setHeader("x-request-id", (req as any).id);
    },
  } as any)
);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Gateway on :${port}`));
