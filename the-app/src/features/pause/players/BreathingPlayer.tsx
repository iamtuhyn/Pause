import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Guided breathing: the circle grows on the in-breath and shrinks on the
// out-breath. The words carry the guidance on their own, so it still works
// with reduced motion (the circle then stays still).
export function BreathingPlayer({ exhaleSeconds, inhaleSeconds, minutes }: { exhaleSeconds: number; inhaleSeconds: number; minutes: number }) {
  const cycle = inhaleSeconds + exhaleSeconds;
  const totalBreaths = Math.max(1, Math.floor((minutes * 60) / cycle));
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const last = useRef<number>();

  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      setElapsed((value) => value + (now - (last.current ?? now)) / 1000);
      last.current = now;
    }, 100);
    return () => window.clearInterval(timer);
  }, [running]);

  const breath = Math.floor(elapsed / cycle);
  const done = breath >= totalBreaths;
  const inCycle = elapsed % cycle;
  const inhaling = inCycle < inhaleSeconds;
  const secondsLeft = Math.ceil(inhaling ? inhaleSeconds - inCycle : cycle - inCycle);

  useEffect(() => {
    if (done) setRunning(false);
  }, [done]);

  const style = { "--inhale": `${inhaleSeconds}s`, "--exhale": `${exhaleSeconds}s` } as CSSProperties;

  return (
    <div className="pause-stage pause-tone-chill pause-breathing" style={style}>
      <div className={`pause-breath-circle ${running ? (inhaling ? "in" : "out") : ""}`} aria-hidden="true" />
      <p className="pause-breath-word">
        {done ? "Welcome back." : !running && elapsed === 0 ? "Ready when you are." : inhaling ? "Breathe in" : "Breathe out"}
      </p>
      <p className="pause-breath-meta">
        {done ? `${totalBreaths} slow breaths.` : running || elapsed > 0 ? `${secondsLeft} · breath ${breath + 1} of ${totalBreaths}` : `In for ${inhaleSeconds}, out for ${exhaleSeconds}, ${totalBreaths} times.`}
      </p>
      <div className="pause-stage-controls">
        {done ? (
          <button className="pause-button pause-button-ink" onClick={() => { setElapsed(0); setRunning(true); }}>
            <RotateCcw size={18} /> One more
          </button>
        ) : (
          <button className="pause-button pause-button-ink" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? "Pause" : elapsed > 0 ? "Continue" : "Begin"}
          </button>
        )}
      </div>
    </div>
  );
}
