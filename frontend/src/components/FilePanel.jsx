export default function FilePanel({ pinnedCards }) {
  return (
    <aside className="file-panel">
      <div>
        <p className="eyebrow">Career File</p>
        <h1 className="brand">Junction</h1>
        <p className="brand-sub">
          A coach for the decision, not the resume. Built for professionals
          1–5 years into their career.
        </p>
      </div>
      <div className="file-divider" />
      <div className="card-stack">
        {pinnedCards.length === 0 ? (
          <p className="file-empty">
            Nothing pinned yet — answer a few questions and this file builds
            itself.
          </p>
        ) : (
          pinnedCards.map((card, i) => (
            <div className="file-card" key={i}>
              <span className="k">{card.label}</span>
              {card.value}
            </div>
          ))
        )}
      </div>
      <div className="scope-note">
        <b>In scope:</b> role switches, offer evaluation, pivots, upskilling
        direction, stay-or-go calls.
        <br />
        <br />
        <b>Out of scope:</b> resume writing, interview drilling, salary
        scripts, legal/HR disputes, mental-health support.
      </div>
    </aside>
  );
}
