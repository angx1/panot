import express from "express";

const app = express();
const PORT = 4002;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hoooollaaaa" });
});

app.listen(PORT, () => {
  console.log(`Trip service corriendo en http://localhost:${PORT}`);
});
