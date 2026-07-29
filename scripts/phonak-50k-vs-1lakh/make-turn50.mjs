// TURN 50 board -> the turn, at ~33%. The re-engagement beat of the first half.
//
// WHAT THIS BOARD SHOWS: the honest verdict at this budget. Rechargeable exists
// here. Bluetooth exists here. Phonak's device at this price has neither. Said
// once, plainly, then the video moves up to ₹1,00,000 where Phonak earns it.
//
// This is NOT a Signia-vs-Phonak board (research §4-FRAME). It names two Signia
// models because the Phonak analysis forces it, then moves on. No comparison
// table, no second brand column, no lingering.
//
// Board rules: English only (rule 1b) · Synva tokens · flat fills · real centring.
// Run: npm run board:phonak-turn50
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "turn50.svg");

const card = calloutCard({
  kicker: "THE HONEST ANSWER AT THIS BUDGET",
  title: "Phonak gives you neither",
  sub: "Both of these exist at this money. Just not from Phonak.",
  rows: [
    {
      label: "Want it rechargeable?",
      note: "Signia Orion 50. Same money, and the one that sells most at this price.",
      tone: "yes",
    },
    {
      label: "Want Bluetooth?",
      note: "Signia Sirion 75. Same money, and 12 channels instead of 8.",
      tone: "yes",
    },
    {
      label: "Phonak Terra",
      note: "8 channels. No Bluetooth. No rechargeable. At the same price as both of the above.",
      tone: "no",
    },
  ],
  footnote: "Phonak earns its money higher up. Not here.",
});

writeBoard(OUT, card);
