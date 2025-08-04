import "dotenv/config";
const express = require("express");

import pinoHttp from "pino-http";
import { env } from "./config/env";
import { requestId } from "./middlewares/requestId";
import { authForwarded } from "./middlewares/authForwaded";
import { planRouter } from "./routes/planner";
import { errorHandler } from "./utils/errors";
import { requestContext } from "./utils/requestContext";
import { success } from "zod";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(requestId);
app.use(pinoHttp());

app.get("/health", (_req, res) => res.json({ success: true }));

app.use((req, res, next) => {
  const auth = req.get("authorization") || "";
  const requestId = res.getHeader("x-request-id") as string | undefined;
  requestContext.run({ auth, requestId }, () => next());
});

app.use("/v1/commands/planner", authForwarded, planRouter);

app.use(errorHandler);

app.listen(env.PORT, () => console.log(`svc-ai on :${env.PORT}`));
export {};
