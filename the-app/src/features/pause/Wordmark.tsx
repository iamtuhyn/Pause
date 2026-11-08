// The Descape wordmark: the Esc key sits in the middle of the word, D-[Esc]-ape.
// Decorative, because the link around it carries the name for screen readers.
export function Wordmark() {
  return (
    <span className="pause-wordmark" aria-hidden="true">
      <span>D</span>
      <span className="pause-key">Esc</span>
      <span>ape</span>
    </span>
  );
}
