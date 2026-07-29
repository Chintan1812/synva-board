// DO CHEEZEIN board -> the two things Phonak cannot do at ANY price.
//
// WHAT THIS BOARD SHOWS: two people who walk into the clinic and cannot be
// served, whatever they spend. Framed as people, not specs — it is easier to hold
// on camera and it keeps the lifestyle spine of the video.
//
//   Panel 1  "I want behind the ear"        -> no BTE on Infinio at all, AND
//                                              profound + rechargeable never meet
//   Panel 2  "I want invisible, and         -> rechargeable custom stops at ITC
//             rechargeable"
//
// ⚠️ NEVER say or imply "Phonak has no rechargeable BTE". It has one: Naida
// L30-PR. The claim is narrower and the board must keep it narrow — you cannot
// have profound POWER and rechargeable in the same device, and you cannot have
// ANY behind-the-ear on the latest platform. The PR row is on the board precisely
// so the honest version is visible rather than implied.
//
// Signia is deliberately NOT on this board. It answers both of these, and Chintan
// says so in one sentence on camera (mindmap talk track), but the video is a
// Phonak video, not a Signia-vs-Phonak video (Chintan, 2026-07-28). Putting the
// rival on the prop would change what the video is.
//
// FACTS VERIFIED LIVE (2026-07-29), not transcribed:
//   • Infinio families = Audeo (RIC) · Virto (custom) · CROS. No Naida, no Sky,
//     so no BTE. Naida/Sky exist only on Lumity; Terra BTE only on Terra.
//   • Every rechargeable Virto is a "-R" (ITC). Every "-10" CIC and both Titanium
//     rows are battery. Zero rechargeable CIC in the catalogue.
//   • PR / UP fitting ranges are pulled below rather than typed.
//
// Board rules: English only (rule 1b) · Synva tokens · flat fills · real centring
// (both axes — see the skill's centring rule). Run: npm run board:phonak-cheezein
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { renderDataUri, scaleFor } from "../../lib/phonak-renders.mjs";
import { text, writeBoard } from "../../lib/svg.mjs";
import { calloutPanels } from "../../lib/callout.mjs";
import { SUBTLE, UI } from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "cheezein.svg");

// The two Naida rows carry the whole "profound + rechargeable" argument, so the
// numbers come from the DB. If the catalogue is corrected, the board follows.
const naida = await rest(
  "hearing_aid_models?id=in.(HA-284,HA-231)&select=id,model_name,rechargeable,fitting_min,fitting_max",
);
const PR = naida.find((m) => m.id === "HA-284"); // Naida L30-PR, rechargeable
const UP = naida.find((m) => m.id === "HA-231"); // Naida L30-UP, reaches profound

const dB = (m) => `${m.fitting_min} to ${m.fitting_max} dB`;

// This board's whole argument is SHAPE, which is exactly where a picture earns
// its place (Chintan, 2026-07-29) — "BTE" and "CIC" are meaningless words until
// you see them. Reserved 1:1 slots, filled in Figma; the object path rides along
// and the base URL is printed once at the bottom.
//   HA-231 Naida L30-UP  BTE  · HA-314 Virto I30-R  ITC (rechargeable custom)
//   HA-301 Virto I30-10  CIC  (the invisible one, battery only)
// Resolve on the CATALOGUE name so the Phonak library matches (it is fussy about
// "Virto I30-10 NW O" vs any shortened label).
const SHAPE_IDS = ["HA-231", "HA-314", "HA-301"];
const shapeRows = await rest(
  `hearing_aid_models?id=in.(${SHAPE_IDS.join(",")})&select=id,model_name`,
);
const dbName = new Map(shapeRows.map((r) => [r.id, r.model_name]));
const art = new Map();
for (const id of SHAPE_IDS) {
  const r = await renderDataUri(dbName.get(id), { size: 380 });
  if (!r) console.warn(`cheezein: no Phonak render for ${dbName.get(id)}`);
  art.set(id, r);
}
// CIC must be visibly smaller than ITC — that size gap IS the second wall.
const slotArt = (id, cic = false) => ({
  uri: art.get(id)?.uri,
  uriScale: scaleFor(art.get(id), { cic }),
});

const card = calloutPanels({
  kicker: "THE HONEST PART",
  title: "Two things Phonak cannot do at any price",
  sub: "Not a budget problem. Spending more does not fix either one.",
  panels: [
    {
      head: "“I want behind the ear”",
      sub: "Two walls, one person",
      slots: [{ label: "BTE", caption: "behind the ear", ...slotArt("HA-231") }],
      // Kept to one line each on purpose: a wrapped bullet reads as a weaker
      // point on camera, and these are the two hardest facts in the video.
      rows: [
        "Infinio, the latest platform, has no behind-the-ear model.",
        "Behind the ear means Lumity or Terra. Never the newest chip.",
        `${PR.model_name} is rechargeable, but fits ${dB(PR)}.`,
        `${UP.model_name} reaches ${UP.fitting_max} dB, on disposable batteries.`,
        "So profound power and rechargeable never meet.",
      ],
    },
    {
      head: "“I want invisible, and rechargeable”",
      sub: "One wall, and it is size",
      // Two shapes side by side: the rechargeable one you can see, and the
      // invisible one that cannot be rechargeable. The gap between them IS the wall.
      slots: [
        { label: "ITC", caption: "rechargeable, visible", ...slotArt("HA-314") },
        { label: "CIC", caption: "invisible, battery only", ...slotArt("HA-301", true) },
      ],
      rows: [
        "Phonak's rechargeable custom stops at ITC, which is visible.",
        "Every completely-in-canal Phonak runs on a size 10 battery.",
        "Truly invisible and rechargeable together does not exist.",
      ],
    },
  ],
  footnote: "Both are real limits of the brand. Neither one is a price problem.",
});

// Provenance line. It sits inside the board's existing bottom padding — do NOT
// grow card.h afterwards, the background rect is already drawn at the original
// height and the extra strip renders black.
card.body +=
  "\n" +
  text(56, card.h - 28, "Phonak's own renders, in black where the model offers it, sized to approximate real relative scale.", 12.5, UI, 400, SUBTLE);

writeBoard(OUT, { ...card, xlink: true });
