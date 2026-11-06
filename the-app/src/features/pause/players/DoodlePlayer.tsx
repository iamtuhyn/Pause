import { Download, Eraser, Eye, EyeOff, Trash2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Stroke = { colour: string; points: Point[]; size: number };

const PAPER = "#fffdf7";
const COLOURS = [
  { label: "Ink", value: "#0e1b4d" },
  { label: "Cobalt", value: "#1e4fd8" },
  { label: "Meadow", value: "#2f8540" },
  { label: "Petal", value: "#d4553b" },
  { label: "Sun", value: "#e0a800" }
];
const SIZES = [{ label: "Thin", value: 3 }, { label: "Thick", value: 10 }];

// A small drawing surface. Strokes are kept as points (in 0–1 coordinates)
// so undo and resizing can redraw them crisply at any size. In hidden mode
// ("The Invisible Artist") strokes are recorded but not drawn until reveal.
export function DoodlePlayer({ hidden = false, prompt }: { hidden?: boolean; prompt: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const [colour, setColour] = useState(COLOURS[0]!.value);
  const [size, setSize] = useState(SIZES[0]!.value);
  const [erasing, setErasing] = useState(false);
  const [revealed, setRevealed] = useState(!hidden);
  const [count, setCount] = useState(0);

  const redraw = useCallback(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const { width, height } = el;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, width, height);
    if (!revealed) return;
    const scale = width / el.clientWidth;
    for (const stroke of strokes.current) {
      ctx.strokeStyle = stroke.colour;
      ctx.lineWidth = stroke.size * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      stroke.points.forEach((p, i) => (i ? ctx.lineTo(p.x * width, p.y * height) : ctx.moveTo(p.x * width, p.y * height)));
      if (stroke.points.length === 1) ctx.lineTo(stroke.points[0]!.x * width + 0.1, stroke.points[0]!.y * height);
      ctx.stroke();
    }
  }, [revealed]);

  // Match the canvas resolution to its displayed size (and the screen's pixel density).
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const ratio = window.devicePixelRatio || 1;
      el.width = Math.round(el.clientWidth * ratio);
      el.height = Math.round(el.clientHeight * ratio);
      redraw();
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [redraw]);

  function point(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  }

  function down(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    current.current = { colour: erasing ? PAPER : colour, points: [point(event)], size: erasing ? 24 : size };
    strokes.current.push(current.current);
    redraw();
  }
  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!current.current) return;
    current.current.points.push(point(event));
    redraw();
  }
  function up() {
    if (current.current) setCount(strokes.current.length);
    current.current = null;
  }

  function undo() {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
  }
  function clear() {
    strokes.current = [];
    setCount(0);
    redraw();
  }
  function save() {
    const el = canvas.current;
    if (!el) return;
    el.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pause-doodle.png";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  return (
    <div className="pause-stage pause-tone-create pause-doodle">
      <p className="pause-doodle-prompt">{prompt}</p>
      <div className="pause-doodle-tools" role="toolbar" aria-label="Drawing tools">
        <span className="pause-doodle-group">
          {COLOURS.map((c) => (
            <button
              key={c.value}
              className={`pause-swatch ${!erasing && colour === c.value ? "on" : ""}`}
              style={{ background: c.value }}
              aria-label={c.label}
              aria-pressed={!erasing && colour === c.value}
              onClick={() => { setColour(c.value); setErasing(false); }}
            />
          ))}
        </span>
        <span className="pause-doodle-group">
          {SIZES.map((s) => (
            <button key={s.value} className={`pause-tool ${!erasing && size === s.value ? "on" : ""}`} aria-pressed={!erasing && size === s.value} onClick={() => { setSize(s.value); setErasing(false); }}>
              {s.label}
            </button>
          ))}
          <button className={`pause-tool ${erasing ? "on" : ""}`} aria-pressed={erasing} onClick={() => setErasing((value) => !value)}>
            <Eraser size={16} aria-hidden="true" /> Eraser
          </button>
        </span>
        <span className="pause-doodle-group">
          <button className="pause-tool" onClick={undo} disabled={!count}><Undo2 size={16} aria-hidden="true" /> Undo</button>
          <button className="pause-tool" onClick={clear} disabled={!count}><Trash2 size={16} aria-hidden="true" /> Clear</button>
        </span>
      </div>
      <div className="pause-doodle-paper">
        <canvas
          ref={canvas}
          aria-label={hidden && !revealed ? "Drawing area. Your lines stay hidden until you reveal them." : "Drawing area"}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
        {hidden && !revealed ? <span className="pause-doodle-hint" aria-hidden="true">{count ? `${count} secret line${count === 1 ? "" : "s"}` : "Go on, draw. It's invisible for now."}</span> : null}
      </div>
      <div className="pause-stage-controls">
        {hidden ? (
          <button className="pause-button pause-button-ink" onClick={() => setRevealed((value) => !value)} disabled={!count}>
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
            {revealed ? "Hide again" : "Reveal it"}
          </button>
        ) : null}
        <button className={`pause-button ${hidden ? "pause-button-quiet" : "pause-button-ink"}`} onClick={save} disabled={!count || !revealed}>
          <Download size={18} /> Save your drawing
        </button>
      </div>
    </div>
  );
}
