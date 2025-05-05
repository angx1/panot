import express from "express";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.use("/", contactRoutes);

app.listen(PORT, () => {
  console.log(`Contact service running on port ${PORT}`);
});
