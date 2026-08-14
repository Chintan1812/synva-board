// BONUS board -> the tool, at 92%.
//
// ⚠️ BLOCKED: do not record this beat until the Knowledge Hub page and the gate
// are live. Teasing a tool that does not exist is the one thing that costs more
// trust than it earns.
//
// ⚠️ THE PITCH IS THE RESTRAINT, NOT THE FEATURE. Every configurator in this
// category funnels upward. This one is sold on the promise that it recommends a
// higher level ONLY when the answers require it -- and that promise has to be
// true in the code. The trigger table is in BONUS-BRIEF.md and is the build spec.
//
// ⚠️ NEVER SHOW THE FORM ON THE BOARD, and never make the WhatsApp consent a
// spoken ask. It is a checkbox on the page. See videos/LEAD-CAPTURE.md.
// Run: npm run board:infinio-bonus
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

writeBoard(boardOut("phonak-infinio-ladder", "bonus.svg"), calloutCard({
  kicker: "FREE, AT THE LINK BELOW",
  title: "Which Phonak do you actually need?",
  sub: "Six questions. It tells you the level, and why.",
  rows: [
    { label: "It recommends higher ONLY if your answers require it", note: "Loud multi-speaker noise most days, a fitting range that demands it, or daily hands-free calls. Nothing else moves it up.", tone: "yes" },
    { label: "Most people will be told to buy the cheaper one", note: "That is the whole point of building it this way.", tone: "yes" },
    { label: "If you have already been quoted, bring the number", note: "It will tell you plainly whether you need the level you were quoted.", tone: "yes" },
    { label: "It is a shortlist, not a prescription", note: "The receiver and the fitting still need an audiologist.", tone: "neutral" },
  ],
  footnote: "synva.io/tools/which-phonak  ·  name and mobile, nothing else",
  accent: true,
  width: 1400,
}));
