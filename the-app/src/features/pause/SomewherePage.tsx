import { ArrowLeft, ArrowRight, ExternalLink, Landmark, Plane, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { COUNTRIES, CONTINENTS } from "./data/somewhere";
import type { City, Country, Lens } from "./data/somewhere";
import { flagEmoji } from "./data/countryFacts";
import { copy } from "./content";
import { useDisplayFont } from "./useDisplayFont";
import { RoadTrip } from "./Scenes";
import { WorldMap } from "./WorldMap";
import "./pause.css";
import { Wordmark } from "./Wordmark";

// "Take me somewhere": a short travel animation, then four choices (continent,
// lens, country, city) and a result with notes and free sources. Each step is
// one question, so the screen never asks for more than one decision at a time.
type Step = "launch" | "continent" | "lens" | "country" | "city" | "result";

const LENSES: { id: Lens; line: string; icon: typeof Plane; title: string; tone: string }[] = [
  { id: "travel", icon: Plane, line: "Where to go, when to go, and what to see first.", title: "Travel destination", tone: "#d4defb" },
  { id: "history", icon: Landmark, line: "How the place came to be, in a few short steps.", title: "History", tone: "#ffe68a" },
  { id: "culture", icon: UtensilsCrossed, line: "What to eat, what to celebrate, and a word to try.", title: "Culture", tone: "#f8d6cd" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STEP_COUNT = 4;

// Each step's progress and the step before it.
const ORDER: Step[] = ["continent", "lens", "country", "city"];

export function PauseSomewherePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  useDisplayFont();
  const [step, setStep] = useState<Step>("launch");
  const [continent, setContinent] = useState<string>();
  const [lens, setLens] = useState<Lens>();
  const [country, setCountry] = useState<Country>();
  const [city, setCity] = useState<City>();
  const [month, setMonth] = useState(() => new Date().getMonth());

  useEffect(() => {
    const previous = document.title;
    document.title = `${copy.somewhereTitle} · ${copy.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  // The travel animation plays once, then the first question appears.
  useEffect(() => {
    if (step !== "launch") return;
    const timer = window.setTimeout(() => setStep("continent"), 2600);
    return () => window.clearTimeout(timer);
  }, [step]);

  const countries = COUNTRIES.filter((c) => c.continent === continent);
  const tone = CONTINENTS.find((c) => c.id === continent)?.tone;
  const stepIndex = ORDER.indexOf(step);

  function back() {
    if (step === "continent" || step === "launch") {
      if (window.history.length > 1) window.history.back();
      else onNavigate("/");
      return;
    }
    if (step === "result") return setStep("city");
    setStep(ORDER[stepIndex - 1] ?? "continent");
  }

  function restart() {
    setContinent(undefined);
    setLens(undefined);
    setCountry(undefined);
    setCity(undefined);
    setStep("continent");
  }

  return (
    <div className="pause-root pause-player pause-somewhere-page">
      <header className="pause-nav">
        <a className="pause-logo" aria-label={copy.brand} href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <Wordmark />
        </a>
        <span className="pause-nav-spacer" />
        <button className="pause-button pause-button-quiet" onClick={back}>
          <ArrowLeft size={18} aria-hidden="true" />
          {copy.backNav}
        </button>
      </header>

      <main className="pause-somewhere-main">
        {step === "launch" ? <Launch onSkip={() => setStep("continent")} /> : null}

        {step !== "launch" && step !== "result" ? (
          <p className="pause-somewhere-progress">Step {stepIndex + 1} of {STEP_COUNT}</p>
        ) : null}

        {step === "continent" ? (
          <Question title="Where to?" lead="Pick a continent on the map, or from the list.">
            <WorldMap onPick={(picked) => { setContinent(picked); setStep("lens"); }} />
            <div className="pause-somewhere-grid">
              {CONTINENTS.map((item) => (
                <button
                  key={item.id}
                  className="pause-somewhere-choice"
                  style={{ background: item.tone }}
                  onClick={() => {
                    setContinent(item.id);
                    setStep("lens");
                  }}
                >
                  <strong>{item.id}</strong>
                  <span>{item.line}</span>
                  <ArrowRight size={18} aria-hidden="true" className="pause-somewhere-arrow" />
                </button>
              ))}
            </div>
          </Question>
        ) : null}

        {step === "lens" ? (
          <Question title={`${continent}, but what kind of trip?`} lead="One lens for now. You can try the others after.">
            <div className="pause-somewhere-grid pause-somewhere-grid-three">
              {LENSES.map((item) => (
                <button
                  key={item.id}
                  className="pause-somewhere-choice"
                  style={{ background: item.tone }}
                  onClick={() => {
                    setLens(item.id);
                    setStep("country");
                  }}
                >
                  <item.icon size={26} aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <span>{item.line}</span>
                  <ArrowRight size={18} aria-hidden="true" className="pause-somewhere-arrow" />
                </button>
              ))}
            </div>
          </Question>
        ) : null}

        {step === "country" ? (
          <Question title="Which country?" lead={`${countries.length} starting points in ${continent}.`}>
            <div className="pause-somewhere-grid">
              {countries.map((item) => (
                <button
                  key={item.id}
                  className="pause-somewhere-choice"
                  style={{ background: tone }}
                  onClick={() => {
                    setCountry(item);
                    setStep("city");
                  }}
                >
                  <span className="pause-somewhere-flag" aria-hidden="true">{flagEmoji(item.iso2)}</span>
                  <strong>{item.name}</strong>
                  <span>{item.cities.map((c) => c.name).join(" or ")}</span>
                  <ArrowRight size={18} aria-hidden="true" className="pause-somewhere-arrow" />
                </button>
              ))}
            </div>
          </Question>
        ) : null}

        {step === "city" && country ? (
          <Question title={`Which part of ${country.name}?`} lead="Each one has its own story.">
            <div className="pause-somewhere-grid">
              {country.cities.map((item) => (
                <button
                  key={item.id}
                  className="pause-somewhere-choice"
                  style={{ background: tone }}
                  onClick={() => {
                    setCity(item);
                    setStep("result");
                  }}
                >
                  <strong>{item.name}</strong>
                  <span>{item.summary}</span>
                  <ArrowRight size={18} aria-hidden="true" className="pause-somewhere-arrow" />
                </button>
              ))}
            </div>
          </Question>
        ) : null}

        {step === "result" && city && country && lens ? (
          <Result
            city={city}
            country={country}
            lens={lens}
            month={month}
            onMonth={setMonth}
            onLens={() => setStep("lens")}
            onRestart={restart}
          />
        ) : null}
      </main>
    </div>
  );
}

function Launch({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="pause-somewhere-launch" role="status" aria-live="polite">
      <div className="pause-travel is-live" aria-hidden="true"><RoadTrip /></div>
      <p className="pause-breath-word">Packing your bags…</p>
      <button className="pause-text-button" onClick={onSkip}>Skip the trip <ArrowRight size={16} aria-hidden="true" /></button>
    </div>
  );
}

// Each new question takes focus, so screen-reader and keyboard users start at its heading.
function Question({ children, lead, title }: { children: ReactNode; lead: string; title: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: false });
  }, [title]);
  return (
    <section className="pause-somewhere-step" aria-labelledby="pause-somewhere-q">
      <h1 id="pause-somewhere-q" ref={heading} tabIndex={-1}>{title}</h1>
      <p>{lead}</p>
      {children}
    </section>
  );
}

function Result({
  city,
  country,
  lens,
  month,
  onLens,
  onMonth,
  onRestart,
}: {
  city: City;
  country: Country;
  lens: Lens;
  month: number;
  onLens: () => void;
  onMonth: (month: number) => void;
  onRestart: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [city.id, lens]);
  const bestNames = city.best.map((m) => MONTHS[m - 1]).join(", ");
  // city.best counts months from 1; the picker counts from 0.
  const picked = month + 1;
  const near = city.best.some((b) => Math.abs(b - picked) === 1 || Math.abs(b - picked) === 11);
  const verdict = city.best.includes(picked)
    ? "Best time to go. The weather and the crowds line up."
    : near
      ? "A shoulder month. Good weather, a little more company, and fewer queues than the peak."
      : "Quieter months. Pack for the weather and check ahead, but you may have the place to yourself.";

  return (
    <article className="pause-somewhere-result" aria-labelledby="pause-result-title">
      <p className="pause-eyebrow">{country.name} · {country.continent} · {LENSES.find((l) => l.id === lens)?.title}</p>
      <h1 id="pause-result-title" ref={heading} tabIndex={-1}>{city.name}</h1>
      <p className="pause-somewhere-summary">{city.summary}</p>

      {lens === "travel" ? (
        <div className="pause-somewhere-body">
          <div>
            <h2>Start here</h2>
            <ul>
              {city.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="pause-somewhere-when">
            <h2>When to go</h2>
            <div className="pause-months" role="group" aria-label="Month">
              {MONTHS.map((label, index) => (
                <button
                  key={label}
                  className="pause-month"
                  aria-pressed={month === index}
                  data-best={city.best.includes(index + 1) || undefined}
                  onClick={() => onMonth(index)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="pause-somewhere-verdict" aria-live="polite">{verdict}</p>
            <p className="pause-somewhere-note">Best months for {city.name}: {bestNames}.</p>
          </div>
        </div>
      ) : null}

      {lens === "history" ? (
        <div className="pause-somewhere-body">
          <div>
            <h2>{city.history.era}</h2>
            <ol className="pause-timeline">
              {city.history.notes.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
        </div>
      ) : null}

      {lens === "culture" ? (
        <div className="pause-somewhere-body">
          <div>
            <h2>Eat</h2>
            <ul>
              {city.culture.food.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2>Celebrate</h2>
            <p>{city.culture.tradition}</p>
            <h2>Try a word</h2>
            <p><strong>{city.culture.phrase.say}</strong> means &ldquo;{city.culture.phrase.means}&rdquo;.</p>
          </div>
        </div>
      ) : null}

      <section className="pause-somewhere-sources" aria-labelledby="pause-sources-title">
        <h2 id="pause-sources-title">Read more, free</h2>
        <div className="pause-somewhere-links">
          <a className="pause-button pause-button-quiet" href={`https://en.wikipedia.org/wiki/${city.wiki}`} target="_blank" rel="noopener noreferrer">
            Wikipedia: {city.name} <ExternalLink size={16} aria-hidden="true" /><span className="pause-sr-only">(opens in a new tab)</span>
          </a>
          <a className="pause-button pause-button-quiet" href={`https://en.wikivoyage.org/wiki/${city.voyage}`} target="_blank" rel="noopener noreferrer">
            Wikivoyage: {city.name} <ExternalLink size={16} aria-hidden="true" /><span className="pause-sr-only">(opens in a new tab)</span>
          </a>
          {city.more ? (
            <a className="pause-button pause-button-quiet" href={`https://en.wikipedia.org/wiki/${city.more.slug}`} target="_blank" rel="noopener noreferrer">
              {city.more.label} <ExternalLink size={16} aria-hidden="true" /><span className="pause-sr-only">(opens in a new tab)</span>
            </a>
          ) : null}
        </div>
        <p className="pause-somewhere-note">Links open the free encyclopaedia and travel guide. Their text is shared under CC BY-SA.</p>
      </section>

      <div className="pause-stage-controls">
        <button className="pause-button pause-button-ink" onClick={onRestart}>Somewhere else</button>
        <button className="pause-button pause-button-quiet" onClick={onLens}>Try another lens</button>
      </div>
    </article>
  );
}
