import { Clock3, Gauge, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Activity } from "./catalog/activity";
import { HOW_TO } from "./catalog/howTo";
import { pillars } from "./content";
import { GamePreview } from "./GamePreview";
import { DoodleScene, GlobeScene, RainScene, SleepySun, WaveScene } from "./Scenes";

// The start screen of every game page: what you're about to play, how it works,
// and one big button. The scene on the right is already moving, so the game
// feels like it's waiting for you. Enter starts it too.
export function GameLobby({ activity, onStart }: { activity: Activity; onStart: () => void }) {
  const howTo = HOW_TO[activity.id];
  const pillar = pillars.find((p) => p.id === activity.pillar);
  const button = useRef<HTMLButtonElement>(null);

  // The start button takes focus, so Enter or Space starts straight away.
  useEffect(() => {
    button.current?.focus({ preventScroll: true });
    // Enter also starts when focus has wandered to the page itself.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.target === document.body || event.target === document.documentElement)) onStart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onStart]);

  return (
    <section className="pause-lobby" aria-labelledby="pause-lobby-title">
      <div className="pause-lobby-copy">
        <p className="pause-lobby-meta">
          <span><Clock3 size={15} aria-hidden="true" /> {pillar?.title} · up to {activity.maxMinutes} min</span>
          {activity.pillar === "play" || activity.pillar === "discover" ? (
            <span><Gauge size={15} aria-hidden="true" /> {activity.difficulty === "easy" ? "Easy" : activity.difficulty === "medium" ? "Medium" : "Tricky"}</span>
          ) : null}
        </p>
        <h1 id="pause-lobby-title">{activity.title}</h1>
        <p className="pause-lobby-goal">{howTo?.goal ?? activity.summary}</p>

        {howTo ? (
          <div className="pause-lobby-rules">
            <h2>How to play</h2>
            <ol>
              {howTo.rules.map((rule) => (
                <li key={rule.text}>
                  <span className="pause-lobby-icon"><rule.icon size={20} aria-hidden="true" /></span>
                  {rule.text}
                </li>
              ))}
            </ol>
            <ul className="pause-lobby-controls" aria-label="Controls">
              {howTo.controls.map((control) => <li key={control}>{control}</li>)}
            </ul>
          </div>
        ) : null}

        <div className="pause-lobby-start">
          <button ref={button} className="pause-play-cta" onClick={onStart}>
            <span className="pause-play-cta-icon"><Play size={22} fill="currentColor" aria-hidden="true" /></span>
            {howTo?.start ?? "Start"}
          </button>
          <span className="pause-lobby-hint" aria-hidden="true">or press <kbd>Enter</kbd></span>
        </div>
      </div>

      <div className="pause-lobby-screen is-live" aria-hidden="true">
        <LobbyScene activity={activity} />
        <span className="pause-lobby-waiting">Waiting for you<span className="pause-lobby-caret">_</span></span>
      </div>
    </section>
  );
}

function LobbyScene({ activity }: { activity: Activity }) {
  const renderer = activity.renderer;
  if (renderer.kind === "breathing") return <SleepySun />;
  if (renderer.kind === "soundscape") return renderer.preset === "rain" ? <RainScene /> : <WaveScene />;
  if (renderer.kind === "doodle") return <DoodleScene hidden={renderer.hidden} />;
  if (renderer.kind === "guess-country") return <GlobeScene />;
  return <GamePreview id={renderer.kind === "arcade-game" ? renderer.gameId : activity.id} />;
}

// Page colours per activity: arcade games keep their own dark screens with one
// neon accent; the calm activities take their scene's colours. Text on each
// background is at least 4.5:1, the accent button at least 3:1 against it.
export type Theme = { accent: string; accentInk: string; bg: string; dark: boolean; ink: string; soft: string; surface: string };

const DARK = { dark: true, ink: "#eef1fb", soft: "#b8c0d9", surface: "rgba(255,255,255,0.06)" };
export const THEMES: Record<string, Theme> = {
  "tic-tac-decay": { ...DARK, accent: "#ff6b8b", accentInk: "#2a0710", bg: "#10131d" },
  "time-loop": { ...DARK, accent: "#6ee7ff", accentInk: "#04222b", bg: "#0a1024" },
  "gravity-typist": { ...DARK, accent: "#ffd166", accentInk: "#2b1d00", bg: "#0b0d14" },
  "reverse-snake": { ...DARK, accent: "#7cffb2", accentInk: "#032611", bg: "#0f1a14" },
  "mouse-shy-maze": { ...DARK, accent: "#ff9f6b", accentInk: "#2e1203", bg: "#120d0b" },
  "tilt-billiards": { ...DARK, accent: "#ffd166", accentInk: "#2b1d00", bg: "#0f2a1c" },
  "echo-room": { ...DARK, accent: "#c4b5fd", accentInk: "#1a1238", bg: "#000000" },
  rain: { ...DARK, accent: "#ffd84d", accentInk: "#3a2e00", bg: "#1b2a6b" },
  waves: { ...DARK, accent: "#00d5f5", accentInk: "#00262d", bg: "#0f0f12" },
  "one-second-memory": { accent: "#1e4fd8", accentInk: "#ffffff", bg: "#fff4c2", dark: false, ink: "#3a2e00", soft: "#5c4a00", surface: "rgba(255,255,255,0.7)" },
  breath: { accent: "#0e1b4d", accentInk: "#ffffff", bg: "#fdf3df", dark: false, ink: "#3a2e00", soft: "#5c4a1a", surface: "rgba(255,255,255,0.75)" },
  "other-hand": { accent: "#6b231a", accentInk: "#ffffff", bg: "#f8d6cd", dark: false, ink: "#6b231a", soft: "#7a3328", surface: "rgba(255,253,247,0.7)" },
  artist: { accent: "#6b231a", accentInk: "#ffffff", bg: "#f8d6cd", dark: false, ink: "#6b231a", soft: "#7a3328", surface: "rgba(255,253,247,0.7)" },
  "guess-country": { accent: "#0e1b4d", accentInk: "#ffffff", bg: "#d4defb", dark: false, ink: "#14307e", soft: "#25418f", surface: "rgba(255,255,255,0.7)" },
  "outline-expert": { accent: "#0e1b4d", accentInk: "#ffffff", bg: "#d4defb", dark: false, ink: "#14307e", soft: "#25418f", surface: "rgba(255,255,255,0.7)" }
};
export const DEFAULT_THEME: Theme = { accent: "#0e1b4d", accentInk: "#ffffff", bg: "#f4f1e8", dark: false, ink: "#0e1b4d", soft: "#4a5680", surface: "#ffffff" };
