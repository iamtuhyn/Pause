import { Brush, Compass, Gamepad2, Headphones, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category, PillarId } from "./catalog/activity";

// Prototype copy lives here rather than in the shared dictionary, so the
// prototype stays self-contained until the landing page is approved.
export const copy = {
  brand: "Descape",
  navPlay: "Play",
  navDiscover: "Discover",
  navCommunity: "Contribute",
  navOpenApp: "Open the app",
  navSignIn: "Sign in",
  backNav: "Back",
  closePopup: "Close",
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
  somewhereLead: "Pick a continent, a kind of trip and a place. Then read what is worth knowing, free.",
  somewhereEyebrow: "Four questions · about 2 min",
  somewhereInvite: "Not sure where you want to be? Let us pick a corner of the world for you.",
  somewhereCta: "Take me somewhere",
  communityTitle: "Contribute",
  communityLead: "Descape grows with every place, word and little game people bring. What made your break?",
  contributeLabel: "Add yours",
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
  { example: "Share a place or a word", href: "/pause/sign-in?returnTo=%2Fgames", icon: Users, id: "community", line: "Bring a place, a word, a game idea.", title: "Contribute" }
];

// Surprise Me offers the four break pillars as categories.
export const categories: { id: Category; label: string }[] = [
  { id: "play", label: "Play" },
  { id: "chill", label: "Chill" },
  { id: "create", label: "Create" },
  { id: "discover", label: "Discover" }
];

export const contributions = ["A place you love", "A word worth keeping", "A game idea"];
