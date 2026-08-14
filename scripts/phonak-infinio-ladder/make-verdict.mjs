// VERDICT board -> closes loop B, at 78%.
//
// ⚠️ THIS BOARD IS DELIBERATELY UNFINISHED AND MUST NOT BE RECORDED AS IS.
// The per-level persona and the anchor model are EXPERIENTIAL inputs -- they come
// from Chintan and from nowhere else. Not from the catalogue, not from Phonak,
// not from the web. video-mindmap's rule: anything unanswered stays a visible
// [ASK CHINTAN] placeholder rather than being quietly invented.
// Asked in 01-research.md, flags 1, 2 and 4.
//
// The car analogy is already proven on his camera (ClickUp 197p90-8276):
// Creta / C-Class / S-Class / Maybach. Reuse it in the talk track, not on the board.
// Run: npm run board:infinio-verdict
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

writeBoard(boardOut("phonak-infinio-ladder", "verdict.svg"), calloutCard({
  kicker: "WHICH ONE IS ACTUALLY YOURS",
  title: "Most people stop before the top",
  sub: "Going higher than your day requires is not mandatory.",
  rows: [
    { label: "I30", note: "[ASK CHINTAN: who is this genuinely right for?]", tone: "neutral" },
    { label: "I50", note: "[ASK CHINTAN: who is this genuinely right for?]", tone: "neutral" },
    { label: "I70", note: "[ASK CHINTAN: who is this genuinely right for?]", tone: "neutral" },
    { label: "I70-Sphere", note: "[ASK CHINTAN: confirm this is the anchor, and who it is for]", tone: "yes" },
    { label: "I90 / I90-Sphere", note: "[ASK CHINTAN: is there a real case, or is this honestly 'almost nobody'?]", tone: "neutral" },
  ],
  footnote: "PLACEHOLDER BOARD: do not record until the five rows above are answered.",
  width: 1400,
}));
