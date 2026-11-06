// The unified PAUSÉ activity model. Every game, sound, discovery or creative
// prompt is one Activity record; landing previews, the Break Picker, Surprise
// Me and the Daily Drop all read from the same records. Phase 1 keeps them in
// a typed file (catalog.ts); a later phase moves them to the backend without
// changing this shape.

export type PillarId = "play" | "create" | "chill" | "discover" | "community";

// The pillars Surprise Me offers as categories (Community is not a break activity).
export type Category = Exclude<PillarId, "community">;

export type ActivityType = "game" | "audio" | "article" | "guess" | "postcard" | "canvas" | "prompt" | "external";

export const durations = [2, 5, 10, 20] as const;
export type Minutes = (typeof durations)[number];

export type Mood = "calm" | "curious" | "playful" | "focused";
export type Difficulty = "easy" | "medium" | "hard";

// Only "published" activities can be suggested; everything else is either
// being prepared or withdrawn.
export type Status = "draft" | "review" | "published" | "unpublished" | "archived";
export type Access = "guest" | "member";

export type Licence = {
  attribution: string;
  code: string;
  commercialUse: boolean;
  derivatives: boolean;
  name: string;
  shareAlike: boolean;
  url?: string;
};

export type Source = {
  creator: string;
  provider: string;
  retrievedAt?: string;
  url?: string;
};

// How the activity is played or shown. "none" means there is nothing to open
// yet, which keeps an activity out of every suggestion even if published.
export type Renderer =
  | { kind: "arcade-game"; gameId: string; src: string }
  | { kind: "breathing"; exhaleSeconds: number; inhaleSeconds: number }
  | { kind: "soundscape"; preset: "rain" | "waves" }
  | { kind: "doodle"; hidden?: boolean; prompt: string }
  | { kind: "guess-country"; level: "easy" | "any"; rounds: number }
  | { kind: "memory-flash"; rounds: number }
  | { kind: "none" };

export type Activity = {
  access: Access;
  createdAt: string;
  difficulty: Difficulty;
  id: string;
  licence?: Licence;
  maxMinutes: Minutes;
  moods: Mood[];
  pillar: PillarId;
  renderer: Renderer;
  slug: string;
  source?: Source;
  status: Status;
  summary: string;
  tags: string[];
  title: string;
  type: ActivityType;
  updatedAt: string;
};
