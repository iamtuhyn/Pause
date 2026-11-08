import { MAP_LAND, MAP_VIEWBOX } from "./data/worldMap";

// A greyed world map. Hovering a continent colours it; clicking picks it.
// The continent cards beside it do the same job for keyboard and screen-reader users.
export function WorldMap({ onPick }: { onPick: (continent: string) => void }) {
  return (
    <svg className="pause-worldmap" viewBox={MAP_VIEWBOX} aria-hidden="true" focusable="false">
      {Object.entries(MAP_LAND).map(([continent, d]) => (
        <path key={continent} d={d} className="pause-map-land" onClick={() => onPick(continent)} />
      ))}
    </svg>
  );
}
