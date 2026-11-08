import { useEffect, useState } from "react";

// D [Esc] A P E as keyboard keys. With "animate", it first spells DESK + ESCAPE,
// then the extra keys slide away and E-S-C merges into the yellow Esc key, so
// Desk + Escape visibly becomes Descape. It replays on hover.
type Key = { label: string; role: "keep" | "drop" | "esc" };
const KEYS: Key[] = [
  { label: "D", role: "keep" },
  { label: "E", role: "drop" },
  { label: "S", role: "drop" },
  { label: "K", role: "drop" },
  { label: "E", role: "esc" },
  { label: "S", role: "drop" },
  { label: "C", role: "drop" },
  { label: "A", role: "keep" },
  { label: "P", role: "keep" },
  { label: "E", role: "keep" }
];

export function Wordmark({ animate = false }: { animate?: boolean }) {
  const [formed, setFormed] = useState(!animate);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFormed(true);
      return;
    }
    setFormed(false);
    const timer = window.setTimeout(() => setFormed(true), 1100);
    return () => window.clearTimeout(timer);
  }, [animate, run]);

  return (
    <span
      className={`pause-wordmark${animate ? " is-animated" : ""}${formed ? " is-formed" : ""}`}
      aria-hidden="true"
      onMouseEnter={animate && formed ? () => setRun((n) => n + 1) : undefined}
    >
      {KEYS.map((key, index) => (
        <span key={index} className={`pause-wordmark-key is-${key.role}`}>
          {key.role === "esc" ? (
            <>
              <span className="pause-wordmark-e">E</span>
              <span className="pause-wordmark-esc">Esc</span>
            </>
          ) : (
            key.label
          )}
        </span>
      ))}
    </span>
  );
}
