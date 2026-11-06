import { ArrowRight, Check, Eye, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COLS = 5;
const ROWS = 4;
const SHAPES = ["circle", "square", "triangle", "diamond", "star"] as const;
const COLOURS = [
  { name: "blue", value: "#1e4fd8" },
  { name: "yellow", value: "#e0a800" },
  { name: "green", value: "#2f8540" },
  { name: "coral", value: "#d4553b" },
  { name: "navy", value: "#0e1b4d" }
];
// Look time per round: starts gentle, ends at one second.
const LOOK_MS = [1500, 1300, 1150, 1000, 1000];
const BLINK_MS = 450;

type Shape = (typeof SHAPES)[number];
type Item = { cell: number; colour: number; shape: Shape };
type Change = { from: Item; kind: "colour" | "shape" | "move"; to: Item };
type Round = { after: Item[]; before: Item[]; change: Change };

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]!;

// A scene of 8 shapes on a 5 x 4 grid, then the same scene with exactly one
// shape changed in colour, in shape, or in position.
function makeRound(): Round {
  const cells = [...Array(COLS * ROWS).keys()].sort(() => Math.random() - 0.5);
  const before: Item[] = cells.slice(0, 8).map((cell) => ({ cell, colour: Math.floor(Math.random() * COLOURS.length), shape: pick(SHAPES) }));
  const index = Math.floor(Math.random() * before.length);
  const from = before[index]!;
  const kind = pick(["colour", "shape", "move"] as const);
  let to: Item;
  if (kind === "colour") to = { ...from, colour: (from.colour + 1 + Math.floor(Math.random() * (COLOURS.length - 1))) % COLOURS.length };
  else if (kind === "shape") to = { ...from, shape: pick(SHAPES.filter((s) => s !== from.shape)) };
  else to = { ...from, cell: cells[8 + Math.floor(Math.random() * (cells.length - 8))]! };
  const after = before.map((item, i) => (i === index ? to : item));
  return { after, before, change: { from, kind, to } };
}

function ShapeIcon({ colour, shape }: { colour: string; shape: Shape }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      {shape === "circle" ? <circle cx="20" cy="20" r="14" fill={colour} /> : null}
      {shape === "square" ? <rect x="7" y="7" width="26" height="26" rx="4" fill={colour} /> : null}
      {shape === "triangle" ? <path d="M20 5 L35 33 H5 Z" fill={colour} /> : null}
      {shape === "diamond" ? <path d="M20 4 L36 20 L20 36 L4 20 Z" fill={colour} /> : null}
      {shape === "star" ? <path d="M20 4 L24.5 15 L36 15.5 L27 23 L30.5 35 L20 28 L9.5 35 L13 23 L4 15.5 L15.5 15 Z" fill={colour} /> : null}
    </svg>
  );
}

function describe(item: Item): string {
  return `${COLOURS[item.colour]!.name} ${item.shape}`;
}

function explain(change: Change): string {
  if (change.kind === "colour") return `The ${change.from.shape} turned from ${COLOURS[change.from.colour]!.name} to ${COLOURS[change.to.colour]!.name}.`;
  if (change.kind === "shape") return `The ${COLOURS[change.from.colour]!.name} ${change.from.shape} became a ${change.to.shape}.`;
  return `The ${describe(change.from)} moved to a new spot.`;
}

type Phase = "ready" | "look" | "blink" | "answer" | "result";

export function MemoryFlashPlayer({ rounds: count }: { rounds: number }) {
  const [round, setRound] = useState<Round>(() => makeRound());
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [picked, setPicked] = useState<number>();
  const [score, setScore] = useState(0);
  const timers = useRef<number[]>([]);
  const next = useRef<HTMLButtonElement>(null);
  const finished = index >= count;

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    if (phase === "result") next.current?.focus();
  }, [phase]);

  function look() {
    setPhase("look");
    timers.current.push(
      window.setTimeout(() => setPhase("blink"), LOOK_MS[Math.min(index, LOOK_MS.length - 1)]),
      window.setTimeout(() => setPhase("answer"), LOOK_MS[Math.min(index, LOOK_MS.length - 1)]! + BLINK_MS)
    );
  }

  const changedCells = round.change.kind === "move" ? [round.change.from.cell, round.change.to.cell] : [round.change.to.cell];
  const correct = picked !== undefined && changedCells.includes(picked);

  function answer(cell: number) {
    if (phase !== "answer") return;
    setPicked(cell);
    if (changedCells.includes(cell)) setScore((value) => value + 1);
    setPhase("result");
  }
  function advance() {
    setRound(makeRound());
    setPicked(undefined);
    setIndex((value) => value + 1);
    setPhase("ready");
  }
  function again() {
    setRound(makeRound());
    setIndex(0);
    setScore(0);
    setPicked(undefined);
    setPhase("ready");
  }

  if (finished) {
    return (
      <div className="pause-stage pause-tone-play pause-memory">
        <p className="pause-breath-word">You spotted {score} of {count}.</p>
        <p className="pause-breath-meta">{score === count ? "Nothing gets past you." : score >= count / 2 ? "Sharp eyes." : "One second is short. That's the point."}</p>
        <div className="pause-stage-controls">
          <button className="pause-button pause-button-ink" onClick={again}><RotateCcw size={18} /> Play again</button>
        </div>
      </div>
    );
  }

  const scene = phase === "look" ? round.before : phase === "answer" || phase === "result" ? round.after : [];
  const byCell = new Map(scene.map((item) => [item.cell, item]));
  const lookSeconds = (LOOK_MS[Math.min(index, LOOK_MS.length - 1)]! / 1000).toFixed(1).replace(".0", "");

  return (
    <div className="pause-stage pause-tone-play pause-memory">
      <p className="pause-guess-progress">Round {index + 1} of {count}</p>
      <p className="pause-guess-question" id="pause-memory-q">
        {phase === "ready" ? `You get ${lookSeconds} second${lookSeconds === "1" ? "" : "s"} to look. Then take all the time you like.` : phase === "look" ? "Look closely…" : phase === "blink" ? "…" : phase === "answer" ? "What changed? Pick it." : correct ? "Spotted it!" : "Not quite."}
      </p>
      <div className={`pause-memory-grid ${phase}`} role="group" aria-labelledby="pause-memory-q">
        {[...Array(COLS * ROWS).keys()].map((cell) => {
          const item = byCell.get(cell);
          const state = phase !== "result" ? "" : changedCells.includes(cell) ? "right" : cell === picked ? "wrong" : "";
          const label = `Row ${Math.floor(cell / COLS) + 1}, column ${(cell % COLS) + 1}: ${item ? describe(item) : "empty"}${state === "right" ? " (this changed)" : state === "wrong" ? " (your pick)" : ""}`;
          return (
            <button
              key={cell}
              className={`pause-memory-cell ${state}`}
              onClick={() => answer(cell)}
              aria-label={label}
              aria-disabled={phase !== "answer"}
              tabIndex={phase === "answer" ? 0 : -1}
            >
              {item ? <ShapeIcon colour={COLOURS[item.colour]!.value} shape={item.shape} /> : null}
              {state ? <span className="pause-memory-badge" aria-hidden="true">{state === "right" ? <Check size={14} /> : <X size={14} />}</span> : null}
            </button>
          );
        })}
      </div>
      <div className="pause-guess-reveal" aria-live="polite">
        {phase === "result" ? <span>{explain(round.change)}</span> : null}
      </div>
      <div className="pause-stage-controls">
        {phase === "ready" ? (
          <button className="pause-button pause-button-ink" onClick={look}><Eye size={18} /> I'm ready</button>
        ) : null}
        {phase === "result" ? (
          <button ref={next} className="pause-button pause-button-ink" onClick={advance}>
            {index + 1 < count ? "Next round" : "See how you did"} <ArrowRight size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
