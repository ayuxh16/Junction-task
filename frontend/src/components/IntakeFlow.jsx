import { useState } from "react";

export default function IntakeFlow({ questions, onComplete, onAnswer }) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");

  const q = questions[step];
  const isLast = step === questions.length - 1;

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAnswer(q.key, q.label, trimmed);
    if (isLast) {
      onComplete();
    } else {
      setStep(step + 1);
      setValue("");
    }
  }

  return (
    <div className="intake">
      <p className="q-label">
        Q{step + 1} · {q.label}
      </p>
      <h2 className="q-text">{q.text}</h2>
      {q.type === "textarea" ? (
        <textarea
          rows={3}
          placeholder={q.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <input
          type="text"
          placeholder={q.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      )}
      {q.chips && (
        <div className="chip-row">
          {q.chips.map((c) => (
            <button className="chip" key={c} onClick={() => setValue(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <br />
      <button className="next-btn" onClick={submit} disabled={!value.trim()}>
        {isLast ? "Start the conversation" : "Next"}
      </button>
    </div>
  );
}
