import { MapPin, Shuffle } from "lucide-react";
import { useState } from "react";
import { copy, places } from "./content";

// Discover teaser: a drawn postcard that changes destination on request.
export function TakeMeSomewhere() {
  const [index, setIndex] = useState(0);
  const place = places[index % places.length];
  if (!place) return null;

  return (
    <div className="pause-somewhere">
      <div className="pause-postcard" aria-live="polite">
        <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="320" height="180" fill={place.sky} />
          <ellipse cx="240" cy="40" rx="34" ry="12" fill="#ffffff" />
          <ellipse cx="262" cy="34" rx="22" ry="12" fill="#ffffff" />
          <path d="M0 120 C70 96 150 100 220 116 C260 124 290 112 320 108 V180 H0Z" fill={place.ground} />
          <path d="M0 150 C90 132 200 140 320 136 V180 H0Z" fill="rgba(0,0,0,0.12)" />
          <g>
            {[28, 62, 96, 130].map((x, i) => (
              <g key={x} transform={`translate(${x} ${118 - (i % 2) * 6})`}>
                <rect y="14" width="28" height="30" fill={i % 2 ? "#fff4dc" : "#f6e7c8"} />
                <path d="M-3 16 L14 0 L31 16Z" fill={i % 2 ? "#c2553b" : "#8f3f2e"} />
                <rect x="10" y="26" width="8" height="10" fill="#5a4636" />
              </g>
            ))}
          </g>
        </svg>
        <div className="pause-postcard-text">
          <svg className="pause-stamp" viewBox="0 0 120 90" aria-hidden="true">
            <circle cx="34" cy="46" r="28" fill="none" stroke="#b9b09a" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M6 40 Q20 34 34 40 T62 40 M6 50 Q20 44 34 50 T62 50" fill="none" stroke="#b9b09a" strokeWidth="2" />
            <rect x="58" y="6" width="56" height="70" rx="3" fill="#fffdf7" stroke="#b9b09a" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="64" y="12" width="44" height="58" fill={place.sky} />
            <circle cx="96" cy="26" r="7" fill="#ffd84d" />
            <path d="M64 56 Q80 44 108 52 V70 H64Z" fill={place.ground} />
          </svg>
          <span className="pause-postcard-place"><MapPin size={16} aria-hidden="true" /> {place.country}</span>
          <h3>{place.name}</h3>
          <p>{place.line}</p>
        </div>
      </div>
      <button className="pause-button pause-button-ink" onClick={() => setIndex((value) => value + 1)}>
        <Shuffle size={18} />
        {copy.somewhereCta}
      </button>
    </div>
  );
}
