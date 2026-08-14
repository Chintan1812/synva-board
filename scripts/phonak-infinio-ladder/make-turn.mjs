// TURN board -> the payoff of loop A, at 55%.
//
// This is the number the hook named at 0% and refused to explain, and the veil
// on the entry board's third delta chip comes off here.
//
// ⚠️ TWO THINGS, NOT ONE. The catalogue's feature join says the I70 -> I90 step
// adds exactly one feature (Speech Enhancer). Phonak's own feature summary
// (doc 028-2681-03) also gives the I90 an eighth AutoSense program, "Speech in
// loud noise", which the catalogue does not record at all. Saying "one feature"
// would be repeating a DB gap on camera. Say two. See
// docs/db-fixes-phonak-infinio.md item 4.
//
// ⚠️ NOT "the I90 is a rip-off". The board states what is added and what it
// costs; the viewer does the arithmetic. That restraint is the brand.
// Run: npm run board:infinio-turn
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

const OUT = boardOut("phonak-infinio-ladder", "turn.svg");

const rows = await rest(
  "hearing_aid_models?id=in.(HA-269,HA-268)&select=id,mrp,unit,channels,warranty_years",
);
const by = new Map(rows.map((r) => [r.id, r]));
const i70 = by.get("HA-269");
const i90 = by.get("HA-268");
if (!i70 || !i90) throw new Error("missing catalogue rows — refusing to guess");
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

writeBoard(OUT, calloutCard({
  kicker: "THE STEP I PROMISED YOU AT THE START",
  title: `${inr(i90.mrp - i70.mrp)} buys you two things`,
  sub: `I70 at ${inr(i70.mrp)} a pair, I90 at ${inr(i90.mrp)} a pair.`,
  rows: [
    { label: "Speech Enhancer", note: "Lifts soft speech. The only feature Phonak lists on the I90 and not the I70.", tone: "yes" },
    { label: 'One more AutoSense program: "Speech in loud noise"', note: "The I90 classifies eight situations automatically, the I70 seven.", tone: "yes" },
    { label: `Channels: still ${i90.channels}`, note: `Same as the I70. They stop climbing after the I70.`, tone: "strike" },
    { label: `Warranty: still ${i90.warranty_years} years`, note: "Same as the I70.", tone: "strike" },
  ],
  footnote: "Source: Phonak Infinio feature summary, doc 028-2681-03. Not my opinion.",
  width: 1400,
}));
