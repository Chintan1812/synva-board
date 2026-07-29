// TRUST banner -> the "sprint to trust" beat, at 4%.
//
// Sits on top of whatever board is on screen right after the hook, while Chintan
// says who he is. Deliberately a banner and not a full board: at 4% the viewer
// has just been given a reason to stay, and a credentials slide would spend that
// attention rather than bank it.
//
// ⚠️ THE NUMBER IS UNRESOLVED. Chintan's frozen hook says **"1000 se bhi zyada"**
// over "pichle 2 saal". The archive scripts in ClickUp (including Nov 2025) say
// **"500+"** over the SAME two-year window. The number doubled while the window
// stayed put. It is almost certainly real growth, but a viewer who has seen both
// will notice, and this banner is where it is written down rather than spoken in
// passing. Two clean options if he wants one: widen the window to three years, or
// keep two years and let 1000+ stand. **Flagged in 02-hook.md; not yet decided.**
// The board follows the frozen hook until he says otherwise.
//
// rule 1b — English only. Copy-only, no data.
// Run: npm run board:phonak-trust
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { titleBanner } from "../../lib/banner.mjs";

// Matches the frozen hook. See the warning above before changing it.
const COUNT = "1000+";
const WINDOW = "two years";

writeBoard(
  boardOut("phonak-50k-vs-1lakh", "trust.svg"),
  titleBanner({
    kicker: "CHINTAN BHAYANI · FOUNDER, SYNVA HEARING",
    title: `${COUNT} people helped to choose, in the last ${WINDOW}`,
  }),
);
