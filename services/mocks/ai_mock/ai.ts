import express from "express";

const app = express();
app.use(express.json());

app.post("/plan", (req, res) => {
  res.json({
    actions: [{ type: "create_contact", payload: { first_name: "Carlos" } }],
  });
});

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Mock IA on :${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
