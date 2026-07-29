// Synva VIDEO TITLE BANNER -> the reusable title lockup, brand default copy.
//
// The drawing lives in lib/banner.mjs so a video can produce its OWN banner
// without editing this file. Editing the constants here used to be the only way,
// which meant every new video silently overwrote the previous one's banner.
// For a video, add scripts/<video-slug>/make-trust.mjs and call titleBanner()
// there — see scripts/phonak-50k-vs-1lakh/make-trust.mjs.
//
// Run: npm run board:title-banner
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { titleBanner } from "../../lib/banner.mjs";

writeBoard(
  boardOut("brand", "synva-title-banner.svg"),
  titleBanner({ kicker: "Synva Hearing", title: "Which Styletto is right for you?" }),
);
