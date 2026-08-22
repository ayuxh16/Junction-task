import { useEffect, useState } from "react";
import FilePanel from "./components/FilePanel.jsx";
import IntakeFlow from "./components/IntakeFlow.jsx";
import ChatThread from "./components/ChatThread.jsx";
import { fetchIntakeQuestions, createSession, sendMessage } from "./api.js";

export default function App() {
  const [questions, setQuestions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [pinnedCards, setPinnedCards] = useState([]);
  const [profile, setProfile] = useState({});
  const [phase, setPhase] = useState("intake"); // intake | starting | chat
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    fetchIntakeQuestions()
      .then((data) => setQuestions(data.questions))
      .catch((err) => setLoadError(err.message));
  }, []);

  function handleAnswer(key, label, value) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setPinnedCards((prev) => [...prev, { label, value }]);
  }

  async function handleIntakeComplete() {
    setPhase("starting");
    try {
      // profile state update above is async; read the latest snapshot via functional update
      setProfile((current) => {
        createSession(current)
          .then(({ sessionId, opening }) => {
            setSessionId(sessionId);
            setMessages([{ role: "assistant", content: opening }]);
            setPhase("chat");
          })
          .catch((err) => {
            setLoadError(err.message);
            setPhase("intake");
          });
        return current;
      });
    } catch (err) {
      setLoadError(err.message);
      setPhase("intake");
    }
  }

  async function handleSend(text) {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsSending(true);
    setChatError(null);
    try {
      const { reply } = await sendMessage(sessionId, text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app">
      <FilePanel pinnedCards={pinnedCards} />
      <main className="main">
        <div className="topbar">
          <h1>Session</h1>
          <span>
            {phase === "intake" && questions
              ? `INTAKE · ${pinnedCards.length + 1} / ${questions.length}`
              : phase === "starting"
              ? "STARTING…"
              : "LIVE SESSION"}
          </span>
        </div>

        {loadError && <div className="banner">{loadError}</div>}

        {phase === "intake" && questions && (
          <IntakeFlow questions={questions} onAnswer={handleAnswer} onComplete={handleIntakeComplete} />
        )}

        {phase === "starting" && <div className="intake">Opening your session…</div>}

        {phase === "chat" && (
          <ChatThread messages={messages} onSend={handleSend} isSending={isSending} errorBanner={chatError} />
        )}
      </main>
    </div>
  );
}
