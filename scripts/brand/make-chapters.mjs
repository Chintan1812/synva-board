// Synva CHAPTERS / agenda card -> the reusable card, brand default copy.
//
// The drawing lives in lib/chapters.mjs so a video can produce its OWN card
// without editing this file. Editing the constants here used to be the only way,
// which meant every new video silently overwrote the previous one's card.
// For a video, add scripts/<video-slug>/make-plan.mjs and call chaptersBoard().
//
// Run: npm run board:chapters
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { chaptersBoard } from "../../lib/chapters.mjs";

const OUT = boardOut("brand", "synva-chapters.svg");
const card = await chaptersBoard({
  header: { eyebrow: "In this video", title: "What we'll cover" },
  chapters: [
    { icon: "layout-grid", title: "The five models, compared", sub: "What sets them apart, and what each costs" },
    { icon: "compass", title: "Matched to your lifestyle", sub: "Which model actually fits your life" },
  ],
});
writeBoard(OUT, card);
console.log(`wrote ${OUT} (${card.w}x${card.h}); icons: ${card.iconNames.join(", ")}`);
