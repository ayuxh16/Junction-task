const BASE = "https://junction-task.onrender.com";

async function handle(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const body = await res.json();
      msg = body.error || msg;
    } catch {
      // ignore parse failure, use default message
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchIntakeQuestions() {
  const res = await fetch(`${BASE}/intake`);
  return handle(res);
}

export async function createSession(profile) {
  const res = await fetch(`${BASE}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  return handle(res);
}

export async function sendMessage(sessionId, message) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });
  return handle(res);
}
