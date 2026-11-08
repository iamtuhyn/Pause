import { useId } from "react";

// Small illustrated scenes for the calm activities and Take me somewhere. Each
// is flat SVG with CSS motion (see "Scenes" in pause.css), decorative only:
// the page's text always carries the meaning. A scene moves when it, or a card
// around it, has the class "is-live"; with reduced motion it stays still.

// A sleepy sun behind clouds. In the breathing player the sun rises on the
// in-breath and sinks on the out-breath (phase "in" / "out").
export function SleepySun({ phase }: { phase?: "in" | "out" }) {
  return (
    <svg className={`scene scene-sun${phase ? ` is-${phase}` : ""}`} viewBox="0 0 400 230" aria-hidden="true">
      <g className="scene-sun-body">
        <path d="M60 190 A140 140 0 0 1 340 190 Z" fill="#ffe8b3" />
        <path d="M95 190 A105 105 0 0 1 305 190 Z" fill="#ffd27a" />
        <circle cx="200" cy="190" r="72" fill="#ffa53a" />
        <path d="M172 178 q8 7 16 0 M212 178 q8 7 16 0" fill="none" stroke="#3a2e00" strokeWidth="3" strokeLinecap="round" />
        <path d="M188 198 q12 10 24 0" fill="none" stroke="#3a2e00" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="scene-sun-clouds">
        <g fill="#a8e0da">
          <circle cx="40" cy="190" r="34" /><circle cx="78" cy="172" r="36" /><circle cx="112" cy="196" r="26" />
          <circle cx="292" cy="196" r="26" /><circle cx="326" cy="172" r="36" /><circle cx="364" cy="190" r="34" />
        </g>
        <g fill="#ffffff">
          <circle cx="66" cy="210" r="30" /><circle cx="120" cy="214" r="26" /><circle cx="168" cy="226" r="28" />
          <circle cx="224" cy="226" r="28" /><circle cx="278" cy="214" r="26" /><circle cx="334" cy="210" r="30" />
          <rect x="20" y="214" width="360" height="16" />
        </g>
      </g>
    </svg>
  );
}

// Rain at night on a little house: the drops fall everywhere except on the house,
// and land on its tin roof instead.
const DROPS = Array.from({ length: 34 }, (_, i) => ({ x: (i * 53) % 400, d: ((i * 0.29) % 1.2).toFixed(2), l: 14 + ((i * 7) % 12) }));
export function RainScene() {
  const u = useId().replace(/:/g, "");
  return (
    <svg className="scene scene-rain" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`scene-rain-sky${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2a6b" />
          <stop offset="0.62" stopColor="#7a5c9e" />
          <stop offset="0.75" stopColor="#c27ba0" />
        </linearGradient>
        <mask id={`scene-rain-mask${u}`}>
          <rect width="400" height="300" fill="#fff" />
          <path d="M228 168 L282 124 L336 168 V240 H228 Z" fill="#000" transform="translate(36 0)" />
        </mask>
      </defs>
      <rect width="400" height="300" fill={`url(#scene-rain-sky${u})`} />
      <g fill="#8a6fae" opacity="0.7">
        <circle cx="40" cy="120" r="46" /><circle cx="92" cy="140" r="34" /><circle cx="360" cy="110" r="50" /><circle cx="318" cy="138" r="30" />
      </g>
      <path d="M0 196 C80 170 150 176 210 196 H0 Z" fill="#1a2550" />
      <rect y="194" width="400" height="22" fill="#22346e" />
      <path d="M0 214 C120 204 260 206 400 214 V300 H0 Z" fill="#1f4a4a" />
      <g className="scene-rain-house" transform="translate(36 0)">
        <rect x="236" y="164" width="92" height="74" fill="#d9632b" />
        <path d="M222 170 L282 120 L342 170 Z" fill="#9aa7b8" />
        <path d="M222 170 L282 120 L342 170" fill="none" stroke="#c7d0dc" strokeWidth="4" strokeLinejoin="round" />
        <rect className="scene-rain-window" x="252" y="180" width="26" height="24" rx="2" fill="#ffd84d" />
        <path d="M265 180 V204 M252 192 H278" stroke="#d9632b" strokeWidth="3" />
        <rect x="292" y="196" width="22" height="42" rx="2" fill="#7a2f12" />
      </g>
      <g fill="#2f6b4f">
        <path d="M20 300 C24 250 40 236 56 226 C48 250 46 270 52 300 Z" />
        <path d="M360 300 C364 262 376 246 392 238 C386 262 386 282 390 300 Z" />
      </g>
      <g className="scene-rain-drops" mask={`url(#scene-rain-mask${u})`} stroke="#dfe6ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
        {DROPS.map((drop) => (
          <line key={drop.x} x1={drop.x} x2={drop.x - 3} y1={-30} y2={-30 + drop.l} style={{ animationDelay: `${drop.d}s` }} />
        ))}
      </g>
      <g className="scene-rain-splash" transform="translate(36 0)" fill="none" stroke="#e8eeff" strokeWidth="1.4" strokeLinecap="round">
        <path d="M246 152 q4 -5 8 0" /><path d="M300 140 q4 -5 8 0" style={{ animationDelay: "0.4s" }} /><path d="M270 132 q4 -5 8 0" style={{ animationDelay: "0.8s" }} />
      </g>
    </svg>
  );
}

// Soft, glowing waves on a dark sea.
export function WaveScene() {
  const u = useId().replace(/:/g, "");
  return (
    <svg className="scene scene-waves" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`scene-wave-a${u}`} x1="0" x2="1">
          <stop offset="0" stopColor="#f5c518" /><stop offset="0.3" stopColor="#00d5f5" /><stop offset="0.65" stopColor="#1f6fd8" /><stop offset="1" stopColor="#5b2fa8" />
        </linearGradient>
        <linearGradient id={`scene-wave-b${u}`} x1="0" x2="1">
          <stop offset="0" stopColor="#5b2fa8" /><stop offset="0.4" stopColor="#1f6fd8" /><stop offset="0.8" stopColor="#00d5f5" /><stop offset="1" stopColor="#f5c518" />
        </linearGradient>
        <filter id={`scene-wave-blur${u}`} x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <rect width="400" height="240" fill="#0f0f12" />
      <g filter={`url(#scene-wave-blur${u})`}>
        <path className="scene-wave scene-wave-back" d="M-400 170 C-300 120 -200 120 -100 170 S100 220 200 170 S400 120 500 170 S700 220 800 170 V260 H-400 Z" fill={`url(#scene-wave-b${u})`} opacity="0.55" />
        <path className="scene-wave scene-wave-front" d="M-400 190 C-320 140 -220 130 -120 180 S80 230 180 180 S380 130 480 180 S680 230 800 190 V260 H-400 Z" fill={`url(#scene-wave-a${u})`} />
      </g>
    </svg>
  );
}

// A pencil drawing a wobbly line on paper.
export function DoodleScene({ hidden }: { hidden?: boolean }) {
  return (
    <svg className="scene scene-doodle" viewBox="0 0 400 260" aria-hidden="true">
      <rect x="40" y="24" width="320" height="212" rx="14" fill="#fffdf7" transform="rotate(-2 200 130)" />
      <path className="scene-doodle-line" d="M90 170 C110 90 150 80 170 130 S220 200 240 120 S300 70 310 150" fill="none" stroke="#d4553b" strokeWidth="6" strokeLinecap="round" strokeDasharray={hidden ? "2 14" : "420"} />
      <g className="scene-doodle-pencil">
        <path d="M0 0 L50 -50 L62 -38 L12 12 Z" fill="#ffd84d" />
        <path d="M0 0 L12 12 L-6 18 Z" fill="#6b231a" />
        <path d="M50 -50 L56 -56 Q62 -60 68 -54 Q72 -48 68 -44 L62 -38 Z" fill="#f08aa6" />
      </g>
    </svg>
  );
}

// A small turning globe.
export function GlobeScene() {
  const u = useId().replace(/:/g, "");
  return (
    <svg className="scene scene-globe" viewBox="0 0 400 260" aria-hidden="true">
      <defs><clipPath id={`scene-globe-clip${u}`}><circle cx="200" cy="130" r="96" /></clipPath></defs>
      <circle cx="200" cy="130" r="96" fill="#1e4fd8" />
      <g clipPath={`url(#scene-globe-clip${u})`}>
        <g className="scene-globe-land" fill="#7ccb86">
          {[0, 240].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`}>
              <path d="M70 80 q30 -20 60 0 q10 30 -20 40 q-10 30 -30 10 q-20 -20 -10 -50 Z" />
              <path d="M150 140 q20 -10 40 10 q10 40 -10 60 q-20 -10 -30 -40 Z" />
              <path d="M200 70 q40 -16 80 0 q20 20 0 40 q-30 0 -40 20 q-30 -10 -40 -60 Z" />
              <path d="M260 170 q20 -10 40 0 q0 20 -20 24 q-20 -4 -20 -24 Z" />
            </g>
          ))}
        </g>
      </g>
      <circle cx="200" cy="130" r="96" fill="none" stroke="#0e1b4d" strokeWidth="4" />
      <ellipse cx="200" cy="130" rx="40" ry="96" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M104 130 H296" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}

// A packed little car bouncing down the road: Take me somewhere.
export function RoadTrip() {
  return (
    <svg className="scene scene-trip" viewBox="0 0 400 240" aria-hidden="true">
      <circle cx="320" cy="56" r="26" fill="#fff4c2" />
      <g className="scene-trip-clouds" fill="#e9dcff">
        <path d="M60 60 q10 -18 26 -8 q14 -10 22 8 Z" /><path d="M170 44 q12 -20 30 -8 q16 -12 26 8 Z" /><path d="M250 92 q8 -12 18 -4 q10 -8 16 4 Z" />
      </g>
      <rect y="206" width="400" height="34" fill="#3a4466" />
      <g className="scene-trip-road" stroke="#fff4c2" strokeWidth="4" strokeLinecap="round">
        {[0, 70, 140, 210, 280, 350, 420].map((x) => <path key={x} d={`M${x} 224 h34`} />)}
      </g>
      <g className="scene-trip-car">
        <g className="scene-trip-body">
          <rect x="132" y="70" width="34" height="26" rx="4" fill="#ffc94d" />
          <rect x="166" y="76" width="44" height="20" rx="4" fill="#4b5876" />
          <rect x="210" y="84" width="22" height="12" rx="3" fill="#e0a800" />
          <rect x="116" y="96" width="140" height="6" rx="3" fill="#7a4a2a" />
          <path d="M112 102 H262 L280 140 H96 Z" fill="#ffffff" />
          <path d="M126 106 H178 V138 H118 Z" fill="#bfe6ff" />
          <path d="M184 106 H236 L254 138 H184 Z" fill="#bfe6ff" />
          <circle cx="150" cy="124" r="10" fill="#f2a979" /><path d="M140 120 q10 -16 20 0" fill="#e05a2b" />
          <circle cx="210" cy="124" r="10" fill="#f2a979" /><path d="M200 118 q10 -14 20 0" fill="#1b2340" />
          <rect x="86" y="138" width="214" height="44" rx="14" fill="#ffc531" />
          <rect x="86" y="160" width="214" height="6" fill="#f0a800" />
          <circle cx="292" cy="152" r="6" fill="#fff4c2" />
          <rect x="80" y="150" width="10" height="10" rx="2" fill="#e05a2b" />
        </g>
        {[132, 256].map((cx) => (
          <g key={cx} className="scene-trip-wheel" style={{ transformOrigin: `${cx}px 186px` }}>
            <circle cx={cx} cy="186" r="20" fill="#1b2340" />
            <circle cx={cx} cy="186" r="9" fill="#9aa7b8" />
            <path d={`M${cx - 9} 186 H${cx + 9}`} stroke="#1b2340" strokeWidth="3" />
          </g>
        ))}
      </g>
      <g className="scene-trip-speed" stroke="#7cc8ff" strokeWidth="4" strokeLinecap="round">
        <path d="M40 130 h30" /><path d="M24 160 h40" /><path d="M300 110 h40" />
      </g>
    </svg>
  );
}
