import express from "express";
import dotenv from "dotenv";
import tripRoutes from "./routes/trip.routes";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.use("/", tripRoutes);

app.listen(PORT, () => {
  console.log(`Trip service running on port ${PORT}`);
});
