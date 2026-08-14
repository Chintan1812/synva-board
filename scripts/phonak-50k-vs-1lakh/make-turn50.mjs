// TURN 50 board -> the turn, at ~33%. The re-engagement beat of the first half.
//
// WHAT THIS BOARD SHOWS: the honest verdict at this budget. Rechargeable exists
// here. 12 channels exist here. Phonak's device at this price has neither. Said
// once, plainly, then the video moves up to ₹1,00,000 where Phonak earns it.
//
// ⚠️ CORRECTED 2026-08-12: this board used to say "No Bluetooth" of Terra. That
// was wrong — the DB carried BLT-0005 "None" and Phonak's own Product
// Information sheet lists Bluetooth on every Terra body. Terra streams phone
// calls; what it lacks is the myPhonak app, the TV Connector and PartnerMic.
// The turn now runs on rechargeable + channels, both manufacturer-verifiable.
//
// REPOSITIONED 2026-08-13 (Chintan): the hook's open loop is now MOBILE APP
// CONTROL, so Terra's row leads with that, not with Bluetooth. Verified: Phonak
// lists myPhonak for Terra+ only; both Signias reach the Signia app (Orion
// acoustically, with no Bluetooth at all). See make-band50.mjs.
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
      label: "Want 12 channels?",
      note: "Signia Sirion 75. Same money, 12 channels instead of 8, and it streams to the app and the TV.",
      tone: "yes",
    },
    {
      label: "Phonak Terra",
      note: "8 channels. Not rechargeable. And the only one here you cannot control from your phone.",
      tone: "no",
    },
  ],
  footnote: "Phonak earns its money higher up. Not here.",
});

writeBoard(OUT, card);
