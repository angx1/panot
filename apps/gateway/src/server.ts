import "dotenv/config";
const express = require("express");

import pinoHttp from "pino-http";
// import { requestId } from "./middlewares/requestId";
// import { rateLimit } from "./middlewares/rateLimit";
import { auth } from "./middlewares/auth";
import { commandsRouter } from "./routes/commands";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(express.json());
//app.use(requestId);
app.use(pinoHttp());
//app.use(rateLimit());

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/v1/commands", auth, commandsRouter);
app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Gateway on :${port}`));
