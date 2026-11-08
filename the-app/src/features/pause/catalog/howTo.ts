import {
  Brain, Clock3, Ear, EyeOff, Eye, Flag, Ghost, Globe2, Hand, Headphones, Keyboard, Landmark, Layers, Map, MousePointer2, Move, Pencil, RotateCcw,
  Sparkles, Target, Timer, Trophy, Volume2, Wind, Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// How to play, per activity: one goal line, three or four rules with an icon
// each, and the controls. Shown on the game's start screen before play.
export type HowTo = {
  controls: string[];
  goal: string;
  rules: { icon: LucideIcon; text: string }[];
  start: string; // the start button label
};

export const HOW_TO: Record<string, HowTo> = {
  "tic-tac-decay": {
    goal: "Get three in a row before your marks fade away.",
    rules: [
      { icon: Layers, text: "You can only have three marks on the board." },
      { icon: RotateCcw, text: "Place a fourth and your oldest one disappears." },
      { icon: Eye, text: "The mark about to go fades and gets a dashed outline." },
      { icon: Trophy, text: "First to three wins takes the match." }
    ],
    controls: ["Click a square", "Play the computer or a friend"],
    start: "Start a match"
  },
  "time-loop": {
    goal: "Reach the exit with help from your past selves.",
    rules: [
      { icon: Timer, text: "Each loop lasts ten seconds, then time rewinds." },
      { icon: Ghost, text: "Your last run replays as a ghost you can stand on." },
      { icon: Layers, text: "Stack ghosts to climb what one jump can't reach." },
      { icon: RotateCcw, text: "Press Z to undo a ghost, R to end a loop early." }
    ],
    controls: ["← → move", "↑ or Space jump"],
    start: "Start the loop"
  },
  "gravity-typist": {
    goal: "Keep the pile of words below the line.",
    rules: [
      { icon: Keyboard, text: "Type any word on screen. No need to press Enter." },
      { icon: Zap, text: "Every typo drops a stone on the pile." },
      { icon: Sparkles, text: "Long words (7+ letters) knock their neighbours off." },
      { icon: Target, text: "Esc clears what you've typed so far." }
    ],
    controls: ["Keyboard"],
    start: "Start typing"
  },
  "reverse-snake": {
    goal: "You're the apple. Stay out of reach for 25 seconds.",
    rules: [
      { icon: Move, text: "Run with the arrow keys or WASD. Hold to keep moving." },
      { icon: Brain, text: "The snake learns a little every round." },
      { icon: Sparkles, text: "Lead it into its own coils to win early." },
      { icon: Clock3, text: "Survive the clock and the round is yours." }
    ],
    controls: ["Arrow keys or WASD", "Swipe on a phone"],
    start: "Start rolling"
  },
  "mouse-shy-maze": {
    goal: "Guide the glow to the green exit, gently.",
    rules: [
      { icon: MousePointer2, text: "Hover over the glow to pick it up. No clicking." },
      { icon: Wind, text: "The walls shy away from your pointer." },
      { icon: Hand, text: "Bumps are counted, never punished." },
      { icon: Clock3, text: "There's no clock. Slow and steady wins gold." }
    ],
    controls: ["Mouse or touch", "Needs a pointer"],
    start: "Begin"
  },
  "tilt-billiards": {
    goal: "Tip the table and pot the balls in order: 1, 2, 3.",
    rules: [
      { icon: Move, text: "Point where the balls should roll. Further out is steeper." },
      { icon: Target, text: "Pot them in order. A wrong one wanders back." },
      { icon: RotateCcw, text: "Press R to reset the table." },
      { icon: Clock3, text: "Take your time. There's no cue and no clock." }
    ],
    controls: ["Mouse", "Arrow keys", "Phone tilt"],
    start: "Start tilting"
  },
  "echo-room": {
    goal: "Find the exit in the dark, by ear.",
    rules: [
      { icon: Volume2, text: "Ping and the walls glow for a moment." },
      { icon: Headphones, text: "Follow the chime. It grows louder near the exit." },
      { icon: Ear, text: "From room 3, red listeners drift toward any noise." },
      { icon: EyeOff, text: "Bumping a wall shows a little of it, but it's loud." }
    ],
    controls: ["WASD or arrows move", "Space ping", "M mute"],
    start: "Enter the dark"
  },
  "one-second-memory": {
    goal: "Spot what changed after one quick look.",
    rules: [
      { icon: Eye, text: "You get one second to look at the shapes." },
      { icon: Zap, text: "Blink. One shape changes." },
      { icon: Target, text: "Pick the one that changed. No rush." },
      { icon: Trophy, text: "Five rounds. See how sharp you are." }
    ],
    controls: ["Click or tap"],
    start: "Let's play"
  },
  breath: {
    goal: "Two minutes of slow breathing, guided.",
    rules: [
      { icon: Wind, text: "Breathe in for four as the sun rises." },
      { icon: Wind, text: "Breathe out for six as it sinks." },
      { icon: Clock3, text: "About twelve breaths. Pause any time." }
    ],
    controls: ["Sit back", "Eyes soft"],
    start: "Begin breathing"
  },
  rain: {
    goal: "Five minutes of rain, while you stay dry.",
    rules: [
      { icon: Headphones, text: "Best with headphones." },
      { icon: Volume2, text: "Set the volume where it feels right." },
      { icon: Clock3, text: "The rain fades out on its own at the end." }
    ],
    controls: ["Play and pause", "Volume"],
    start: "Let it rain"
  },
  waves: {
    goal: "Ten minutes of waves as the light goes down.",
    rules: [
      { icon: Headphones, text: "Best with headphones." },
      { icon: Volume2, text: "Set the volume where it feels right." },
      { icon: Clock3, text: "The sea fades out on its own at the end." }
    ],
    controls: ["Play and pause", "Volume"],
    start: "Roll in"
  },
  "other-hand": {
    goal: "Draw the nearest object with your other hand.",
    rules: [
      { icon: Hand, text: "Use the hand you don't write with." },
      { icon: Pencil, text: "Pick a colour and a brush size." },
      { icon: Sparkles, text: "Wobbly is the point. Save it if you like it." }
    ],
    controls: ["Mouse, trackpad or finger"],
    start: "Grab the pen"
  },
  artist: {
    goal: "Draw a room from memory, without seeing your lines.",
    rules: [
      { icon: EyeOff, text: "Your lines stay invisible while you draw." },
      { icon: Brain, text: "Picture a room you loved as a kid." },
      { icon: Eye, text: "Press reveal when you're done. Then laugh." }
    ],
    controls: ["Mouse, trackpad or finger"],
    start: "Draw blind"
  },
  "guess-country": {
    goal: "Five quick questions about the world.",
    rules: [
      { icon: Globe2, text: "Pick a region, or keep it wide open." },
      { icon: Landmark, text: "Capitals, landmarks and languages." },
      { icon: Flag, text: "Plus a flag or two." },
      { icon: Sparkles, text: "Every answer comes with a little fact." }
    ],
    controls: ["Click or tap", "Keyboard works too"],
    start: "Let's go"
  },
  "outline-expert": {
    goal: "Ten country outlines. Name them all.",
    rules: [
      { icon: Map, text: "Each round shows one country's shape." },
      { icon: Globe2, text: "Choose a region, or the whole world." },
      { icon: Target, text: "Four options. Tricky ones included." },
      { icon: Trophy, text: "Ten out of ten makes you a walking atlas." }
    ],
    controls: ["Click or tap", "Keyboard works too"],
    start: "Let's go"
  }
};
