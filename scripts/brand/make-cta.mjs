// Synva CTA PILL -> the reusable pill on its own, brand default copy.
//
// A compact pill: [cursor icon] <invite line> │ synva.io ↗. NOT a help-desk
// "reach out" — an open invitation to go play with the site at their own pace
// (Chintan, 2026-07-23). The URL is its own text node so it can be linked in
// Figma. Drop it on any board at the "…want to see for yourself?" beat.
//
// The drawing lives in lib/ctapill.mjs so a video can use its OWN copy, and can
// compose the pill into a larger CTA board, without editing this file. Editing
// the constants here used to be the only way, which meant each new video
// silently overwrote the previous one's pill.
// See scripts/phonak-50k-vs-1lakh/make-cta.mjs for the composed version.
//
// Run: npm run board:cta
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { ctaPill } from "../../lib/ctapill.mjs";

const pill = await ctaPill({
  invite: "Browse at your own pace",
  urlText: "synva.io",
  icon: "mouse-pointer-click",
});

writeBoard(boardOut("brand", "synva-cta-pill.svg"), { ...pill, xlink: true });
