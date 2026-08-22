// sessionStore.js
// A prototype-grade in-memory store. Good enough to demo; swap for Redis
// or a DB before this ever sees real traffic — sessions vanish on restart
// and this won't scale past a single process.

import { randomUUID } from "crypto";

const sessions = new Map();

const MAX_MESSAGES = 40; // simple guard against unbounded memory growth per session
const SESSION_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

export function createSession(profile) {
  const id = randomUUID();
  sessions.set(id, {
    profile,
    messages: [],
    createdAt: Date.now(),
  });
  return id;
}

export function getSession(id) {
  const s = sessions.get(id);
  if (!s) return null;
  if (Date.now() - s.createdAt > SESSION_TTL_MS) {
    sessions.delete(id);
    return null;
  }
  return s;
}

export function appendMessage(id, role, content) {
  const s = getSession(id);
  if (!s) return null;
  s.messages.push({ role, content });
  if (s.messages.length > MAX_MESSAGES) {
    s.messages.splice(0, s.messages.length - MAX_MESSAGES);
  }
  return s;
}

// periodic sweep so long-running processes don't leak memory
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions.entries()) {
    if (now - s.createdAt > SESSION_TTL_MS) sessions.delete(id);
  }
}, 1000 * 60 * 15).unref();
