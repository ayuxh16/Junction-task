import { useEffect, useRef, useState } from "react";

export default function ChatThread({ messages, onSend, isSending, errorBanner }) {
  const [input, setInput] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput("");
    onSend(trimmed);
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {errorBanner && <div className="banner">{errorBanner}</div>}
      <div className="thread" ref={threadRef}>
        {messages.map((m, i) => (
          <div className={`msg ${m.role === "assistant" ? "coach" : "user"}`} key={i}>
            {m.role === "assistant" && <span className="k">Junction</span>}
            {m.content}
          </div>
        ))}
        {isSending && <div className="typing">Junction is thinking…</div>}
      </div>
      <div className="composer">
        <textarea
          placeholder="Ask about your next move…"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button className="send-btn" onClick={handleSend} disabled={isSending || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
