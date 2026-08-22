import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "50kb" }));
app.use(morgan("tiny"));

// Rate limit: generous enough for a real conversation, tight enough to
// stop naive abuse of the API-key-backed endpoints in a public demo.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down." },
});
app.use("/api", limiter);

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api", apiRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`Junction backend listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY is not set — chat requests will fail. Copy .env.example to .env and add your key.");
  }
});
