// BATTERY board -> the honest limitation, at 62%.
//
// The feature that justifies the Sphere premium is also the one that empties the
// battery. Nobody selling these says it out loud, which is exactly why it is here.
//
// ⚠️ NOT A DB FACT. Battery hours are not in the catalogue at all. These come
// from Phonak's product page and HearingTracker's Ultra coverage, both read
// 2026-08-13. If they are ever contradicted, this board changes.
//
// ⚠️ FRAMING: this is not "don't buy the Sphere". It is "know this before you
// buy it, and ask about it in the fitting".
// Run: npm run board:infinio-battery
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

writeBoard(boardOut("phonak-infinio-ladder", "battery.svg"), calloutCard({
  kicker: "THE PART NOBODY MENTIONS",
  title: "The AI is what drains the battery",
  sub: "Same device, same charge, two very different days.",
  rows: [
    { label: "Up to 56 hours", note: "Normal use, Sphere mode not running.", tone: "yes" },
    { label: "Roughly 10 to 11 hours", note: "With Sphere mode running continuously, which is what a loud day looks like.", tone: "no" },
    { label: "The Ultra firmware improved efficiency about 30%", note: "This is already the better number. It used to be worse.", tone: "neutral" },
  ],
  footnote: "If you are out in noise for 14 hours a day, ask about this specifically before you buy.",
  width: 1400,
}));
