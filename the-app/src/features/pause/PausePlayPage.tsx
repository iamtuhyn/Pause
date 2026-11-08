import { ArrowLeft, Clock3 } from "lucide-react";
import { useEffect } from "react";
import type { Activity } from "./catalog/activity";
import { copy, pillars } from "./content";
import { BreathingPlayer } from "./players/BreathingPlayer";
import { DoodlePlayer } from "./players/DoodlePlayer";
import { GuessCountryPlayer } from "./players/GuessCountryPlayer";
import { MemoryFlashPlayer } from "./players/MemoryFlashPlayer";
import { SoundscapePlayer } from "./players/SoundscapePlayer";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";
import { Wordmark } from "./Wordmark";

// Public, full-page player for any playable catalogue activity. Games, breathing
// and sounds fill the screen below the header, so their instructions show without
// scrolling. Visitors can open it without signing in.
export function PausePlayPage({ activity, onNavigate }: { activity: Activity; onNavigate: (path: string) => void }) {
  useDisplayFont();

  useEffect(() => {
    const previous = document.title;
    document.title = `${activity.title} · ${copy.brand}`;
    return () => {
      document.title = previous;
    };
  }, [activity.title]);

  const renderer = activity.renderer;
  const immersive = renderer.kind === "arcade-game" || renderer.kind === "breathing" || renderer.kind === "soundscape";
  const pillar = pillars.find((p) => p.id === activity.pillar);

  // The previous screen in this tab; the playground when this page was opened directly.
  function goBack() {
    if (window.history.length > 1) window.history.back();
    else onNavigate("/");
  }

  function renderPlayer() {
    switch (renderer.kind) {
      case "arcade-game":
        return <ArcadeFrame src={renderer.src} title={activity.title} />;
      case "breathing":
        return <BreathingPlayer exhaleSeconds={renderer.exhaleSeconds} inhaleSeconds={renderer.inhaleSeconds} minutes={activity.maxMinutes} />;
      case "soundscape":
        return <SoundscapePlayer minutes={activity.maxMinutes} preset={renderer.preset} />;
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
    <div className={immersive ? `pause-root pause-player is-immersive${renderer.kind === "arcade-game" ? " is-dark" : ""}` : "pause-root pause-player"}>
      <header className="pause-nav">
        <a className="pause-logo" aria-label={copy.brand} href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <Wordmark />
        </a>
        <span className="pause-nav-spacer" />
        <button className="pause-button pause-button-quiet" onClick={goBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {copy.backNav}
        </button>
        <a className="pause-button pause-button-quiet" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          {copy.backToPause}
        </a>
      </header>
      <main className={immersive ? "pause-player-main is-immersive" : "pause-player-main"}>
        {immersive ? (
          <h1 className="pause-sr-only">{activity.title}</h1>
        ) : (
          <div className="pause-player-head">
            <span className="pause-player-meta"><Clock3 size={15} aria-hidden="true" /> {pillar?.title} · up to {activity.maxMinutes} min</span>
            <h1>{activity.title}</h1>
            <p>{activity.summary}</p>
          </div>
        )}
        {immersive ? <div className="pause-immersive-stage">{renderPlayer()}</div> : renderPlayer()}
      </main>
    </div>
  );
}

// The arcade games are same-origin static pages that fill the screen, so the
// game and its instructions sit in view without scrolling the page.
function ArcadeFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="pause-player-frame">
      <iframe src={src} title={title} allow="fullscreen; web-share; autoplay" onLoad={(event) => event.currentTarget.contentWindow?.focus()} />
    </div>
  );
}
