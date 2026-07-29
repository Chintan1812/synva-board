// DON'T BUY board -> the one device in this video we talk people out of.
//
// WHAT THIS BOARD SHOWS: Terra+ RIC-312 against Terra+ RIC-R. Same platform,
// same channels, same Bluetooth, same fitting range, same warranty. The ONLY
// difference is the battery, and it costs ₹20,000 a piece. That is the whole
// indictment, and it only lands if the two spec lists are visibly identical —
// so the shared rows are printed in full rather than summarised.
//
// ORIGINAL SPEC WAS BROKEN: the plan compared Terra+ RIC-R against Audeo L30-312,
// which is discontinued (absent from the June 2026 guide). Chintan's call
// (2026-07-29) was to compare WITHIN Terra+, which is a stronger argument anyway
// because nothing else varies.
//
// ⚠️ PRICING — read before touching the numbers.
// The catalogue holds two units. 86 models have BOTH a "Pcs" row and a "Pair"
// row, and the Pair row is always cheaper than 2x the Pcs row: it is a real pair
// bundle, not a data error. So `mrp * 2` OVERSTATES the pair price wherever a
// Pair row exists. Here the two sides are asymmetric:
//   • Terra+ RIC-312 (HA-258) — Pcs only. No pair bundle listed.
//   • Terra+ RIC-R   (HA-257 Pcs / HA-283 Pair) — has a real ₹1,04,000 bundle.
// Quoting one number would either flatter the RIC-R (₹84,000 doubled vs a
// discounted ₹1,04,000 bundle) or quote a price nobody can buy (₹1,24,000).
// Chintan's call: SHOW BOTH COLUMNS and let the structure be visible. The
// footnote states plainly where a pair price is a real bundle and where it is
// simply twice the single price, so nothing is implied that the catalogue does
// not say.
//
// NO IMAGES ON THIS BOARD (Chintan, 2026-07-29). An earlier cut reserved two
// picture slots. The rule we settled on is that a slot belongs only where the
// SHAPE is the argument — brand/form-factors, cheezein, band1l. Here both units
// are the same RIC and the argument is the battery, which no photo shows. Two
// near-identical renders would have implied the difference is cosmetic, which is
// the opposite of the point. Text-only is the correct answer, not a shortcut.
//
// Board rules: English only (rule 1b) · Synva tokens · flat fills · real centring
// on both axes. Run: npm run board:phonak-dontbuy
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, writeBoard } from "../../lib/svg.mjs";
import { boardHeader } from "../../lib/callout.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "dontbuy.svg");

// HA-258 = Terra+ RIC-312 (Pcs only) · HA-257 = Terra+ RIC-R (Pcs)
// HA-283 = the same RIC-R as a listed Pair bundle
const rows = await rest(
  "hearing_aid_models?id=in.(HA-258,HA-257,HA-283)" +
    "&select=id,model_name,mrp,unit,channels,rechargeable,warranty_years,fitting_min,fitting_max,bluetooth_type_id",
);
const byId = new Map(rows.map((r) => [r.id, r]));
const R312 = byId.get("HA-258");
const RICR = byId.get("HA-257");
const RICR_PAIR = byId.get("HA-283");

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// Pair price: the REAL bundle row if one exists, otherwise twice the single
// price. `bundled` drives the footnote, so the board never implies a bundle
// that Phonak does not actually list.
const pairOf = (pcs, pairRow) =>
  pairRow ? { amount: pairRow.mrp, bundled: true } : { amount: pcs.mrp * 2, bundled: false };

const COLS = [
  {
    m: R312,
    name: "Terra+ RIC-312",
    sub: "disposable battery",
    pair: pairOf(R312, null),
  },
  {
    m: RICR,
    name: "Terra+ RIC-R",
    sub: "rechargeable",
    pair: pairOf(RICR, RICR_PAIR),
    flagged: true,
  },
];

// Everything that does NOT change. Printed in full: the argument is the sameness.
const SAME = [
  ["Platform", "Terra (T)"],
  ["Channels", `${R312.channels}`],
  ["Bluetooth", "Universal"],
  ["Fitting range", `${R312.fitting_min} to ${R312.fitting_max} dB`],
  ["Warranty", `${R312.warranty_years} years`],
];

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const W = 1320;
const inner = W - PAD * 2;

const head = boardHeader({
  kicker: "THE ONE WE TALK YOU OUT OF",
  title: "₹20,000 more, for a battery",
  sub: "Everything else on these two is identical. Every single thing.",
  inner,
});

const GAP = 28;
const CARDW = (inner - GAP) / 2;
const CARD_T = head.contentT + 22;
const CARDH = 198;

const SAME_T = CARD_T + CARDH + 34;
const SAME_H = 96;
const FOOT_T = SAME_T + SAME_H + 40;
const H = FOOT_T + 46 + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);
g.push(...head.nodes);

// ── the two cards ────────────────────────────────────────────────────────────
COLS.forEach((c, i) => {
  const x = PAD + i * (CARDW + GAP);
  const flagged = !!c.flagged;

  g.push(
    `<rect x="${x}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="20" fill="${WHITE}" stroke="${flagged ? YELLOW : BORDER}" stroke-width="${flagged ? 2.5 : 1.5}"/>`,
  );

  let ty = CARD_T + 48;
  g.push(text(x + 26, ty, c.name, 25, DISP, 700, INK));
  g.push(text(x + 26, ty + 24, c.sub, 14, UI, 500, flagged ? YELLOW_DARK : SUBTLE));

  // BOTH prices, side by side. Neither is derived from the other on screen.
  const py = ty + 68;
  g.push(text(x + 26, py, inr(c.m.mrp), 30, DISP, 700, INK));
  g.push(text(x + 26, py + 22, "MRP, a single aid", 12.5, UI, 400, SUBTLE));

  const px2 = x + CARDW / 2 + 14;
  g.push(text(px2, py, inr(c.pair.amount), 30, DISP, 700, INK));
  g.push(
    text(px2, py + 22, c.pair.bundled ? "MRP, a pair (bundle)" : "MRP, a pair (2 x single)", 12.5, UI, 400, SUBTLE),
  );

  if (flagged) {
    const rw = 132;
    g.push(`<rect x="${x + CARDW - rw - 20}" y="${CARD_T + CARDH - 46}" width="${rw}" height="30" rx="15" fill="${YELLOW}"/>`);
    g.push(mtext(x + CARDW - rw / 2 - 20, CARD_T + CARDH - 31, "WE SAY SKIP IT", 10.5, UI, 700, YELLOW_DARK));
  }
});

// the delta, sitting in the gutter between the two cards
const gx = PAD + CARDW + GAP / 2;
g.push(`<circle cx="${gx}" cy="${CARD_T + CARDH / 2}" r="27" fill="${YELLOW}"/>`);
g.push(mtext(gx, CARD_T + CARDH / 2, "+₹20k", 13, DISP, 700, YELLOW_DARK));

// ── the "nothing else changes" band ─────────────────────────────────────────
g.push(`<rect x="${PAD}" y="${SAME_T}" width="${inner}" height="${SAME_H}" rx="18" fill="${YELLOW_LIGHT}"/>`);
g.push(text(PAD + 28, SAME_T + 32, "IDENTICAL ON BOTH", 11.5, UI, 700, YELLOW_DARK));
let sx = PAD + 28;
SAME.forEach(([k, v], i) => {
  const label = `${k} ${v}`;
  g.push(ltext(sx, SAME_T + 66, k, 13, UI, 500, YELLOW_DARK));
  const kw = k.length * 13 * 0.52;
  g.push(ltext(sx + kw + 8, SAME_T + 66, v, 17, DISP, 700, YELLOW_DARK));
  sx += kw + 8 + v.length * 17 * 0.56 + 34;
  if (i < SAME.length - 1) g.push(`<circle cx="${sx - 19}" cy="${SAME_T + 66}" r="2.5" fill="${YELLOW_DARK}"/>`);
});

// ── footnote: says exactly what each pair figure is ─────────────────────────
g.push(text(PAD, FOOT_T, "Pair price is Phonak's own bundle where one is listed, otherwise twice the single price.", 14, UI, 400, MUTED));
g.push(text(PAD, FOOT_T + 26, "Want rechargeable properly? That conversation starts at Audeo L30-R, a whole platform up.", 15.5, UI, 600, YELLOW_DARK));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
