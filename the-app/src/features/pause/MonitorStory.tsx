import type { CSSProperties, ReactNode } from "react";

// The hero monitor's screen, told once on load in about nine seconds: a rushed
// workday piles up (design file, spreadsheet, deck, calendar, alerts, the clock
// racing), the Esc key appears and blinks, grows to the centre, a slow cursor
// presses it, and the screen settles on the PAUSÉ hero. It then stays calm;
// nothing loops back to the rush. Pure SVG + CSS (pause.css, "Monitor story"),
// drawn in a 256 × 172 screen. Decorative: the parent scene carries the label.

const ui = { fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "var(--pause-display)" };
const script = { fontFamily: "var(--pause-script)" };
const at = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

const clock = ["9:00", "10:45", "12:30", "15:10", "17:55"];
const toasts = ["Meeting in 2 min", "14 unread messages", "Deadline: today 5pm", "Quick call?"];

function Bar({ x, y, w, fill = "#0E1B4D", o = 1 }: { x: number; y: number; w: number; fill?: string; o?: number }) {
  return <rect x={x} y={y} width={w} height={2.6} rx={1.3} fill={fill} opacity={o} />;
}

function Window({ x, y, w, h, title, delay, children }: { x: number; y: number; w: number; h: number; title: string; delay: number; children: ReactNode }) {
  return (
    <g className="ms-win" style={at(delay)}>
      <rect x={x + 1.5} y={y + 2} width={w} height={h} rx={4} fill="#0E1B4D" opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#FFFFFF" />
      <path d={`M${x} ${y + 4} Q${x} ${y} ${x + 4} ${y} H${x + w - 4} Q${x + w} ${y} ${x + w} ${y + 4} V${y + 8} H${x}Z`} fill="#EEE7D4" />
      <circle cx={x + 5} cy={y + 4} r={1.3} fill="#FF7A8A" />
      <circle cx={x + 9} cy={y + 4} r={1.3} fill="#FFD84D" />
      <circle cx={x + 13} cy={y + 4} r={1.3} fill="#7CCB86" />
      <text x={x + w / 2} y={y + 6} fontSize={4.4} textAnchor="middle" fill="#4A5680" style={ui}>{title}</text>
      {children}
    </g>
  );
}

function Arrow() {
  return <path d="M0 0 L0 13 L3.4 9.8 L6 15.4 L8.2 14.4 L5.7 8.9 L10.2 8.9 Z" fill="#0E1B4D" stroke="#FFFFFF" strokeWidth={1.1} strokeLinejoin="round" />;
}

export function MonitorStory({ x, y }: { x: number; y: number }) {
  return (
    <svg x={x} y={y} width={256} height={172} viewBox="0 0 256 172" className="ms" aria-hidden="true">
      <defs>
        <clipPath id="ms-screen"><rect width="256" height="172" rx="10" /></clipPath>
        <clipPath id="ms-card"><rect x="6" y="20" width="244" height="146" rx="10" /></clipPath>
      </defs>
      <g clipPath="url(#ms-screen)">
        {/* 1. The rush */}
        <g className="ms-rush">
          <rect width="256" height="172" fill="#E4DFD1" />
          <rect width="256" height="11" fill="#0E1B4D" />
          <text x="8" y="7.6" fontSize="5.4" fontWeight="700" fill="#FFFFFF" style={ui}>Monday</text>
          {clock.map((time, i) => (
            <text key={time} className={i === clock.length - 1 ? "ms-clock ms-clock-last" : "ms-clock"} style={{ ...ui, ...at(i * 1.1) }} x="248" y="7.6" fontSize="5.4" fontWeight="700" textAnchor="end" fill="#FFD84D">{time}</text>
          ))}

          <Window x={8} y={16} w={150} h={96} title="Homepage_v12.fig" delay={0.2}>
            <rect x={8} y={24} width={26} height={88} fill="#F4F1E8" />
            {[30, 36, 42, 48, 54, 60].map((ly, i) => <Bar key={ly} x={12} y={ly} w={i % 2 ? 14 : 18} o={0.35} />)}
            <rect x={42} y={30} width={46} height={34} rx={2} fill="#1E4FD8" />
            <rect x={94} y={30} width={30} height={52} rx={2} fill="#FF9BBB" />
            <rect x={42} y={70} width={46} height={30} rx={2} fill="#FFD84D" />
            <rect x={130} y={30} width={22} height={70} rx={2} fill="#3B9A4A" />
            <rect x={92} y={28} width={34} height={56} fill="none" stroke="#1E4FD8" strokeWidth={0.9} strokeDasharray="2 1.4" />
            {[[92, 28], [126, 28], [92, 84], [126, 84]].map(([hx, hy]) => <rect key={`${hx}${hy}`} x={hx! - 1.4} y={hy! - 1.4} width={2.8} height={2.8} fill="#FFFFFF" stroke="#1E4FD8" strokeWidth={0.6} />)}
          </Window>

          <Window x={96} y={34} w={152} h={92} title="Q3_final_FINAL_v7.xlsx" delay={1.0}>
            <rect x={96} y={42} width={152} height={7} fill="#2F8540" />
            {Array.from({ length: 9 }, (_, r) => <line key={`r${r}`} x1={96} x2={248} y1={56 + r * 7.6} y2={56 + r * 7.6} stroke="#DDD6C3" strokeWidth={0.5} />)}
            {Array.from({ length: 6 }, (_, c) => <line key={`c${c}`} y1={49} y2={126} x1={118 + c * 22} x2={118 + c * 22} stroke="#DDD6C3" strokeWidth={0.5} />)}
            {Array.from({ length: 30 }, (_, i) => <Bar key={i} x={121 + (i % 5) * 22} y={51.5 + Math.floor(i / 5) * 7.6} w={8 + ((i * 7) % 9)} o={0.45} />)}
            <rect x={140} y={71} width={22} height={7.6} fill="#FFD84D" opacity={0.7} />
            <rect x={206} y={94} width={22} height={7.6} fill="#FF9BBB" opacity={0.7} />
          </Window>

          <Window x={20} y={64} w={128} h={84} title="Q3 Review.key" delay={1.8}>
            <rect x={24} y={76} width={22} height={14} rx={1} fill="#1E4FD8" opacity={0.5} />
            <rect x={24} y={93} width={22} height={14} rx={1} fill="#1E4FD8" />
            <rect x={24} y={110} width={22} height={14} rx={1} fill="#1E4FD8" opacity={0.5} />
            <rect x={52} y={76} width={90} height={66} rx={2} fill="#1E4FD8" />
            <text x={58} y={92} fontSize={9} fontWeight={800} fill="#FFFFFF" style={ui}>Q3 Review</text>
            <Bar x={58} y={100} w={60} fill="#FFFFFF" o={0.8} />
            <Bar x={58} y={106} w={44} fill="#FFFFFF" o={0.8} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={98 + i * 10} y={136 - (i + 1) * 6} width={6} height={(i + 1) * 6} fill="#FFD84D" />)}
          </Window>

          <Window x={118} y={80} w={130} h={86} title="Calendar · This week" delay={2.6}>
            {["M", "T", "W", "T", "F"].map((day, i) => <text key={i} x={130 + i * 25} y={95} fontSize={4.6} textAnchor="middle" fill="#4A5680" style={ui}>{day}</text>)}
            {[
              [119, 99, 18, "#FF9BBB"], [119, 120, 12, "#1E4FD8"], [119, 136, 20, "#FFD84D"],
              [144, 99, 26, "#1E4FD8"], [144, 128, 14, "#7CCB86"], [144, 145, 16, "#FF9BBB"],
              [169, 99, 12, "#FFD84D"], [169, 114, 30, "#FF9BBB"], [169, 147, 14, "#1E4FD8"],
              [194, 99, 20, "#7CCB86"], [194, 122, 18, "#1E4FD8"], [194, 143, 18, "#FFD84D"],
              [219, 99, 36, "#1E4FD8"], [219, 138, 22, "#FF9BBB"]
            ].map(([bx, by, bh, fill], i) => <rect key={i} x={(bx as number) + 1} y={by} width={22} height={bh} rx={1.5} fill={fill as string} opacity={0.85} />)}
          </Window>

          {toasts.map((text, i) => (
            <g key={text} className="ms-win" style={at(3.0 + i * 0.45)}>
              <rect x={150} y={15 + i * 14} width={100} height={11} rx={5.5} fill="#0E1B4D" />
              <circle cx={157} cy={20.5 + i * 14} r={2} fill={["#FF7A8A", "#FFD84D", "#FF9BBB", "#7CCB86"][i]} />
              <text x={162} y={22.4 + i * 14} fontSize={5} fontWeight={600} fill="#FFFFFF" style={ui}>{text}</text>
            </g>
          ))}

          <g className="ms-cursor-rush"><Arrow /></g>
        </g>

        {/* 2. Esc: blink in the corner, grow to the centre, get pressed */}
        <rect className="ms-dim" width="256" height="172" fill="#0E1B4D" />
        <g className="ms-key">
          <g className="ms-key-blink">
            <g className="ms-key-press">
              <circle className="ms-ripple" r="14" fill="none" stroke="#FFD84D" strokeWidth="1.4" />
              <rect x="-16" y="-8" width="32" height="20" rx="5" fill="#C9A100" />
              <rect x="-16" y="-10" width="32" height="20" rx="5" fill="#FFD84D" />
              <text y="2.8" fontSize="8.6" fontWeight="700" textAnchor="middle" fill="#3A2E00" style={ui}>Esc</text>
            </g>
          </g>
        </g>
        <g className="ms-cursor"><g className="ms-cursor-press"><Arrow /></g></g>

        {/* 3. The pause: the PAUSÉ hero, small */}
        <g className="ms-calm">
          <rect width="256" height="172" fill="#F4F1E8" />
          <rect x="8" y="6" width="13" height="9" rx="2.2" fill="#FFD84D" />
          <text x="14.5" y="12.4" fontSize="4.4" fontWeight="700" textAnchor="middle" fill="#3A2E00" style={ui}>Esc</text>
          <text x="25" y="13" fontSize="6.4" fontWeight="800" fill="#0E1B4D" style={serif}>PAUSÉ</text>
          <rect x="222" y="6" width="26" height="9" rx="4.5" fill="none" stroke="#B9B09A" strokeWidth="0.7" />
          <g clipPath="url(#ms-card)">
            <rect x="6" y="20" width="244" height="146" fill="#1E4FD8" />
            <circle cx="196" cy="70" r="34" fill="#2C5CE6" />
            <g className="ms-cloud" fill="#FFFFFF">
              <ellipse cx="214" cy="52" rx="20" ry="8" />
              <ellipse cx="226" cy="47" rx="13" ry="8.5" />
            </g>
            <path d="M6 138 C60 118 110 120 150 130 C190 140 220 118 250 122 V166 H6Z" fill="#3B9A4A" />
            <path d="M6 152 C70 140 130 144 180 150 C215 154 235 146 250 147 V166 H6Z" fill="#2F8540" />
            <g transform="translate(186 112)">
              <rect width="30" height="24" rx="3" fill="#EEE7D4" />
              <rect x="2.5" y="2.5" width="25" height="16" rx="1.5" fill="#8EC0F5" />
              <path d="M2.5 14 C10 11 18 11 27.5 13 V18.5 H2.5Z" fill="#4FAE5A" />
              <rect x="11" y="24" width="8" height="4" fill="#D9D0B8" />
            </g>
          </g>
          <g className="ms-calm-copy">
            <text x="17" y="45" fontSize="14" fill="#FFFFFF" transform="rotate(-6 17 45)" style={script}>psst,</text>
            <text x="15" y="68" fontSize="25" fontWeight="800" letterSpacing="-0.8" fill="#FFFFFF" style={serif}>press esc.</text>
            <Bar x={16} y={76} w={78} fill="#DCE6FF" o={0.85} />
            <Bar x={16} y={81.5} w={54} fill="#DCE6FF" o={0.85} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={16 + i * 21} y={92} width={18} height={8} rx={4} fill={i === 1 ? "#FFFFFF" : "none"} stroke="#FFFFFF" strokeWidth={0.7} opacity={0.9} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
