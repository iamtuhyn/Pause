// The Descape wordmark: every letter is a keyboard key, D-[Esc]-A-P-E, with only
// Esc in yellow. Decorative, because the link around it carries the name for
// screen readers.
const KEYS = ["D", "Esc", "A", "P", "E"];

export function Wordmark() {
  return (
    <span className="pause-wordmark" aria-hidden="true">
      {KEYS.map((key) => (
        <span key={key} className={key === "Esc" ? "pause-wordmark-key is-esc" : "pause-wordmark-key"}>{key}</span>
      ))}
    </span>
  );
}
