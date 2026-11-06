import type { Activity, Category, Licence, Minutes, PillarId } from "./activity";

const PAUSE_ORIGINAL: Licence = {
  attribution: "PAUSÉ",
  code: "pause-original",
  commercialUse: true,
  derivatives: false,
  name: "Original PAUSÉ work",
  shareAlike: false
};
const PAUSE_SOURCE = { creator: "PAUSÉ", provider: "pause" };
const NATURAL_EARTH: Licence = {
  attribution: "Made with Natural Earth",
  code: "public-domain",
  commercialUse: true,
  derivatives: true,
  name: "Public domain (Natural Earth)",
  shareAlike: false,
  url: "https://www.naturalearthdata.com/about/terms-of-use/"
};
const NATURAL_EARTH_SOURCE = {
  creator: "Natural Earth",
  provider: "natural-earth",
  retrievedAt: "2026-11-06",
  url: "https://github.com/nvkelso/natural-earth-vector (ne_50m_admin_0_countries)"
};
const DATE = "2026-11-06";

// Common defaults for an entry that is planned but has no content yet.
function draft(fields: Pick<Activity, "id" | "maxMinutes" | "moods" | "pillar" | "summary" | "title" | "type">): Activity {
  return {
    ...fields,
    access: "guest",
    createdAt: DATE,
    difficulty: "easy",
    renderer: { kind: "none" },
    slug: fields.id,
    status: "draft",
    tags: [],
    updatedAt: DATE
  };
}

// An original PAUSÉ experience that opens in the activity player.
function original(fields: Pick<Activity, "id" | "maxMinutes" | "moods" | "pillar" | "renderer" | "summary" | "tags" | "title" | "type">): Activity {
  return {
    ...fields,
    access: "guest",
    createdAt: DATE,
    difficulty: "easy",
    licence: PAUSE_ORIGINAL,
    slug: fields.id,
    source: PAUSE_SOURCE,
    status: "published",
    updatedAt: DATE
  };
}

function originalGame(fields: Pick<Activity, "difficulty" | "id" | "maxMinutes" | "moods" | "summary" | "tags" | "title">): Activity {
  return {
    ...fields,
    access: "guest",
    createdAt: DATE,
    licence: PAUSE_ORIGINAL,
    pillar: "play",
    renderer: { kind: "arcade-game", gameId: fields.id, src: `/arcade/${fields.id}/index.html` },
    slug: fields.id,
    source: PAUSE_SOURCE,
    status: "published",
    type: "game",
    updatedAt: DATE
  };
}

export const ACTIVITIES: Activity[] = [
  // Published: genuinely playable today.
  originalGame({ difficulty: "medium", id: "tic-tac-decay", maxMinutes: 5, moods: ["playful", "focused"], summary: "Tic-tac-toe with a short memory. Your fourth mark wipes out your oldest.", tags: ["strategy", "classic"], title: "Tic-Tac-Decay" }),
  originalGame({ difficulty: "medium", id: "time-loop", maxMinutes: 5, moods: ["playful", "focused"], summary: "Ten seconds a loop. Your past selves become your ladder.", tags: ["puzzle", "platformer"], title: "Time Loop" }),
  originalGame({ difficulty: "medium", id: "gravity-typist", maxMinutes: 5, moods: ["focused", "playful"], summary: "Words rain down and pile up. Type them away. Every typo adds a stone.", tags: ["typing", "physics"], title: "Gravity Typist" }),
  originalGame({ difficulty: "medium", id: "reverse-snake", maxMinutes: 5, moods: ["playful", "focused"], summary: "You're the apple this time. Outrun a snake that learns, or trick it into biting its own tail.", tags: ["arcade", "chase"], title: "Reverse Snake" }),
  originalGame({ difficulty: "medium", id: "mouse-shy-maze", maxMinutes: 10, moods: ["calm", "focused"], summary: "The walls are shy. Move gently and they'll part for you.", tags: ["maze", "pointer"], title: "Mouse-Shy Maze" }),
  originalGame({ difficulty: "easy", id: "tilt-billiards", maxMinutes: 5, moods: ["playful", "calm"], summary: "No cue. Tip the whole table and sink the balls in order.", tags: ["physics", "billiards"], title: "Tilt Billiards" }),
  originalGame({ difficulty: "hard", id: "echo-room", maxMinutes: 10, moods: ["curious", "focused"], summary: "Lights out. Ping, listen and feel your way to the exit.", tags: ["maze", "sound"], title: "Echo Room" }),

  original({ id: "one-second-memory", maxMinutes: 2, moods: ["focused", "playful"], pillar: "play", renderer: { kind: "memory-flash", rounds: 5 }, summary: "One second to look. Then something changes. Can you spot it?", tags: ["memory", "perception"], title: "One-Second Memory", type: "game" }),

  // Chill and Create: original, generated in the browser, so nothing to license.
  original({ id: "breath", maxMinutes: 2, moods: ["calm"], pillar: "chill", renderer: { kind: "breathing", exhaleSeconds: 6, inhaleSeconds: 4 }, summary: "In for four, out for six. Two minutes that are just yours.", tags: ["breathing", "reset"], title: "One slow breath", type: "audio" }),
  original({ id: "rain", maxMinutes: 5, moods: ["calm", "focused"], pillar: "chill", renderer: { kind: "soundscape", preset: "rain" }, summary: "Soft rain drumming on a tin roof. Five minutes to let it all wash past.", tags: ["sound", "rain"], title: "Rain on a tin roof", type: "audio" }),
  original({ id: "waves", maxMinutes: 10, moods: ["calm", "focused"], pillar: "chill", renderer: { kind: "soundscape", preset: "waves" }, summary: "Waves roll in and out as the light fades.", tags: ["sound", "ocean"], title: "Waves at dusk", type: "audio" }),
  original({ id: "other-hand", maxMinutes: 2, moods: ["playful", "calm"], pillar: "create", renderer: { kind: "doodle", prompt: "Grab the nearest object and draw it with the hand you don't write with. Wobbly is the point." }, summary: "Sketch your mug with the hand you don't write with. Wobbly is the point.", tags: ["drawing", "prompt"], title: "Draw with your other hand", type: "canvas" }),
  original({ id: "artist", maxMinutes: 5, moods: ["calm", "playful"], pillar: "create", renderer: { kind: "doodle", hidden: true, prompt: "Picture a room you loved as a kid. Draw it from memory. Your lines stay invisible until you reveal them." }, summary: "Draw a room from memory, blind. Your lines stay hidden until the big reveal.", tags: ["drawing", "memory"], title: "The Invisible Artist", type: "canvas" }),

  // Discover: country outlines from Natural Earth (public domain), drawn and quizzed here.
  {
    access: "guest", createdAt: DATE, difficulty: "easy", id: "guess-country", licence: NATURAL_EARTH, maxMinutes: 2, moods: ["curious", "playful"],
    pillar: "discover", renderer: { kind: "guess-country", level: "easy", rounds: 5 }, slug: "guess-country", source: NATURAL_EARTH_SOURCE, status: "published",
    summary: "Five outlines, four names each. Trust your gut, then see where it is.", tags: ["geography", "guess"], title: "Guess the country", type: "guess", updatedAt: DATE
  },
  {
    access: "guest", createdAt: DATE, difficulty: "hard", id: "outline-expert", licence: NATURAL_EARTH, maxMinutes: 5, moods: ["curious", "focused"],
    pillar: "discover", renderer: { kind: "guess-country", level: "any", rounds: 10 }, slug: "outline-expert", source: NATURAL_EARTH_SOURCE, status: "published",
    summary: "Ten outlines, tricky ones included. Think you know the map?", tags: ["geography", "guess"], title: "Outline expert", type: "guess", updatedAt: DATE
  },

  // Drafts: planned experiences with no content yet. Shown only as previews.
  draft({ id: "quote", maxMinutes: 2, moods: ["calm", "curious"], pillar: "chill", summary: "One line from the Quote Garden to carry into the afternoon.", title: "A line to keep", type: "article" }),
  draft({ id: "word", maxMinutes: 2, moods: ["curious"], pillar: "discover", summary: "Hygge, and why Danish has a word for that cosy feeling.", title: "An untranslatable word", type: "article" }),
  draft({ id: "wave", maxMinutes: 2, moods: ["curious", "focused"], pillar: "discover", summary: "Find Mount Fuji, tiny in the distance, in Hokusai's Great Wave.", title: "Spot the detail", type: "guess" }),
  draft({ id: "postcard", maxMinutes: 5, moods: ["curious", "calm"], pillar: "discover", summary: "A postcard from a canal town in Alsace, with one story behind it.", title: "Postcard from Colmar", type: "postcard" }),
  draft({ id: "valley", maxMinutes: 20, moods: ["curious", "calm"], pillar: "discover", summary: "A slow walk through Lauterbrunnen's valley of waterfalls.", title: "Wander a valley", type: "article" }),
  draft({ id: "sketch-sound", maxMinutes: 10, moods: ["playful", "calm"], pillar: "create", summary: "Listen to a short piece of music and draw its shape.", title: "Sketch a sound", type: "canvas" }),
];

// ---------- Reading the catalogue ----------
// Everything outside this file goes through these functions, so swapping the
// data source later (backend, cached public file) touches only this module.

// Ready to open: published, licensed, and something to render.
export function isPlayable(activity: Activity): boolean {
  return activity.status === "published" && !!activity.licence && activity.renderer.kind !== "none";
}

export function activityById(id: string, list: Activity[] = ACTIVITIES): Activity | undefined {
  return list.find((a) => a.id === id);
}

export function playableActivities(list: Activity[] = ACTIVITIES): Activity[] {
  return list.filter(isPlayable);
}

export function previewsFor(pillar: PillarId, list: Activity[] = ACTIVITIES): Activity[] {
  return list.filter((a) => a.pillar === pillar && !isPlayable(a));
}

export function playableCount(pillar: PillarId, list: Activity[] = ACTIVITIES): number {
  return list.filter((a) => a.pillar === pillar && isPlayable(a)).length;
}

export type Suggestion = { activity?: Activity; eligible: number };

// Strict: the chosen time is an upper limit and, when a category is given, it
// must match (no category means any). There is no fallback outside those constraints. "Try another" (avoid) only
// returns a different eligible activity; with none left, activity is
// undefined and eligible says whether anything fits at all.
export function pickSuggestion(maxMinutes: Minutes, category: Category | undefined, avoid?: string, list: Activity[] = ACTIVITIES): Suggestion {
  const pool = playableActivities(list).filter((a) => (!category || a.pillar === category) && a.maxMinutes <= maxMinutes);
  const fresh = pool.filter((a) => a.id !== avoid);
  return { activity: fresh[Math.floor(Math.random() * fresh.length)], eligible: pool.length };
}

// One playable activity per local calendar day, stable across reloads.
export function dailyDrop(date: Date, list: Activity[] = ACTIVITIES): Activity | undefined {
  const pool = playableActivities(list).sort((a, b) => a.id.localeCompare(b.id));
  const day = Math.floor((date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000);
  return pool[day % pool.length];
}

// Catalogue rules a record must meet; returns the problems found.
export function validateCatalog(list: Activity[] = ACTIVITIES): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const a of list) {
    if (ids.has(a.id)) problems.push(`${a.id}: duplicate id`);
    ids.add(a.id);
    if (a.status === "published" && !a.licence) problems.push(`${a.id}: published without a licence`);
    if (a.status === "published" && !a.source) problems.push(`${a.id}: published without a source`);
    if (a.status === "published" && a.renderer.kind === "none") problems.push(`${a.id}: published with nothing to open`);
    if (!a.moods.length) problems.push(`${a.id}: no moods`);
  }
  return problems;
}
