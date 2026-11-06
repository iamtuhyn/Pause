import { ArrowLeft, Maximize2, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { ActionButton } from "../../shared/ui/ActionButton";
import { PageHeader } from "../../shared/ui/PageHeader";
import type { Game } from "./games";

export function GamePlayPage({ game, onNavigate }: { game: Game; onNavigate: (path: string) => void }) {
  const { t } = useT();
  const frame = useRef<HTMLIFrameElement>(null);
  // Bumping the key remounts the iframe, which restarts the game from scratch.
  const [run, setRun] = useState(0);

  return (
    <section className="game-page">
      <PageHeader
        title={game.name}
        subtitle={game.blurb}
        actions={
          <>
            <ActionButton variant="icon" title={t("games.back")} onClick={() => onNavigate("/games")} icon={<ArrowLeft size={18} />} />
            <ActionButton variant="icon" title={t("games.restart")} onClick={() => setRun((value) => value + 1)} icon={<RotateCcw size={18} />} />
            <ActionButton variant="icon" title={t("games.fullscreen")} onClick={() => frame.current?.requestFullscreen?.()} icon={<Maximize2 size={18} />} />
          </>
        }
      />
      <div className="game-frame">
        {/* Same-origin static page, so keyboard focus can be handed straight to the game on load. */}
        <iframe
          key={run}
          ref={frame}
          src={game.src}
          title={game.name}
          allow="fullscreen; web-share; autoplay"
          onLoad={() => frame.current?.contentWindow?.focus()}
        />
      </div>
    </section>
  );
}
