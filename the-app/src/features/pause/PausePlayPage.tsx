import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Activity } from "./catalog/activity";
import { copy } from "./content";
import { DEFAULT_THEME, GameLobby, THEMES } from "./GameLobby";
import { BreathingPlayer } from "./players/BreathingPlayer";
import { DoodlePlayer } from "./players/DoodlePlayer";
import { GuessCountryPlayer } from "./players/GuessCountryPlayer";
import { MemoryFlashPlayer } from "./players/MemoryFlashPlayer";
import { SoundscapePlayer } from "./players/SoundscapePlayer";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";
import { Wordmark } from "./Wordmark";

// Public, full-page player for any playable catalogue activity. It opens on a
// start screen (rules and one big button); starting swaps in the game itself.
// The whole page, header included, takes the game's own colours, so there is
// no seam or frame. Visitors can open it without signing in.
export function PausePlayPage({ activity, onNavigate }: { activity: Activity; onNavigate: (path: string) => void }) {
  useDisplayFont();
  const [started, setStarted] = useState(false);
  const [frameBg, setFrameBg] = useState<string>();
  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    const previous = document.title;
    document.title = `${activity.title} · ${copy.brand}`;
    setStarted(false);
    return () => {
      document.title = previous;
    };
  }, [activity.id, activity.title]);

  const renderer = activity.renderer;
  const fills = renderer.kind === "arcade-game" || renderer.kind === "breathing" || renderer.kind === "soundscape";
  const theme = THEMES[activity.id] ?? DEFAULT_THEME;
  const style = {
    "--player-bg": started && frameBg ? frameBg : theme.bg,
    "--player-ink": theme.ink,
    "--player-soft": theme.soft,
    "--player-accent": theme.accent,
    "--player-accent-ink": theme.accentInk,
    "--player-surface": theme.surface
  } as CSSProperties;

  // Back from a running game returns to its start screen; from the start
  // screen, to the previous page (or the landing page when opened directly).
  function goBack() {
    if (started) return setStarted(false);
    if (window.history.length > 1) window.history.back();
    else onNavigate("/");
  }

  function renderPlayer() {
    switch (renderer.kind) {
      case "arcade-game":
        return <ArcadeFrame src={renderer.src} title={activity.title} onBackground={setFrameBg} />;
      case "breathing":
        return <BreathingPlayer autoStart exhaleSeconds={renderer.exhaleSeconds} inhaleSeconds={renderer.inhaleSeconds} minutes={activity.maxMinutes} />;
      case "soundscape":
        return <SoundscapePlayer autoStart minutes={activity.maxMinutes} preset={renderer.preset} />;
      case "doodle":
        return <DoodlePlayer hidden={renderer.hidden} prompt={renderer.prompt} />;
      case "guess-country":
        return <GuessCountryPlayer level={renderer.level} questions={renderer.questions} rounds={renderer.rounds} />;
      case "memory-flash":
        return <MemoryFlashPlayer rounds={renderer.rounds} />;
      default:
        return null;
    }
  }

  return (
    <div className={`pause-root pause-player is-immersive${theme.dark ? " is-dark" : ""}`} style={style}>
      <header className="pause-nav">
        <a className="pause-logo" aria-label={copy.brand} href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <Wordmark />
        </a>
        <span className="pause-nav-spacer" />
        <button className="pause-button pause-button-quiet" onClick={goBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {started ? "How to play" : copy.backNav}
        </button>
      </header>
      <main className={fills && started ? "pause-player-main is-immersive" : "pause-player-main"}>
        {!started ? (
          <GameLobby activity={activity} onStart={start} />
        ) : fills ? (
          <>
            <h1 className="pause-sr-only">{activity.title}</h1>
            <div className="pause-immersive-stage">{renderPlayer()}</div>
          </>
        ) : (
          <>
            <h1 className="pause-player-title">{activity.title}</h1>
            {renderPlayer()}
          </>
        )}
      </main>
    </div>
  );
}

// The arcade games are same-origin static pages that fill the screen. The start
// screen already explained the rules, so the game's own start button is pressed
// for the player once it loads, and focus moves into the game.
// The page then takes the game's own background colour, so the header has no seam.
function ArcadeFrame({ onBackground, src, title }: { onBackground: (color: string) => void; src: string; title: string }) {
  return (
    <div className="pause-player-frame">
      <iframe
        src={src}
        title={title}
        allow="fullscreen; web-share; autoplay"
        onLoad={(event) => {
          const frame = event.currentTarget.contentWindow;
          try {
            const body = frame?.document.body;
            const color = body ? frame.getComputedStyle(body).backgroundColor : "";
            if (color && color !== "rgba(0, 0, 0, 0)") onBackground(color);
            frame?.document.querySelector<HTMLButtonElement>("#pBtn")?.click();
          } catch {
            // A different origin: leave the game's own start screen in place.
          }
          frame?.focus();
        }}
      />
    </div>
  );
}
