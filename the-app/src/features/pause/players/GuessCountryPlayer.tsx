import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRY_OUTLINES } from "../data/countryOutlines";
import type { CountryOutline } from "../data/countryOutlines";

type Round = { answer: CountryOutline; options: CountryOutline[] };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

// Each round: one outline and four names. Wrong options come from the same
// continent where possible, so the answer can't be guessed from geography alone.
function makeRounds(count: number, level: "easy" | "any"): Round[] {
  const pool = COUNTRY_OUTLINES.filter((c) => level === "any" || c.difficulty !== "hard");
  return shuffle(pool).slice(0, count).map((answer) => {
    const near = shuffle(COUNTRY_OUTLINES.filter((c) => c.id !== answer.id && c.continent === answer.continent));
    const far = shuffle(COUNTRY_OUTLINES.filter((c) => c.id !== answer.id && c.continent !== answer.continent));
    return { answer, options: shuffle([answer, ...[...near, ...far].slice(0, 3)]) };
  });
}

function people(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)} million`;
  return new Intl.NumberFormat("en").format(Math.round(n / 1000) * 1000);
}

export function GuessCountryPlayer({ level, rounds: count }: { level: "easy" | "any"; rounds: number }) {
  const [seed, setSeed] = useState(0);
  const rounds = useMemo(() => makeRounds(count, level), [count, level, seed]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string>();
  const [score, setScore] = useState(0);
  const next = useRef<HTMLButtonElement>(null);
  const finished = index >= rounds.length;
  const round = rounds[index];

  // After answering, move focus to "Next" so keyboard users can carry on.
  useEffect(() => {
    if (picked) next.current?.focus();
  }, [picked]);

  function answer(id: string) {
    if (picked || !round) return;
    setPicked(id);
    if (id === round.answer.id) setScore((value) => value + 1);
  }
  function advance() {
    setPicked(undefined);
    setIndex((value) => value + 1);
  }
  function again() {
    setSeed((value) => value + 1);
    setIndex(0);
    setScore(0);
    setPicked(undefined);
  }

  if (finished || !round) {
    return (
      <div className="pause-stage pause-tone-discover pause-guess">
        <p className="pause-breath-word">You got {score} of {rounds.length}.</p>
        <p className="pause-breath-meta">{score === rounds.length ? "Every single one. You're a walking atlas." : score >= rounds.length / 2 ? "A well-travelled eye." : "Maps are tricky. That's the fun."}</p>
        <div className="pause-stage-controls">
          <button className="pause-button pause-button-ink" onClick={again}><RotateCcw size={18} /> Play again</button>
        </div>
        <p className="pause-guess-credit">Outlines: Natural Earth (public domain).</p>
      </div>
    );
  }

  const correct = picked === round.answer.id;
  return (
    <div className="pause-stage pause-tone-discover pause-guess">
      <p className="pause-guess-progress">Outline {index + 1} of {rounds.length}</p>
      <svg className="pause-guess-outline" viewBox="0 0 100 100" role="img" aria-label="Outline of a country">
        <path d={round.answer.path} />
      </svg>
      <p className="pause-guess-question" id="pause-guess-q">Where in the world is this?</p>
      <div className="pause-guess-options" role="group" aria-labelledby="pause-guess-q">
        {round.options.map((option) => {
          const isAnswer = option.id === round.answer.id;
          const state = !picked ? "" : isAnswer ? "right" : option.id === picked ? "wrong" : "dim";
          return (
            <button key={option.id} className={`pause-guess-option ${state}`} onClick={() => answer(option.id)} aria-disabled={!!picked}>
              {state === "right" ? <Check size={18} aria-hidden="true" /> : null}
              {state === "wrong" ? <X size={18} aria-hidden="true" /> : null}
              <span>{option.name}</span>
              {state === "right" ? <span className="pause-sr-only">(correct answer)</span> : null}
              {state === "wrong" ? <span className="pause-sr-only">(your answer)</span> : null}
            </button>
          );
        })}
      </div>
      <div className="pause-guess-reveal" aria-live="polite">
        {picked ? (
          <>
            <strong>{correct ? "Spot on!" : `That's ${round.answer.name}.`}</strong>
            <span>Region: {round.answer.subregion}</span>
            <span>People: about {people(round.answer.population)} ({round.answer.populationYear} estimate)</span>
          </>
        ) : null}
      </div>
      {picked ? (
        <div className="pause-stage-controls">
          <button ref={next} className="pause-button pause-button-ink" onClick={advance}>
            {index + 1 < rounds.length ? "Next one" : "See how you did"} <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
