// Miniature scenes drawn from each game, so a card shows what you'll play
// rather than an icon. Decorative: the card's heading names the game.
export function GamePreview({ id }: { id: string }) {
  if (id === "gravity-typist") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#0b0d14" />
        <path d="M0 20 H160" stroke="#ff5d73" strokeDasharray="5 5" strokeWidth="1.2" opacity="0.6" />
        <rect y="90" width="160" height="10" fill="#1b2030" />
        <rect x="18" y="74" width="46" height="16" rx="5" fill="#a7f3d0" />
        <rect x="66" y="74" width="28" height="16" rx="5" fill="#fca5a5" />
        <rect x="96" y="76" width="14" height="14" rx="4" fill="#4b5163" />
        <rect x="30" y="56" width="56" height="16" rx="5" fill="#7cc8ff" />
        <rect x="104" y="34" width="40" height="16" rx="5" fill="#ffd166" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="58" y="26" width="34" height="16" rx="5" fill="#c4b5fd" />
      </svg>
    );
  }
  if (id === "reverse-snake") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#0f1a14" />
        <path d="M20 78 H70 V40 H112" stroke="#7cffb2" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
        <circle cx="112" cy="40" r="7" fill="#7cffb2" />
        <circle cx="134" cy="56" r="8" fill="#ff5d73" />
        <ellipse cx="137" cy="46" rx="4" ry="2" fill="#7cffb2" transform="rotate(-30 137 46)" />
        <rect x="40" y="18" width="14" height="12" rx="4" fill="#3b4252" />
      </svg>
    );
  }
  if (id === "mouse-shy-maze") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#120d0b" />
        <path d="M14 12 H146 V88 H14 Z M54 12 V58 M54 58 H96 M96 36 V88 M120 12 V60" stroke="#ff9f6b" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M100 58 H118" stroke="#ffd166" strokeWidth="5" strokeLinecap="round" />
        <circle cx="34" cy="34" r="16" fill="none" stroke="#ff9f6b" strokeDasharray="3 4" opacity="0.5" />
        <circle cx="34" cy="34" r="6" fill="#ffffff" />
        <circle cx="132" cy="76" r="7" fill="#7cffb2" />
      </svg>
    );
  }
  if (id === "tilt-billiards") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#5a3a24" />
        <rect x="10" y="10" width="140" height="80" fill="#2f8f5a" />
        {[[10, 10], [80, 8], [150, 10], [10, 90], [80, 92], [150, 90]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#05070a" />)}
        <path d="M70 50 L104 66" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
        <circle cx="112" cy="70" r="6" fill="#ffd166" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="52" cy="38" r="6" fill="#1e4fd8" />
        <circle cx="88" cy="30" r="6" fill="#ff5d73" />
      </svg>
    );
  }
  if (id === "one-second-memory") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#fff4c2" />
        <circle cx="34" cy="28" r="10" fill="#1e4fd8" />
        <rect x="66" y="18" width="20" height="20" rx="3" fill="#2f8540" />
        <path d="M120 16 L132 38 H108 Z" fill="#d4553b" />
        <path d="M34 60 L46 72 L34 84 L22 72 Z" fill="#0e1b4d" />
        <path d="M76 58 L80 67 L90 67.5 L82 74 L85 84 L76 78 L67 84 L70 74 L62 67.5 L72 67 Z" fill="#e0a800" />
        <circle cx="120" cy="72" r="13" fill="none" stroke="#0e1b4d" strokeWidth="2.5" strokeDasharray="4 3" />
        <circle cx="120" cy="72" r="8" fill="#d4553b" />
      </svg>
    );
  }
  if (id === "time-loop") {
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#0a1024" />
        <rect x="10" y="8" width="140" height="4" rx="2" fill="#1b2747" />
        <rect x="10" y="8" width="92" height="4" rx="2" fill="#6ee7ff" />
        <rect y="84" width="160" height="16" fill="#172038" />
        <rect y="84" width="160" height="2" fill="#34457a" />
        <rect x="78" y="54" width="10" height="30" fill="#172038" />
        <rect x="78" y="54" width="10" height="2" fill="#34457a" />
        <rect x="64" y="70" width="12" height="14" rx="2" fill="rgba(110,231,255,0.3)" stroke="#6ee7ff" />
        <rect x="64" y="55" width="12" height="14" rx="2" fill="rgba(110,231,255,0.3)" stroke="#6ee7ff" />
        <rect x="66" y="38" width="12" height="15" rx="2" fill="#ffffff" />
        <ellipse cx="138" cy="72" rx="6" ry="12" fill="none" stroke="#7cffb2" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "echo-room") {
    const dots = [];
    for (let i = 0; i < 26; i++) dots.push(<circle key={`a${i}`} cx={20 + i * 5} cy={22} r="1.2" fill="#c4b5fd" />);
    for (let i = 0; i < 12; i++) dots.push(<circle key={`b${i}`} cx={100} cy={30 + i * 5} r="1.2" fill="#c4b5fd" />);
    for (let i = 0; i < 14; i++) dots.push(<circle key={`c${i}`} cx={30 + i * 5} cy={80} r="1.2" fill="#c4b5fd" />);
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect width="160" height="100" fill="#000000" />
        <circle cx="60" cy="52" r="34" fill="none" stroke="rgba(167,139,250,0.35)" />
        <circle cx="60" cy="52" r="18" fill="none" stroke="rgba(167,139,250,0.2)" />
        {dots}
        <circle cx="132" cy="56" r="2" fill="#7cffb2" />
        <circle cx="136" cy="60" r="2" fill="#7cffb2" />
        <circle cx="122" cy="34" r="2.4" fill="#ff5d73" />
        <circle cx="60" cy="52" r="4" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <rect width="160" height="100" fill="#10131d" />
      <g stroke="#2a3045" strokeWidth="2">
        <line x1="66" y1="14" x2="66" y2="86" />
        <line x1="94" y1="14" x2="94" y2="86" />
        <line x1="38" y1="38" x2="122" y2="38" />
        <line x1="38" y1="62" x2="122" y2="62" />
      </g>
      <g stroke="#ff6b8b" strokeWidth="4" strokeLinecap="round">
        <path d="M45 19 L59 33 M59 19 L45 33" />
        <path d="M73 67 L87 81 M87 67 L73 81" />
        <path d="M101 43 L115 57 M115 43 L101 57" opacity="0.35" />
      </g>
      <g stroke="#6ee7ff" strokeWidth="4" fill="none">
        <circle cx="80" cy="26" r="8" />
        <circle cx="52" cy="74" r="8" />
      </g>
      <rect x="99" y="41" width="18" height="18" rx="4" fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="3 3" />
    </svg>
  );
}
