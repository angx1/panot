import express from "express";
import dotenv from "dotenv";
import tripRoutes from "./routes/trip.routes";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/", tripRoutes);

app.listen(4002, () => {
  console.log("Trip service running on port 4002");
});
