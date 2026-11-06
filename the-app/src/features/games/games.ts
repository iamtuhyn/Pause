import { Infinity as InfinityIcon, Radar, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// The games themselves are static pages under public/arcade/, copied from
// the standalone mini-arcade. This file is only the catalog the app shows.
export type Game = { accent: string; blurb: string; icon: LucideIcon; id: string; name: string; src: string };

export const games: Game[] = [
  {
    accent: "#6ee7ff",
    blurb: "Ten seconds per loop. Every past run comes back as a ghost you can stand on.",
    icon: InfinityIcon,
    id: "time-loop",
    name: "Time Loop",
    src: "/arcade/time-loop/index.html"
  },
  {
    accent: "#a78bfa",
    blurb: "Total darkness. Send out a ping to see the walls for a moment, and listen for the exit.",
    icon: Radar,
    id: "echo-room",
    name: "Echo Room",
    src: "/arcade/echo-room/index.html"
  },
  {
    accent: "#ff6b8b",
    blurb: "Tic-tac-toe where you only keep three marks. Your fourth erases your oldest.",
    icon: X,
    id: "tic-tac-decay",
    name: "Tic-Tac-Decay",
    src: "/arcade/tic-tac-decay/index.html"
  }
];

export function gameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

// Awards are written by the games' shared award.js into this origin's
// localStorage, so the app can read them back without any API.
export type Tier = "bronze" | "silver" | "gold";
export type AwardRecord = { title?: string; tier: Tier } & Record<string, unknown>;

export const tiers: { colors: [string, string]; id: Tier; label: string }[] = [
  { colors: ["#f3b98a", "#9a5b2c"], id: "bronze", label: "Bronze" },
  { colors: ["#f4f7fb", "#8e9aab"], id: "silver", label: "Silver" },
  { colors: ["#ffe9a3", "#c98d10"], id: "gold", label: "Gold" }
];

const AWARDS_KEY = "miniArcade.awards.v1";

export function earnedAwards(gameId: string): Partial<Record<Tier, AwardRecord>> {
  try {
    const all = JSON.parse(localStorage.getItem(AWARDS_KEY) || "{}") as Record<string, Partial<Record<Tier, AwardRecord>>>;
    return all[gameId] ?? {};
  } catch {
    return {};
  }
}

type AwardApi = { show: (record: AwardRecord, isNew?: boolean) => void };
declare global {
  interface Window { Award?: AwardApi }
}

let awardModule: Promise<AwardApi> | null = null;

// Reuses the games' own share-card modal, so a re-downloaded image is
// identical to the one the game produced.
export function loadAwardModule(): Promise<AwardApi> {
  if (window.Award) return Promise.resolve(window.Award);
  awardModule ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/arcade/shared/award.js";
    script.onload = () => (window.Award ? resolve(window.Award) : reject(new Error("Award module missing")));
    script.onerror = () => {
      awardModule = null;
      reject(new Error("Could not load the award module"));
    };
    document.head.appendChild(script);
  });
  return awardModule;
}
