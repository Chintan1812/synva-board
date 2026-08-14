// UPGRADE board -> the late gift, at 86%.
//
// Placed deliberately near the end. It is the one beat that pays off for a viewer
// who already owns an Infinio and has spent the whole video thinking the video
// was not for them. That is a retention device, not a footnote -- it gives the
// already-decided viewer a reason to reach 86%.
//
// ⚠️ EVERY CLAIM HERE IS VENDOR/INDEPENDENT SOURCED, NOT FROM THE CATALOGUE.
// The catalogue has no concept of "Ultra" and still records AutoSense OS 6.0.
// See docs/db-fixes-phonak-infinio.md items 1 and 2.
// Run: npm run board:infinio-upgrade
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

writeBoard(boardOut("phonak-infinio-ladder", "upgrade.svg"), calloutCard({
  kicker: "IF YOU ALREADY OWN ONE",
  title: "Ultra is free. Go and ask for it.",
  sub: "Every Infinio sold since August 2024 can have it. Same hardware, new firmware.",
  rows: [
    { label: "AutoSense OS 7.0", note: "Trained on 18x more real-world scenarios, 24% more precise than 6.0.", tone: "yes" },
    { label: "About 30% better battery efficiency", note: "The single biggest complaint about the original Sphere.", tone: "yes" },
    { label: "One-step Bluetooth pairing", note: "And faster feedback management.", tone: "yes" },
    { label: "Costs nothing, takes minutes", note: "In clinic, at your hearing care provider. It is a software update.", tone: "yes" },
  ],
  footnote: "Available since October 2025. This is why the whole line is now called Infinio Ultra.",
  accent: true,
  width: 1400,
}));
