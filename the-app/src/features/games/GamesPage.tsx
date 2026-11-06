import { Play } from "lucide-react";
import type { CSSProperties } from "react";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { PageHeader } from "../../shared/ui/PageHeader";
import { earnedAwards, games, loadAwardModule, tiers } from "./games";
import type { Game } from "./games";

export function GamesPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { t } = useT();

  return (
    <section>
      <PageHeader title={t("games.title")} subtitle={t("games.subtitle")} />
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onPlay={() => onNavigate(`/games/${game.id}`)} />
        ))}
      </div>
    </section>
  );
}

function GameCard({ game, onPlay }: { game: Game; onPlay: () => void }) {
  const { t } = useT();
  const won = earnedAwards(game.id);

  return (
    <article className="game-card" style={{ "--game-accent": game.accent } as CSSProperties}>
      <button className="game-card-cover" onClick={onPlay} aria-label={`${t("games.play")} ${game.name}`}>
        <game.icon size={40} />
      </button>
      <div className="game-card-body">
        <h3>{game.name}</h3>
        <p>{game.blurb}</p>
      </div>
      <div className="game-card-footer">
        <div className="medals" aria-label={t("games.medals")}>
          {tiers.map((tier) => {
            const record = won[tier.id];
            return record ? (
              <button
                key={tier.id}
                className="medal earned"
                style={{ background: `linear-gradient(135deg, ${tier.colors[0]}, ${tier.colors[1]})` }}
                title={`${tier.label}: ${record.title ?? ""}`}
                onClick={() => loadAwardModule().then((award) => award.show(record, false)).catch(() => undefined)}
              />
            ) : (
              <span key={tier.id} className="medal" title={`${tier.label} (${t("games.notEarned")})`} />
            );
          })}
        </div>
        <button className="primary-button" onClick={onPlay}>
          <Play size={16} />
          {t("games.play")}
        </button>
      </div>
    </article>
  );
}
