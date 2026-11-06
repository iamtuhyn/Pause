import { Brush, Compass, Gamepad2, Headphones, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category, PillarId } from "./catalog/activity";

// Prototype copy lives here rather than in the shared dictionary, so the
// prototype stays self-contained until the landing page is approved.
export const copy = {
  brand: "PAUSÉ",
  navPlay: "Play",
  navDiscover: "Discover",
  navCommunity: "Community",
  navOpenApp: "Open the app",
  navSignIn: "Sign in",
  backToPause: "Back to the playground",
  heroKicker: "psst,",
  heroTitle: "Press Esc.",
  heroLead: "Slip out of the day for a few minutes. Your desk won't mind.",
  pickerTime: "How much time do you have?",
  moodOffer: "Something different?",
  moodAsk: "What would feel good?",
  moodAny: "Anything",
  resultLabel: "Here's your pause",
  resultStart: "Dive in",
  resultPreview: "Almost ready. Peek now, play soon.",
  resultAnother: "Show me another",
  emptyNoneTitle: "Nothing here for that yet",
  emptyNoneText: "We're still dreaming this one up. A little more time, or a different mood, opens more.",
  emptyOnlyText: "It's the only one that fits right now. No need to look further.",
  emptyChangeTime: "Pick another time",
  emptyChangeCategory: "Pick another mood",
  dropLabel: "Today's drop",
  dropNext: "A new one tomorrow.",
  pillarsTitle: "Step outside.",
  pillarsAccent: "Stay at your desk.",
  pillarsLead: "Play a little. Make something. Breathe. Wander off. Pass it on. Pick a door.",
  pillarPreview: "Sneak peek",
  playTitle: "Play",
  playLead: "Classic games with one rule bent out of shape. No sign-up, no score to chase. Medals turn up if you play long enough.",
  medalsLabel: "Your medals",
  unwindTitle: "Unwind,",
  unwindAccent: "or make something.",
  unwindLead: "Take one slow breath. Listen to rain on a tin roof. Draw something worth keeping. All made here, all free.",
  somewhereTitle: "Take me somewhere",
  somewhereLead: "Name a country from its outline, or open a postcard from somewhere you could be right now.",
  somewhereCta: "Take me somewhere else",
  communityTitle: "Community",
  communityLead: "PAUSÉ grows with every place, word and little game people bring. What made your break?",
  contributeLabel: "Add yours",
  contributeThanks: "We're almost ready for your ideas. Thanks for wanting to share. The door opens soon.",
  footer: "Made for the five minutes between things.",
  signInTitle: "Welcome back",
  signInLead: "Sign in to carry your medals to any device and step into the full app.",
  signInCta: "Continue with Blocks",
  signInPending: "Taking you to sign in…",
  signInNotConfigured: "Sign-in isn't set up for this app yet.",
  signInNote: "No account? No problem. Every game here plays without signing in."
};

export type Pillar = {
  example: string;
  href?: string;
  icon: LucideIcon;
  id: PillarId;
  line: string;
  title: string;
};

export const pillars: Pillar[] = [
  { example: "Games waiting", href: "#pause-play", icon: Gamepad2, id: "play", line: "Games you know, with one rule bent.", title: "Play" },
  { example: "The Invisible Artist", href: "#pause-unwind", icon: Brush, id: "create", line: "Make something tiny that's only yours.", title: "Create" },
  { example: "Rain on a tin roof", href: "#pause-unwind", icon: Headphones, id: "chill", line: "Let the noise fall away. Breathe, listen, drift.", title: "Chill" },
  { example: "Take me somewhere", href: "#pause-somewhere", icon: Compass, id: "discover", line: "Wander somewhere new in a few minutes.", title: "Discover" },
  { example: "Share a place or a word", href: "#pause-community", icon: Users, id: "community", line: "Bring a place, a word, a game idea.", title: "Community" }
];

// Surprise Me offers the four break pillars as categories.
export const categories: { id: Category; label: string }[] = [
  { id: "play", label: "Play" },
  { id: "chill", label: "Chill" },
  { id: "create", label: "Create" },
  { id: "discover", label: "Discover" }
];

export type Place = { country: string; ground: string; line: string; name: string; sky: string };

export const places: Place[] = [
  { country: "France", ground: "#e39b6b", line: "Half-timbered houses lean over the canals of Little Venice.", name: "Colmar", sky: "#8ec0f5" },
  { country: "Switzerland", ground: "#4fae5a", line: "A deep valley where waterfalls drop from sheer cliffs.", name: "Lauterbrunnen", sky: "#a9cff7" },
  { country: "Italy", ground: "#e8b86c", line: "Pastel houses step down to the water on Lake Como.", name: "Varenna", sky: "#7fb3ee" },
  { country: "Belgium", ground: "#b5705a", line: "Brick gables and quiet canals in a medieval centre.", name: "Bruges", sky: "#b9d3f2" },
  { country: "Germany", ground: "#5d9c4f", line: "A castle on a vineyard hill above the Moselle river.", name: "Cochem", sky: "#9cc6f4" }
];

export const contributions = ["A place you love", "A word worth keeping", "A game idea"];
