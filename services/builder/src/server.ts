import "dotenv/config";
const express = require("express");

import pinoHttp from "pino-http";
import { env } from "./config/env";
import { requestId } from "./middlewares/requestId";
import { authForwarded } from "./middlewares/authForwaded";
import { builderRouter } from "./routes/build";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(express.json());
app.use(requestId);
app.use(pinoHttp());

app.get("/health", (_req, res) => res.json({ success: true }));

app.use("/v1/commands/builder", authForwarded, builderRouter);

app.use(errorHandler);

app.listen(env.PORT, () => console.log(`contacts service on :${env.PORT}`));
