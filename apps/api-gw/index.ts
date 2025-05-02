import express from "express";
import { applyProxyRoutes } from "./utils/proxy";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

applyProxyRoutes(app);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
