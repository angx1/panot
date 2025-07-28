import express from "express";
const app = express();
app.use(express.json());

app.post("/execute", (req, res) => {
  res.json({ results: req.body });
});

app.listen(3002, () => console.log("Mock DB on :3002"));
