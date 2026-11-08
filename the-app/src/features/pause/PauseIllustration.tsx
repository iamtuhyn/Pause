import { MonitorStory } from "./MonitorStory";

// Hand-drawn scene for the hero: an old monitor on a hill whose screen plays
// a short story (a rushed workday, then Esc, then Descape). Flat shapes only, no external art.
export function PauseIllustration() {
  return (
    <svg className="pause-scene" viewBox="0 0 1200 520" preserveAspectRatio="xMaxYMax slice" role="img" aria-labelledby="pause-scene-title">
      <title id="pause-scene-title">An old computer monitor on a grassy hill. On its screen a rushed workday of design files, spreadsheets, slides and calendar alerts piles up, until a yellow Esc key is pressed and the calm Descape page appears.</title>

      <circle cx="930" cy="260" r="140" fill="#2C5CE6" />
      <circle cx="930" cy="260" r="190" fill="none" stroke="#2C5CE6" strokeWidth="2" />

      <g className="pause-cloud pause-cloud-a" fill="#FFFFFF">
        <ellipse cx="1040" cy="96" rx="70" ry="28" />
        <ellipse cx="1085" cy="80" rx="48" ry="30" />
        <ellipse cx="995" cy="104" rx="40" ry="20" />
      </g>
      <g className="pause-cloud pause-cloud-b" fill="#FFFFFF">
        <ellipse cx="700" cy="250" rx="44" ry="16" />
        <ellipse cx="726" cy="240" rx="28" ry="18" />
      </g>

      <path d="M0 420 C180 330 360 330 560 390 C760 450 940 330 1200 360 V520 H0Z" fill="#3B9A4A" />
      <path d="M0 470 C240 410 470 430 700 462 C900 490 1060 440 1200 452 V520 H0Z" fill="#2F8540" />

      <g transform="translate(770 196)">
        <rect x="118" y="230" width="64" height="26" fill="#D9D0B8" />
        <rect x="88" y="252" width="124" height="14" rx="4" fill="#CFC5AA" />
        <rect width="300" height="236" rx="18" fill="#EEE7D4" />
        <rect x="22" y="20" width="256" height="172" rx="10" fill="#1E4FD8" />
        <MonitorStory x={22} y={20} />
        <rect x="236" y="206" width="28" height="8" rx="2" fill="#CFC5AA" />
        <circle cx="40" cy="210" r="4" fill="#7CCB86" />
      </g>

      <g fill="#FF9BBB">
        <circle cx="720" cy="452" r="5" />
        <circle cx="1110" cy="420" r="5" />
        <circle cx="420" cy="476" r="4" />
        <circle cx="160" cy="490" r="5" />
      </g>
      <g fill="#FFD84D">
        <circle cx="742" cy="466" r="4" />
        <circle cx="1140" cy="436" r="4" />
        <circle cx="300" cy="486" r="4" />
      </g>
      <g fill="#FFFFFF">
        <circle cx="690" cy="470" r="3" />
        <circle cx="1080" cy="444" r="3" />
        <circle cx="560" cy="494" r="3" />
      </g>
    </svg>
  );
}
