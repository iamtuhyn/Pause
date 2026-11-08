import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GuessQuestion } from "../catalog/activity";
import { COUNTRY_FACTS, flagEmoji } from "../data/countryFacts";
import { COUNTRY_OUTLINES } from "../data/countryOutlines";

type Country = (typeof COUNTRY_OUTLINES)[number] & { capital: string; flag: string; landmark: string; language: string };
type Round = { answer: Country; kind: GuessQuestion; options: Country[] };

const REGIONS = ["Any region", "Africa", "Asia", "Europe", "North America", "Oceania", "South America"] as const;
type Region = (typeof REGIONS)[number];

// Joined once: each outline row gets its facts and flag.
const COUNTRIES: Country[] = COUNTRY_OUTLINES.map((c) => {
  const facts = COUNTRY_FACTS[c.id];
  return { ...c, capital: facts?.capital ?? "", flag: facts ? flagEmoji(facts.iso2) : "", landmark: facts?.landmark ?? "", language: facts?.language ?? "" };
});

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

// The text shown as an answer. Capital questions offer capitals; the rest offer country names.
function labelOf(country: Country, kind: GuessQuestion): string {
  return kind === "capital" ? country.capital : country.name;
}

// Wrong answers come from the chosen region first, then the wider pool, so a
// region stays a real challenge even when it has only two countries.
function makeRounds(pool: Country[], questions: GuessQuestion[], count: number, level: "easy" | "any"): Round[] {
  const eligible = pool.filter((c) => level === "any" || c.difficulty !== "hard");
  const languageCount = new Map<string, number>();
  for (const c of eligible) languageCount.set(c.language, (languageCount.get(c.language) ?? 0) + 1);

  const kinds = shuffle(Array.from({ length: count }, (_, i) => questions[i % questions.length] ?? "outline"));
  const used = new Set<string>();
  const rounds: Round[] = [];
  for (const wanted of kinds) {
    // A language question needs a language only one country in the pool speaks.
    const usable = (c: Country) => !used.has(c.id) && (wanted !== "language" || languageCount.get(c.language) === 1);
    const kind: GuessQuestion = wanted === "language" && !eligible.some(usable) ? "capital" : wanted;
    const answer = shuffle(eligible.filter(usable))[0];
    if (!answer) break;
    used.add(answer.id);

    const seen = new Set([labelOf(answer, kind)]);
    const distractors: Country[] = [];
    for (const c of [...shuffle(eligible), ...shuffle(COUNTRIES)]) {
      const label = labelOf(c, kind);
      if (c.id === answer.id || !label || seen.has(label)) continue;
      seen.add(label);
      distractors.push(c);
      if (distractors.length === 3) break;
    }
    rounds.push({ answer, kind, options: shuffle([answer, ...distractors]) });
  }
  return rounds;
}

function people(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)} million`;
  return new Intl.NumberFormat("en").format(Math.round(n / 1000) * 1000);
}

function prompt(round: Round): string {
  const { answer, kind } = round;
  if (kind === "capital") return `What is the capital of ${answer.name}?`;
  if (kind === "landmark") return `Which country is home to ${answer.landmark}?`;
  if (kind === "language") return `Which country has ${answer.language} as an official language?`;
  if (kind === "flag") return "Which country does this flag belong to?";
  return "Where in the world is this?";
}

export function GuessCountryPlayer({ level, questions, rounds: count }: { level: "easy" | "any"; questions: GuessQuestion[]; rounds: number }) {
  const [region, setRegion] = useState<Region>("Any region");
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState(0);
  const pool = useMemo(() => COUNTRIES.filter((c) => region === "Any region" || c.continent === region), [region]);
  const rounds = useMemo(
    () => (started ? makeRounds(pool, questions, Math.min(count, pool.length), level) : []),
    [started, pool, questions, count, level, seed],
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string>();
  const [score, setScore] = useState(0);
  const next = useRef<HTMLButtonElement>(null);
  const round = rounds[index];
  const finished = started && index >= rounds.length;

  // After answering, move focus to "Next" so keyboard users can carry on.
  useEffect(() => {
    if (picked) next.current?.focus();
  }, [picked]);

  function begin() {
    setSeed((value) => value + 1);
    setIndex(0);
    setScore(0);
    setPicked(undefined);
    setStarted(true);
  }
  function answer(id: string) {
    if (picked || !round) return;
    setPicked(id);
    if (id === round.answer.id) setScore((value) => value + 1);
  }
  function advance() {
    setPicked(undefined);
    setIndex((value) => value + 1);
  }

  if (!started) {
    return (
      <div className="pause-stage pause-tone-discover pause-guess">
        <p className="pause-breath-word">Pick a region</p>
        <p className="pause-breath-meta">Or keep it wide open. Every round mixes things up.</p>
        <div className="pause-chips pause-region-chips" role="radiogroup" aria-label="Region">
          {REGIONS.map((option) => (
            <label key={option} className="pause-chip">
              <input type="radio" name="pause-region" checked={region === option} onChange={() => setRegion(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div className="pause-stage-controls">
          <button className="pause-button pause-button-ink" onClick={begin}>Start <ArrowRight size={18} /></button>
        </div>
        <p className="pause-guess-credit">Outlines: Natural Earth (public domain). Facts: general reference.</p>
      </div>
    );
  }

  if (finished || !round) {
    return (
      <div className="pause-stage pause-tone-discover pause-guess">
        <p className="pause-breath-word">You got {score} of {rounds.length}.</p>
        <p className="pause-breath-meta">{score === rounds.length ? "Every single one. You're a walking atlas." : score >= rounds.length / 2 ? "A well-travelled eye." : "Maps are tricky. That's the fun."}</p>
        <div className="pause-stage-controls">
          <button className="pause-button pause-button-ink" onClick={begin}><RotateCcw size={18} /> Play again</button>
          <button className="pause-button pause-button-quiet" onClick={() => setStarted(false)}>Change region</button>
        </div>
        <p className="pause-guess-credit">Outlines: Natural Earth (public domain). Facts: general reference.</p>
      </div>
    );
  }

  const correct = picked === round.answer.id;
  const answerLabel = labelOf(round.answer, round.kind);
  return (
    <div className="pause-stage pause-tone-discover pause-guess">
      <p className="pause-guess-progress">Question {index + 1} of {rounds.length}</p>
      {round.kind === "outline" ? (
        <svg className="pause-guess-outline" viewBox="0 0 100 100" role="img" aria-label="Outline of a country">
          <path d={round.answer.path} />
        </svg>
      ) : null}
      {round.kind === "flag" ? <span className="pause-guess-flag" aria-hidden="true">{round.answer.flag}</span> : null}
      <p className="pause-guess-question" id="pause-guess-q">{prompt(round)}</p>
      <div className="pause-guess-options" role="group" aria-labelledby="pause-guess-q">
        {round.options.map((option) => {
          const isAnswer = option.id === round.answer.id;
          const state = !picked ? "" : isAnswer ? "right" : option.id === picked ? "wrong" : "dim";
          return (
            <button key={option.id} className={`pause-guess-option ${state}`} onClick={() => answer(option.id)} aria-disabled={!!picked}>
              {state === "right" ? <Check size={18} aria-hidden="true" /> : null}
              {state === "wrong" ? <X size={18} aria-hidden="true" /> : null}
              <span>{labelOf(option, round.kind)}</span>
              {state === "right" ? <span className="pause-sr-only">(correct answer)</span> : null}
              {state === "wrong" ? <span className="pause-sr-only">(your answer)</span> : null}
            </button>
          );
        })}
      </div>
      <div className="pause-guess-reveal" aria-live="polite">
        {picked ? (
          <>
            <strong>{correct ? "Spot on!" : `That's ${answerLabel}.`}</strong>
            <span>{round.answer.name}: capital {round.answer.capital}, {round.answer.subregion}</span>
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
