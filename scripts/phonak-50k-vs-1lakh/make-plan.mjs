// PLAN board -> "plan of attack", the chapters card at 8%.
//
// WHAT THIS BOARD SHOWS: what the viewer is about to get, in the order they get
// it. Three chapters, matching the three promises the hook actually makes.
//
// ⚠️ THE CHAPTERS MUST MIRROR THE HOOK'S PROMISES, in the hook's order. The hook
// promises, in this sequence:
//   1. what you really get at each price band, and what you do not
//   2. the two things Phonak cannot do at any price
//   3. the one Phonak we sell but talk people out of
// If a chapter here does not correspond to a promise there, either the hook is
// making a promise the video does not keep, or the video is doing work the hook
// never sold. Both are retention leaks. Re-check against 02-hook.md before edits.
//
// The bonus is deliberately NOT a chapter. It is teased inside the hook and
// delivered at 70%, and listing it here would make the card four items where the
// design is 2-3 (lib/chapters.mjs grows the row, but three is the readable max on
// camera). Chintan plants a one-line version of it in this beat instead.
//
// rule 1b — English only. Copy-only, no data.
// Run: npm run board:phonak-plan
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { chaptersBoard } from "../../lib/chapters.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "plan.svg");

const card = await chaptersBoard({
  header: { eyebrow: "In this video", title: "What you are about to get" },
  chapters: [
    {
      icon: "scale",
      title: "What each budget really buys",
      sub: "₹50,000 and ₹1,00,000, on the specs that are actually on the box",
    },
    {
      icon: "circle-slash",
      title: "Two things Phonak cannot do",
      sub: "At any price. Not a budget problem, and nobody tells you",
    },
    {
      icon: "hand",
      title: "The one we talk you out of",
      sub: "We sell it. We will still tell you to skip it",
    },
  ],
});

writeBoard(OUT, card);
console.log(`wrote ${OUT} (${card.w}x${card.h}); icons: ${card.iconNames.join(", ")}`);
