import { ArrowRight, Clock3, Send, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { earnedAwards, tiers } from "../games/games";
import { BreakPicker } from "./BreakPicker";
import { dailyDrop, playableActivities, playableCount } from "./catalog/catalog";
import { contributions, copy, pillars } from "./content";
import { GamePreview } from "./GamePreview";
import { PauseIllustration } from "./PauseIllustration";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";
import { Wordmark } from "./Wordmark";

// Public prototype of the PAUSÉ landing page. Rendered full-page, outside
// the app shell and the sign-in guard.
export function PausePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { status } = useAuth();
  const [now, setNow] = useState(() => new Date());
  useDisplayFont();

  // Only playable activities can be the drop; one per calendar day. No
  // countdown: a ticking clock is the opposite of a break.
  const drop = dailyDrop(now);
  const unwind = playableActivities().filter((a) => a.pillar === "chill" || a.pillar === "create");
  const discover = playableActivities().filter((a) => a.pillar === "discover");
  // Every playable Play activity; only the arcade games keep medals.
  const games = playableActivities()
    .filter((a) => a.pillar === "play")
    .map((a) => ({ activity: a, gameId: a.renderer.kind === "arcade-game" ? a.renderer.gameId : undefined }));

  useEffect(() => {
    const previous = document.title;
    document.title = copy.brand;
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      document.title = previous;
      window.clearInterval(timer);
    };
  }, []);

  function go(path: string) {
    return (event: { preventDefault: () => void }) => {
      event.preventDefault();
      onNavigate(path);
    };
  }
  const play = (activityId: string) => onNavigate(`/pause/play/${activityId}`);

  return (
    <div className="pause-root">
      <main>
        <div className="pause-hero">
        <header className="pause-nav">
          <a className="pause-logo" aria-label={copy.brand} href="/" onClick={go("/")}>
            <Wordmark />
          </a>
          <nav className="pause-links" aria-label="Main">
            <a href="#pause-play">{copy.navPlay}</a>
            <a href="#pause-somewhere">{copy.navDiscover}</a>
            <a href="/pause/sign-in?returnTo=%2Fgames" onClick={go("/pause/sign-in?returnTo=%2Fgames")}>{copy.navCommunity}</a>
          </nav>
          {status === "authenticated" ? (
            <a className="pause-button pause-button-quiet" href="/games" onClick={go("/games")}>{copy.navOpenApp}</a>
          ) : (
            <a className="pause-button pause-button-quiet" href="/pause/sign-in?returnTo=%2Fgames" onClick={go("/pause/sign-in?returnTo=%2Fgames")}>{copy.navSignIn}</a>
          )}
        </header>
          <div className="pause-hero-copy">
            <h1>{copy.heroTitle}</h1>
            <p className="pause-hero-lead">{copy.heroLead}</p>
            <BreakPicker onStart={play} />
        {drop ? (
          <section className="pause-drop pause-drop-hero" aria-labelledby="pause-drop-title">
            <span className="pause-eyebrow">{copy.dropLabel}</span>
            <div className="pause-drop-body">
              <h2 id="pause-drop-title">{drop.title}</h2>
              <p>{drop.summary}</p>
            </div>
            <div className="pause-drop-side">
              <span className="pause-drop-meta">
                <Clock3 size={15} aria-hidden="true" /> {drop.maxMinutes} min · {pillars.find((p) => p.id === drop.pillar)?.title}
              </span>
              <span className="pause-drop-meta">{copy.dropNext}</span>
              {drop ? (
                <a className="pause-button pause-button-ink" href={`/pause/play/${drop.id}`} onClick={go(`/pause/play/${drop.id}`)}>
                  {copy.resultStart}
                  <ArrowRight size={18} />
                </a>
              ) : (
                <em className="pause-drop-meta">{copy.resultPreview}</em>
              )}
            </div>
          </section>
        ) : null}
          </div>
          <PauseIllustration />
        </div>


        <section className="pause-block" aria-labelledby="pause-pillars-title">
          <div className="pause-block-head">
            <h2 id="pause-pillars-title">{copy.pillarsTitle} <span>{copy.pillarsAccent}</span></h2>
            <p>{copy.pillarsLead}</p>
          </div>
          <ul className="pause-pillars">
            {pillars.map((pillar) => (
              <li key={pillar.id} className={`pause-pillar pause-tone-${pillar.id}`}>
                <span className="pause-pillar-top">
                  <pillar.icon size={28} strokeWidth={1.75} aria-hidden="true" />
                  {playableCount(pillar.id) ? null : <span className="pause-tag">{copy.pillarPreview}</span>}
                </span>
                <div>
                  <h3>
                    {pillar.href ? <a className="pause-stretched" href={pillar.href}>{pillar.title}</a> : pillar.title}
                  </h3>
                  <p>{pillar.line}</p>
                </div>
                <span className="pause-pillar-foot">
                  <span>{pillar.id === "play" ? `${playableCount("play")} ${pillar.example.toLowerCase()}` : pillar.example}</span>
                  {pillar.href ? <ArrowRight size={18} aria-hidden="true" /> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pause-block" id="pause-play" aria-labelledby="pause-play-title">
          <div className="pause-block-head">
            <h2 id="pause-play-title">{copy.playTitle}</h2>
            <p>{copy.playLead}</p>
          </div>
          <ul className="pause-games">
            {games.map(({ activity, gameId }) => {
              const won = gameId ? earnedAwards(gameId) : {};
              const count = tiers.filter((tier) => won[tier.id]).length;
              return (
                <li key={activity.id} className="pause-game">
                  <span className="pause-game-screen"><GamePreview id={gameId ?? activity.id} /></span>
                  <h3>
                    <a className="pause-stretched" href={`/pause/play/${activity.id}`} onClick={go(`/pause/play/${activity.id}`)}>{activity.title}</a>
                  </h3>
                  <p>{activity.summary}</p>
                  {/* Only medals already earned: empty slots read as a to-do list. */}
                  {count ? (
                    <span className="pause-medals" aria-label={`${copy.medalsLabel}: ${count}`}>
                      {tiers.filter((tier) => won[tier.id]).map((tier) => (
                        <span
                          key={tier.id}
                          className="pause-medal on"
                          style={{ background: `linear-gradient(135deg, ${tier.colors[0]}, ${tier.colors[1]})` }}
                        />
                      ))}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="pause-block" id="pause-unwind" aria-labelledby="pause-unwind-title">
          <div className="pause-block-head">
            <h2 id="pause-unwind-title">{copy.unwindTitle} <span>{copy.unwindAccent}</span></h2>
            <p>{copy.unwindLead}</p>
          </div>
          <ul className="pause-unwind">
            {unwind.map((activity) => (
              <li key={activity.id} className={`pause-unwind-card pause-tone-${activity.pillar}`}>
                <span className="pause-unwind-meta">
                  {pillars.find((p) => p.id === activity.pillar)?.title} · {activity.maxMinutes} min
                </span>
                <h3>
                  <a className="pause-stretched" href={`/pause/play/${activity.id}`} onClick={go(`/pause/play/${activity.id}`)}>{activity.title}</a>
                </h3>
                <p>{activity.summary}</p>
                <ArrowRight size={18} aria-hidden="true" className="pause-unwind-arrow" />
              </li>
            ))}
          </ul>
        </section>

        <section className="pause-block" id="pause-somewhere" aria-labelledby="pause-somewhere-title">
          <div className="pause-block-head">
            <h2 id="pause-somewhere-title">{copy.somewhereTitle}</h2>
            <p>{copy.somewhereLead}</p>
          </div>
          {discover.length ? (
            <ul className="pause-unwind pause-unwind-discover">
              {discover.map((activity) => (
                <li key={activity.id} className="pause-unwind-card pause-tone-discover">
                  <span className="pause-unwind-meta">Discover · {activity.maxMinutes} min</span>
                  <h3>
                    <a className="pause-stretched" href={`/pause/play/${activity.id}`} onClick={go(`/pause/play/${activity.id}`)}>{activity.title}</a>
                  </h3>
                  <p>{activity.summary}</p>
                  <ArrowRight size={18} aria-hidden="true" className="pause-unwind-arrow" />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="pause-somewhere-cta">
            <p>{copy.somewhereInvite}</p>
            <a className="pause-button pause-button-ink" href="/pause/somewhere" onClick={go("/pause/somewhere")}>
              <Shuffle size={18} aria-hidden="true" />
              {copy.somewhereCta}
            </a>
          </div>
        </section>

        <section className="pause-block" id="pause-community" aria-labelledby="pause-community-title">
          <div className="pause-community">
            <div>
              <h2 id="pause-community-title">{copy.communityTitle}</h2>
              <p>{copy.communityLead}</p>
            </div>
            <div className="pause-contribute">
              <span className="pause-eyebrow">{copy.contributeLabel}</span>
              <div className="pause-contribute-options">
                {contributions.map((label) => (
                  <a key={label} className="pause-button pause-button-quiet" href="/pause/sign-in?returnTo=%2Fgames" onClick={go("/pause/sign-in?returnTo=%2Fgames")}>
                    <Send size={16} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pause-footer">
        <span className="pause-logo" aria-label={copy.brand} role="img"><Wordmark /></span>
        <span>{copy.footer}</span>
      </footer>
    </div>
  );
}
