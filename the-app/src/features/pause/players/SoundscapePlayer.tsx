import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Preset = "rain" | "waves";

// Soundscapes are generated live with the Web Audio API: no recordings, so
// there is nothing to license and nothing to download.
type Engine = { ctx: AudioContext; master: GainNode; stop: () => void };

function noiseBuffer(ctx: AudioContext, colour: "pink" | "brown", seconds = 4): AudioBuffer {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, brown = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (colour === "brown") {
        brown = (brown + 0.02 * white) / 1.02;
        data[i] = brown * 3.5;
      } else {
        // Paul Kellet's refined pink-noise filter.
        b0 = 0.99886 * b0 + white * 0.0555179; b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852; b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522; b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
  }
  return buffer;
}

function loop(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function filter(ctx: AudioContext, type: BiquadFilterType, frequency: number, q = 0.7): BiquadFilterNode {
  const node = ctx.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  return node;
}

function startRain(ctx: AudioContext, out: AudioNode): () => void {
  const bed = loop(ctx, noiseBuffer(ctx, "pink"));
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.5;
  bed.connect(filter(ctx, "highpass", 450)).connect(filter(ctx, "lowpass", 5200)).connect(bedGain).connect(out);
  bed.start();

  // Drops on the tin roof: short, bright, randomly panned taps.
  const drop = noiseBuffer(ctx, "pink", 0.08);
  let next = ctx.currentTime;
  const timer = window.setInterval(() => {
    while (next < ctx.currentTime + 0.25) {
      next += 0.03 + Math.random() * 0.16;
      const tap = ctx.createBufferSource();
      tap.buffer = drop;
      const tone = filter(ctx, "bandpass", 2400 + Math.random() * 2600, 6);
      const gain = ctx.createGain();
      const level = 0.04 + Math.random() * 0.12;
      gain.gain.setValueAtTime(level, next);
      gain.gain.exponentialRampToValueAtTime(0.0001, next + 0.07);
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 1.6 - 0.8;
      tap.connect(tone).connect(gain).connect(pan).connect(out);
      tap.start(next);
      tap.stop(next + 0.08);
    }
  }, 100);

  return () => {
    window.clearInterval(timer);
    bed.stop();
  };
}

function startWaves(ctx: AudioContext, out: AudioNode): () => void {
  const sources: AudioScheduledSourceNode[] = [];
  // Two layers per side: a low swell and a lighter foam, each breathing slowly.
  for (const [side, rate] of [[-0.5, 0.11], [0.5, 0.097]] as const) {
    const pan = ctx.createStereoPanner();
    pan.pan.value = side;
    pan.connect(out);
    for (const [colour, lo, hi, base, depth] of [["brown", 60, 700, 0.35, 0.3], ["pink", 900, 4000, 0.06, 0.055]] as const) {
      const noise = loop(ctx, noiseBuffer(ctx, colour));
      const swell = ctx.createGain();
      swell.gain.value = base;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = depth;
      lfo.connect(lfoDepth).connect(swell.gain);
      noise.connect(filter(ctx, "highpass", lo)).connect(filter(ctx, "lowpass", hi)).connect(swell).connect(pan);
      noise.start();
      lfo.start();
      sources.push(noise, lfo);
    }
  }
  return () => sources.forEach((node) => node.stop());
}

function createEngine(preset: Preset): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const stopLayers = preset === "rain" ? startRain(ctx, master) : startWaves(ctx, master);
  return {
    ctx,
    master,
    stop: () => {
      stopLayers();
      void ctx.close();
    }
  };
}

const FADE = 2;

export function SoundscapePlayer({ minutes, preset }: { minutes: number; preset: Preset }) {
  const engine = useRef<Engine>();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [left, setLeft] = useState(minutes * 60);
  const finished = left <= 0;

  // Countdown while playing; fade out and stop at the end.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (finished && engine.current) {
      const { ctx, master } = engine.current;
      master.gain.setTargetAtTime(0, ctx.currentTime, FADE / 3);
      window.setTimeout(() => setPlaying(false), FADE * 1000);
    }
  }, [finished]);

  useEffect(() => {
    const e = engine.current;
    if (e && playing) e.master.gain.setTargetAtTime(volume, e.ctx.currentTime, 0.1);
  }, [volume, playing]);

  useEffect(() => () => engine.current?.stop(), []);

  async function toggle() {
    if (finished) return;
    if (!engine.current) engine.current = createEngine(preset);
    const { ctx, master } = engine.current;
    if (playing) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      window.setTimeout(() => void ctx.suspend(), 500);
      setPlaying(false);
    } else {
      await ctx.resume();
      master.gain.setTargetAtTime(volume, ctx.currentTime, FADE / 3);
      setPlaying(true);
    }
  }

  function restart() {
    engine.current?.stop();
    engine.current = undefined;
    setLeft(minutes * 60);
    setPlaying(false);
  }

  // Whole minutes, not a ticking m:ss: enough to know when the break ends.
  const minutesLeft = Math.ceil(left / 60);

  return (
    <div className={`pause-stage pause-tone-chill pause-soundscape pause-soundscape-${preset} ${playing ? "is-playing" : ""}`}>
      <div className="pause-soundscape-art" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ animationDelay: `${(i * 0.37) % 2}s`, left: `${(i * 7.3) % 100}%` }} />)}
      </div>
      <p className="pause-breath-word">{finished ? "That's your break. Welcome back." : playing ? (preset === "rain" ? "Let the rain fall." : "Let the waves roll in.") : "Best with headphones."}</p>
      <p className="pause-breath-meta" aria-live="off">{finished ? "The sound has faded out." : minutesLeft > 1 ? `About ${minutesLeft} min left` : "Less than a minute left"}</p>
      <div className="pause-stage-controls">
        {finished ? (
          <button className="pause-button pause-button-ink" onClick={restart}><RotateCcw size={18} /> Play again</button>
        ) : (
          <button className="pause-button pause-button-ink" onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? "Pause" : left < minutes * 60 ? "Continue" : "Play"}
          </button>
        )}
        <label className="pause-volume">
          <Volume2 size={18} aria-hidden="true" />
          <span className="pause-sr-only">Volume</span>
          <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
        </label>
      </div>
    </div>
  );
}
