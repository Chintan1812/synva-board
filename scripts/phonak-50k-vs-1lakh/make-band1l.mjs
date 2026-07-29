// BAND 1 LAKH board -> the whole ₹1,00,000 Phonak segment, grouped by platform.
//
// WHAT THIS BOARD SHOWS: every Phonak that sits at this money. The point Chintan
// makes over it is that at ₹1,00,000 the choice stops being about performance and
// becomes about the BODY — behind the ear, in the ear, or extra power. All seven
// share the same engine, so those shared specs are stated ONCE in a common band
// (skill rule 6b) instead of being repeated in seven identical columns. What is
// left on each card is only what actually differs: platform, body, battery, MRP.
//
// Audeo I30-R Go is the anchor: best seller at this band (Chintan, 2026-07-29).
// Same aid as the I30-R, supplied with the pocket ChargerGo instead of the desk
// charger — that convenience is what people actually pay the extra for.
// Audeo L30-R is flagged as the Lumity fallback for a tighter budget.
// Naida L30-SP is deliberately absent — rarely stocked in India.
//
// Board rules (see .claude/skills/figma-board-svg/SKILL.md, it is authoritative):
//   • rule 1b — BOARD COPY IS ENGLISH. No Hindi, ever.
//   • rule 6a — headline facts are manufacturer-verifiable only
//   • rule 6b — anything identical across the line is stated once, prominently
//   • prices are **MRP, per pair**; never a discounted figure, never the discount %
//   • strictly Synva tokens · one font-family per <text> · flat fills only
//   • real SVG centring (mtext / htext), never a hand-tuned x offset
//
// Data pulled live. Run: npm run board:phonak-band1l
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { imageSlot } from "../../lib/imageslot.mjs";
import { renderDataUri, scaleFor } from "../../lib/phonak-renders.mjs";
import { text, htext, mtext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "band1l.svg");

// Two platform blocks, each ordered by MRP. `body` is the only thing that really
// separates the cards inside a block.
const BLOCKS = [
  {
    platform: "LUMITY",
    note: "the previous platform",
    ids: [
      { id: "HA-231", name: "Naida L30-UP", body: "Super power BTE", note: "for severe to profound" },
      { id: "HA-275", name: "Audeo L30-R", body: "RIC", note: "the budget Phonak here", fallback: true },
      { id: "HA-284", name: "Naida L30-PR", body: "Power BTE", note: "power, rechargeable" },
    ],
  },
  {
    platform: "INFINIO",
    note: "the current platform",
    ids: [
      { id: "HA-301", name: "Virto I30-10", body: "Custom CIC", note: "sits fully in the canal" },
      { id: "HA-314", name: "Virto I30-R", body: "Custom ITC", note: "in the ear, rechargeable" },
      { id: "HA-271", name: "Audeo I30-R", body: "RIC", note: "with the standard charger" },
      { id: "HA-315", name: "Audeo I30-R Go", body: "RIC", note: "with the pocket charger", anchor: true },
    ],
  },
];

const ALL = BLOCKS.flatMap((b) => b.ids.map((m) => m.id));
const rows = await rest(
  `hearing_aid_models?id=in.(${ALL.join(",")})&select=id,model_name,mrp,unit,channels,warranty_years,rechargeable`,
);
const byId = new Map(rows.map((r) => [r.id, r]));

// The REAL Phonak render per card, embedded (Chintan, 2026-07-29). This board
// argues that at ₹1,00,000 the choice is the BODY, so the body has to be visible.
// Black where the model offers it, beige next.
//
// Renders are scaled by form factor (scaleFor) — at 1:1 each fills its frame and
// the CIC would look bigger than the RIC, contradicting the very point.
// Resolve on the CATALOGUE name, not the card's display label — the cards say
// "Virto I30-10" for brevity while the catalogue (and the Phonak library) say
// "Virto I30-10 NW O", and matching on the label silently found nothing.
const art = new Map();
for (const spec of BLOCKS.flatMap((b) => b.ids)) {
  const dbName = byId.get(spec.id)?.model_name || spec.name;
  const r = await renderDataUri(dbName, { size: 420 });
  if (!r) console.warn(`band1l: no Phonak render for ${dbName}`);
  art.set(spec.id, r);
}

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
// A Pair row is a real bundle price and is always cheaper than twice the single,
// so prefer it. Every model here already resolves to its own Pair row where one
// exists; `mrp * 2` is the fallback only. See the skill's pricing rule.
const pairMrp = (m) => (m.unit === "Pcs" ? m.mrp * 2 : m.mrp);

const icon = await loadIcons(["battery-charging", "battery", "star"]);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const CARDW = 300, GAP = 20, COLS = 4;
const gridW = COLS * CARDW + (COLS - 1) * GAP;
const W = PAD * 2 + gridW;

const HEADT = 62;
const COMMON_T = 150, COMMON_H = 92;

// 1:1 picture area per card. The ribbon sits ABOVE it so the two never overlap.
const SLOT = CARDW - 48;
const RIBBON_T = 14, SLOT_T = 52;
const SLOT_TEXT = 30; // gap + the object-path line under the square
const BODY_T = SLOT_T + SLOT + SLOT_TEXT; // where the text block starts

const BLOCK_HEAD = 54, CARDH = BODY_T + 166, BLOCK_GAP = 34;

let y = COMMON_T + COMMON_H + 40;
const blockY = [];
for (const b of BLOCKS) {
  blockY.push(y);
  y += BLOCK_HEAD + CARDH + BLOCK_GAP;
}
const FOOT_T = y - BLOCK_GAP + 30;
const H = FOOT_T + 22 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

g.push(text(PAD, HEADT, "At this budget, the choice is the body", 38, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="${HEADT + 14}" width="64" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, HEADT + 50, "Same engine in all seven. What changes is where it sits, and which platform it runs.", 17, UI, 400, MUTED));

// ── common band: rule 6b, stated ONCE and made prominent ────────────────────
const m0 = byId.get("HA-271");
g.push(`<rect x="${PAD}" y="${COMMON_T}" width="${gridW}" height="${COMMON_H}" rx="18" fill="${YELLOW_LIGHT}"/>`);
g.push(text(PAD + 28, COMMON_T + 34, "COMMON TO ALL SEVEN", 11.5, UI, 700, YELLOW_DARK));
// ONLY genuinely-shared facts belong here. Fitting range is deliberately NOT
// listed: Naida L30-PR reaches 90 dB (not profound) and both Virto rows are null
// in the catalogue, so "fits mild to profound" would be false for three of seven.
const commons = [
  `${m0.channels} channels`,
  "Universal Bluetooth",
  `${m0.warranty_years} year warranty`,
];
let cx = PAD + 28;
commons.forEach((c, i) => {
  g.push(text(cx, COMMON_T + 68, c, 19, DISP, 600, YELLOW_DARK));
  cx += c.length * 19 * 0.54 + 26;
  if (i < commons.length - 1) {
    g.push(`<circle cx="${cx - 14}" cy="${COMMON_T + 62}" r="3" fill="${YELLOW_DARK}"/>`);
  }
});

// ── platform blocks ─────────────────────────────────────────────────────────
BLOCKS.forEach((b, bi) => {
  const by = blockY[bi];
  g.push(text(PAD, by + 26, b.platform, 20, DISP, 700, INK));
  const pw = b.platform.length * 20 * 0.58 + 16;
  g.push(text(PAD + pw, by + 26, b.note, 14, UI, 400, SUBTLE));

  b.ids.forEach((spec, i) => {
    const m = byId.get(spec.id);
    const x = PAD + i * (CARDW + GAP);
    const top = by + BLOCK_HEAD;
    const isAnchor = !!spec.anchor;

    g.push(
      `<rect x="${x}" y="${top}" width="${CARDW}" height="${CARDH}" rx="18" fill="${isAnchor ? YELLOW_LIGHT : WHITE}" stroke="${isAnchor ? YELLOW : BORDER}" stroke-width="${isAnchor ? 2.5 : 1.5}"/>`,
    );

    // anchor / fallback ribbon — above the picture area, never over it
    if (isAnchor) {
      const rw = 118;
      g.push(`<rect x="${x + CARDW - rw - 18}" y="${top + RIBBON_T}" width="${rw}" height="26" rx="13" fill="${YELLOW}"/>`);
      g.push(mtext(x + CARDW - rw / 2 - 18, top + RIBBON_T + 13, "BEST SELLER", 10, UI, 700, YELLOW_DARK));
    } else if (spec.fallback) {
      const rw = 138;
      g.push(`<rect x="${x + CARDW - rw - 18}" y="${top + RIBBON_T}" width="${rw}" height="26" rx="13" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);
      g.push(mtext(x + CARDW - rw / 2 - 18, top + RIBBON_T + 13, "BUDGET OPTION", 10, UI, 700, SUBTLE));
    }

    // 1:1 picture area. No label/caption — the model name is already on the
    // card right below it, and repeating it would just eat vertical space.
    g.push(
      imageSlot({
        x: x + 24,
        y: top + SLOT_T,
        size: SLOT,
        uri: art.get(spec.id)?.uri,
        uriScale: scaleFor(art.get(spec.id), { cic: /CIC/i.test(spec.body) }),
        tone: isAnchor ? "hot" : "neutral",
      }),
    );

    g.push(text(x + 22, top + BODY_T + 26, spec.body.toUpperCase(), 11, UI, 700, SUBTLE));
    g.push(text(x + 22, top + BODY_T + 58, spec.name, 24, DISP, 700, INK));
    g.push(text(x + 22, top + BODY_T + 82, spec.note, 13, UI, 400, MUTED));

    // battery row
    const bt = m.rechargeable;
    g.push(icon(bt ? "battery-charging" : "battery", x + 22, top + BODY_T + 102, 20, bt ? YELLOW_DARK : SUBTLE, 2));
    g.push(text(x + 50, top + BODY_T + 118, bt ? "Rechargeable" : "Disposable battery", 14, UI, 600, bt ? YELLOW_DARK : SUBTLE));

    // MRP, pinned bottom-left
    g.push(text(x + 22, top + CARDH - 22, inr(pairMrp(m)), 25, DISP, 700, INK));
    g.push(text(x + 22 + inr(pairMrp(m)).length * 25 * 0.56 + 10, top + CARDH - 22, "MRP, a pair", 12, UI, 400, SUBTLE));
  });
});

g.push(text(PAD, FOOT_T, "Phonak's own renders, in black where the model offers it, sized to approximate real relative scale.", 12.5, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), xlink: true });
