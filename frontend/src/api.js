const BASE =
  import.meta.env.VITE_API_URL || "https://junction-task.onrender.com";

async function handle(res) {
  if (!res.ok) {
    let msg = "Request failed";

    try {
      const body = await res.json();
      msg = body.error || msg;
    } catch {
      // Ignore JSON parse errors
    }

    throw new Error(msg);
  }

  return res.json();
}

// GET /api/intake
export async function fetchIntakeQuestions() {
  const res = await fetch(`${BASE}/api/intake`);
  return handle(res);
}

// POST /api/session
export async function createSession(profile) {
  const res = await fetch(`${BASE}/api/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  return handle(res);
}

// POST /api/chat
export async function sendMessage(sessionId, message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  return handle(res);
}