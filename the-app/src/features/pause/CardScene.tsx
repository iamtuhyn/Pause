import type { Activity } from "./catalog/activity";
import { DoodleScene, GlobeScene, RainScene, SleepySun, WaveScene } from "./Scenes";

// A small window onto the activity in the corner of its landing card. It holds
// still until the card is hovered or focused, then plays (see .pause-card-scene).
export function CardScene({ activity }: { activity: Activity }) {
  const renderer = activity.renderer;
  let scene = null;
  if (renderer.kind === "breathing") scene = <SleepySun />;
  else if (renderer.kind === "soundscape") scene = renderer.preset === "rain" ? <RainScene /> : <WaveScene />;
  else if (renderer.kind === "doodle") scene = <DoodleScene hidden={renderer.hidden} />;
  else if (renderer.kind === "guess-country") scene = <GlobeScene />;
  if (!scene) return null;
  return <span className="pause-card-scene" aria-hidden="true">{scene}</span>;
}
