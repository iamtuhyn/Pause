import { ArrowLeft, Clock3 } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Activity } from "./catalog/activity";
import { copy, pillars } from "./content";
import { BreathingPlayer } from "./players/BreathingPlayer";
import { DoodlePlayer } from "./players/DoodlePlayer";
import { GuessCountryPlayer } from "./players/GuessCountryPlayer";
import { MemoryFlashPlayer } from "./players/MemoryFlashPlayer";
import { SoundscapePlayer } from "./players/SoundscapePlayer";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";

// Public, full-page player for any playable catalogue activity. Visitors can
// open it without signing in; the activity's renderer decides what appears.
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
  const isGame = renderer.kind === "arcade-game";
  const pillar = pillars.find((p) => p.id === activity.pillar);

  return (
    <div className="pause-root pause-player">
      <header className="pause-nav">
        <a className="pause-logo" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <span className="pause-key" aria-hidden="true">Esc</span>
          <span>{copy.brand}</span>
        </a>
        <span className="pause-nav-spacer" />
        <a className="pause-button pause-button-quiet" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <ArrowLeft size={18} />
          {copy.backToPause}
        </a>
      </header>
      <main className="pause-player-main">
        {/* Games show their own title inside the frame; other activities get a visible one. */}
        {isGame ? (
          <h1 className="pause-sr-only">{activity.title}</h1>
        ) : (
          <div className="pause-player-head">
            <span className="pause-player-meta"><Clock3 size={15} aria-hidden="true" /> {pillar?.title} · up to {activity.maxMinutes} min</span>
            <h1>{activity.title}</h1>
            <p>{activity.summary}</p>
          </div>
        )}
        {renderer.kind === "arcade-game" ? <ArcadeFrame src={renderer.src} title={activity.title} /> : null}
        {renderer.kind === "breathing" ? <BreathingPlayer exhaleSeconds={renderer.exhaleSeconds} inhaleSeconds={renderer.inhaleSeconds} minutes={activity.maxMinutes} /> : null}
        {renderer.kind === "soundscape" ? <SoundscapePlayer minutes={activity.maxMinutes} preset={renderer.preset} /> : null}
        {renderer.kind === "doodle" ? <DoodlePlayer hidden={renderer.hidden} prompt={renderer.prompt} /> : null}
        {renderer.kind === "guess-country" ? <GuessCountryPlayer level={renderer.level} rounds={renderer.rounds} /> : null}
        {renderer.kind === "memory-flash" ? <MemoryFlashPlayer rounds={renderer.rounds} /> : null}
      </main>
    </div>
  );
}

// The arcade games are same-origin static pages, so the frame can grow to fit
// the game: the page scrolls instead of the game scrolling inside its frame.
function ArcadeFrame({ src, title }: { src: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const sizer = useRef<ResizeObserver>();

  useEffect(() => () => sizer.current?.disconnect(), []);

  function onLoad() {
    const el = frame.current;
    const doc = el?.contentDocument;
    if (!el || !doc) return;
    el.contentWindow?.focus();
    const fit = () => { el.style.height = `${doc.documentElement.scrollHeight}px`; };
    fit();
    sizer.current?.disconnect();
    sizer.current = new ResizeObserver(fit);
    sizer.current.observe(doc.body);
  }

  return (
    <div className="pause-player-frame">
      <iframe ref={frame} src={src} title={title} allow="fullscreen; web-share; autoplay" onLoad={onLoad} />
    </div>
  );
}
