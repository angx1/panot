import express, { Request, Response } from "express"; // Import Request and Response
import { applyProxyRoutes } from "./utils/proxy";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Add a handler for the root path
app.get("/", (req: Request, res: Response) => {
  res.send("API Gateway is running!");
});

applyProxyRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
