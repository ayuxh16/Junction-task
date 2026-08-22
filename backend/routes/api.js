import { Router } from "express";
import { INTAKE_QUESTIONS, buildSystemPrompt, openingLine } from "../coach.js";
import { createSession, getSession, appendMessage } from "../sessionStore.js";

const router = Router();

// GET /api/intake — question set the frontend renders
router.get("/intake", (req, res) => {
  res.json({ questions: INTAKE_QUESTIONS });
});

// POST /api/session — create a session from completed intake answers
// body: { role, question, tried, timeline }
router.post("/session", (req, res) => {
  const required = ["role", "question", "tried", "timeline"];
  const profile = {};
  for (const key of required) {
    const val = (req.body?.[key] || "").toString().trim();
    if (!val) {
      return res.status(400).json({ error: `Missing or empty field: ${key}` });
    }
    if (val.length > 500) {
      return res.status(400).json({ error: `Field too long: ${key}` });
    }
    profile[key] = val;
  }

  const sessionId = createSession(profile);
  const opening = openingLine(profile);
  appendMessage(sessionId, "assistant", opening);

  res.json({ sessionId, opening });
});

// POST /api/chat — send a user message, get the coach's reply
// body: { sessionId, message }
router.post("/chat", async (req, res) => {
  const { sessionId, message } = req.body || {};
  if (!sessionId || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "sessionId and a non-empty message are required" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long (max 2000 characters)" });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found or expired. Please restart the intake." });
  }

  appendMessage(sessionId, "user", message.trim());

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Set it in backend/.env." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: buildSystemPrompt(session.profile),
        messages: session.messages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Anthropic API error:", response.status, errBody);
      return res.status(502).json({ error: "Upstream model call failed. Please try again." });
    }

    const data = await response.json();
    const reply = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "The model returned an empty response. Please try again." });
    }

    appendMessage(sessionId, "assistant", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Something went wrong reaching the model." });
  }
});

export default router;
