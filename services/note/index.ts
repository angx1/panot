import express from "express";
import dotenv from "dotenv";
import noteRoutes from "./routes/note.routes";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.use("/", noteRoutes);

app.listen(PORT, () => {
  console.log(`Trip service running on port ${PORT}`);
});
