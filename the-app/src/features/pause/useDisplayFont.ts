import { useEffect } from "react";

const DISPLAY_FONT_ID = "pause-display-font";
// Bodoni Moda (serif headings) and Mrs Saint Delafield (script accents), both SIL Open Font Licence.
const DISPLAY_FONT_URL = "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..900&family=Mrs+Saint+Delafield&display=swap";

// Loaded from the prototype rather than index.html, so the rest of the app
// is untouched; headings fall back to the system font until it arrives.
export function useDisplayFont() {
  useEffect(() => {
    if (document.getElementById(DISPLAY_FONT_ID)) return;
    const link = document.createElement("link");
    link.id = DISPLAY_FONT_ID;
    link.rel = "stylesheet";
    link.href = DISPLAY_FONT_URL;
    document.head.appendChild(link);
  }, []);
}
