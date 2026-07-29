// MRP NOTE board -> the pricing disclaimer, shown ONCE before any price board.
//
// WHAT THIS BOARD SHOWS: the gap between the number on the board and the number
// you pay — as a picture, not a list. A real MRP on the left, a deliberately
// blank "?" on the right, and the discount as the arrow between them. Chintan can
// point at the "?" and say "this one, only a clinic can fill in".
//
// Chintan asked for this (2026-07-29): boards carry MRP while he talks in street
// prices, so without this beat the two look like a contradiction.
//
// NO SYNVA NUDGE ON THIS BOARD (Chintan, 2026-07-29). An earlier cut ended on an
// "ask us too, and compare" chip; he removed it — we do not want to push the viewer
// toward calling us off a pricing disclaimer. The board explains MRP and stops. The
// ask lives in the CTA board, where it belongs. Do not add it back.
//
// Board rules: English only (rule 1b) · Synva tokens · flat fills · real centring.
// Run: npm run board:phonak-mrp-note
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, writeBoard } from "../../lib/svg.mjs";
import { boardHeader } from "../../lib/callout.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "mrp-note.svg");

// A real price from this video, pulled live so it can never drift from the boards.
const [example] = await rest("hearing_aid_models?id=eq.HA-275&select=mrp,unit");
const pairMrp = example.unit === "Pcs" ? example.mrp * 2 : example.mrp;
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const W = 1240;
const inner = W - PAD * 2;
const CARDW = 468, ARROWW = inner - CARDW * 2;

// Header comes from the shared helper, not hand-built — it owns the kicker-to-
// title spacing, which is measured to the title's cap top rather than its
// baseline (see lib/callout.mjs).
const head = boardHeader({
  kicker: "BEFORE WE LOOK AT ANY PRICE",
  title: "Every price you see is MRP",
  sub: "The number on the box. Not the number you pay.",
  inner,
});

const CARD_T = head.contentT + 20, CARDH = 232;
const CHIP_T = CARD_T + CARDH + 52;
const H = CHIP_T + 62 + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);
g.push(...head.nodes);

// ── left plate: the MRP, a real one ─────────────────────────────────────────
const lx = PAD, cy = CARD_T + CARDH / 2;
g.push(`<rect x="${lx}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(htext(lx + CARDW / 2, CARD_T + 48, "WHAT THE BOARD SHOWS", 11.5, UI, 700, SUBTLE));
g.push(mtext(lx + CARDW / 2, cy + 6, inr(pairMrp), 58, DISP, 700, INK));
g.push(htext(lx + CARDW / 2, CARD_T + CARDH - 38, "MRP, a pair. Same at every clinic.", 14.5, UI, 400, MUTED));

// ── the arrow: the discount ─────────────────────────────────────────────────
const ax = lx + CARDW, acx = ax + ARROWW / 2;
g.push(htext(acx, cy - 34, "minus", 13, UI, 700, SUBTLE));
g.push(htext(acx, cy - 12, "the discount", 15, DISP, 700, YELLOW_DARK));
const ay = cy + 16;
g.push(`<line x1="${acx - 44}" y1="${ay}" x2="${acx + 30}" y2="${ay}" stroke="${YELLOW}" stroke-width="7" stroke-linecap="round"/>`);
g.push(`<path d="M ${acx + 20} ${ay - 16} L ${acx + 44} ${ay} L ${acx + 20} ${ay + 16}" fill="none" stroke="${YELLOW}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
g.push(htext(acx, cy + 60, "different everywhere", 13, UI, 400, SUBTLE));

// ── right plate: the blank. This is the one he points at. ───────────────────
const rx = ax + ARROWW;
g.push(`<rect x="${rx}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${YELLOW_LIGHT}"/>`);
g.push(`<rect x="${rx}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="22" fill="none" stroke="${YELLOW}" stroke-width="2.5" stroke-dasharray="10 8"/>`);
g.push(htext(rx + CARDW / 2, CARD_T + 48, "WHAT YOU ACTUALLY PAY", 11.5, UI, 700, YELLOW_DARK));
g.push(mtext(rx + CARDW / 2, cy + 6, "?", 66, DISP, 700, YELLOW_DARK));
g.push(htext(rx + CARDW / 2, CARD_T + CARDH - 38, "Only a clinic can fill this in.", 14.5, UI, 600, YELLOW_DARK));

// ── chips: the plain consequence. No call to action, by decision. ───────────
const CHIPS = [
  "Every clinic discounts differently",
  "So ask before you decide",
];
let cxp = PAD;
CHIPS.forEach((t) => {
  const w = t.length * 15.5 * 0.55 + 56;
  g.push(
    `<rect x="${cxp}" y="${CHIP_T}" width="${w}" height="52" rx="26" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`,
  );
  g.push(ltext(cxp + 26, CHIP_T + 26, t, 15.5, UI, 500, BODY));
  cxp += w + 16;
});

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
