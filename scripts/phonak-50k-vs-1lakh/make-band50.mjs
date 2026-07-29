// BAND 50 board -> the ₹50,000 segment, three devices at the same money.
//
// WHAT THIS BOARD SHOWS: at ~₹50,000 a pair after discount you can buy a Phonak
// Terra, a Signia Orion C&G 50, or a Signia Sirion Connect 75. Same money. The
// board's whole job is to make one thing unmissable: Terra is the only one that
// gives you NEITHER rechargeable NOR Bluetooth.
//
// CROSS-BRAND RULE (research §4c): Phonak and Signia name the same capabilities
// differently, so a vendor-feature matrix across brands is misleading. Every row
// here is a spec that genuinely aligns, in plain language.
//
// Board rules (see .claude/skills/figma-board-svg/SKILL.md, it is authoritative):
//   • rule 6a — headline rows are MANUFACTURER-VERIFIABLE ONLY. Never print the
//     discount %; show the final pair price.
//   • rule 6d — perf_* are Synva's OWN 1-5 clinical ratings, not vendor specs.
//     They live in their own bordered panel, clearly labelled.
//   • strictly Synva tokens · one font-family per <text> · flat fills only
//   • real SVG centring (mtext / htext), never a hand-tuned x offset
//
// HARD RULE: **NO HINDI ON BOARDS** (Chintan, 2026-07-29). All board copy is
// English. Chintan speaks Hindi over it; the prop stays English so it also works
// as a thumbnail, a still, and on the website.
// Prices are **MRP, per pair** — no discounted figures on a board. The street
// price is his to say on camera, and MRP matches the public synva.io catalogue.
// Data pulled live. Run: npm run board:phonak-band50
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "band50.svg");

// ── the three devices, in the order Chintan reveals them ─────────────────────
const COLS = [
  { id: "HA-262", brand: "PHONAK", name: "Terra", sub: "RIC 312" },
  { id: "HA-140", brand: "SIGNIA", name: "Orion 50", sub: "Charge & Go", best: true },
  { id: "HA-141", brand: "SIGNIA", name: "Sirion 75", sub: "Connect" },
];

const rows = await rest(
  `hearing_aid_models?id=in.(${COLS.map((c) => c.id).join(",")})` +
    "&select=id,mrp,unit,channels,warranty_years,rechargeable,perf_speech_noise,perf_auto_adapt",
);
const byId = new Map(rows.map((r) => [r.id, r]));

// Bluetooth is the row the whole board turns on, so it is stated in plain
// language rather than the vendor's protocol name (ASHA + MFi / Universal).
const BT = { "HA-262": null, "HA-140": null, "HA-141": "Phone + TV" };

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const pairMrp = (m) => (m.unit === "Pcs" ? m.mrp * 2 : m.mrp);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const LABELW = 330, MCOL = 250;
const cardX = PAD, cardW = LABELW + COLS.length * MCOL, gridX = cardX + LABELW;
const rail = cardX + 28;
const cc = (i) => gridX + i * MCOL + MCOL / 2;
const W = PAD * 2 + cardW;
const T = 150, HEADH = 148, ROWH = 78;

const SPEC = [
  { label: "MRP", sub: "for a pair", kind: "price" },
  { label: "Channels", sub: "sound processing detail", kind: "num", get: (m) => m.channels },
  { label: "Bluetooth", sub: "phone calls, TV, streaming", kind: "bt" },
  { label: "Rechargeable", sub: "charge it, or change batteries", kind: "rech" },
  { label: "Warranty", sub: "years covered", kind: "warranty", get: (m) => m.warranty_years },
];

const cardH = HEADH + SPEC.length * ROWH;
const ASSESS_T = T + cardH + 34;

// Rule 6d panel. Chintan's verdict is stated in WORDS, not as perf_* discs:
// Orion C&G 50 and Sirion Connect 75 are two of the 37 Signia rows where
// perf_auto_adapt is still 0 (unrated), and perf_speech_noise reads 2 for all
// three — which would render as "Sirion is no better than Terra" and directly
// contradict what Chintan says on camera. Words are accurate; the numbers are
// not ready. Swap back to discs once those rows are rated.
const VERDICT = {
  "HA-262": "Solid",
  "HA-140": "Same as Terra",
  "HA-141": "Slightly better",
};
const assessH = 152;
const H = ASSESS_T + assessH + PAD;

// ── pieces ───────────────────────────────────────────────────────────────────
const tick = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="17" fill="${YELLOW}"/>` +
  `<path d="M ${cx - 7} ${cy} l 4.5 5 l 9 -10" fill="none" stroke="${YELLOW_DARK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="${BORDER}" stroke-width="2"/>` +
  `<path d="M ${cx - 6} ${cy - 6} L ${cx + 6} ${cy + 6} M ${cx + 6} ${cy - 6} L ${cx - 6} ${cy + 6}" stroke="${SUBTLE}" stroke-width="2.5" stroke-linecap="round"/>`;
const disc = (cx, cy, v) =>
  `<circle cx="${cx}" cy="${cy}" r="16" fill="${YELLOW}"/>` + mtext(cx, cy, String(v), 18, UI, 700, YELLOW_DARK);

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

g.push(text(PAD, 62, "At this budget, you have three options", 38, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="76" width="64" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 112, "Near enough the same MRP. Two things separate them.", 17, UI, 400, MUTED));

// card + zebra + best-seller column tint
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="${WHITE}"/>`);
SPEC.forEach((_, ri) => {
  if (ri % 2 === 1)
    g.push(`<rect x="${cardX + 1.5}" y="${T + HEADH + ri * ROWH}" width="${cardW - 3}" height="${ROWH}" fill="${PAPER}"/>`);
});
const bestIdx = COLS.findIndex((c) => c.best);
g.push(`<rect x="${gridX + bestIdx * MCOL}" y="${T + 1.5}" width="${MCOL}" height="${cardH - 3}" fill="${YELLOW_LIGHT}"/>`);
for (let i = 0; i <= COLS.length; i++)
  g.push(`<line x1="${gridX + i * MCOL}" y1="${T}" x2="${gridX + i * MCOL}" y2="${T + cardH}" stroke="${BORDER}" stroke-width="1"/>`);

// header
g.push(text(rail, T + 52, "One budget, three devices", 18, DISP, 600, INK));
g.push(text(rail, T + 76, "MRP within a few hundred rupees", 13, UI, 400, SUBTLE));

COLS.forEach((c, i) => {
  const x = cc(i);
  g.push(htext(x, T + 36, c.brand, 11, UI, 700, SUBTLE));
  g.push(htext(x, T + 70, c.name, 27, DISP, 700, INK));
  g.push(htext(x, T + 92, c.sub, 12.5, UI, 400, SUBTLE));
  if (c.best) {
    const bw = 110;
    g.push(`<rect x="${x - bw / 2}" y="${T + 108}" width="${bw}" height="26" rx="13" fill="${YELLOW}"/>`);
    g.push(mtext(x, T + 121, "BEST SELLER", 10, UI, 700, YELLOW_DARK));
  }
});
g.push(`<line x1="${cardX}" y1="${T + HEADH}" x2="${cardX + cardW}" y2="${T + HEADH}" stroke="${BORDER}" stroke-width="1.5"/>`);

// spec rows
SPEC.forEach((r, ri) => {
  const top = T + HEADH + ri * ROWH, cy = top + ROWH / 2;
  g.push(text(rail, cy - 4, r.label, 17.5, UI, 600, INK));
  g.push(text(rail, cy + 17, r.sub, 12.5, UI, 400, SUBTLE));

  COLS.forEach((c, i) => {
    const m = byId.get(c.id), x = cc(i);
    if (r.kind === "price") {
      g.push(htext(x, cy + 8, inr(pairMrp(m)), 24, DISP, 700, INK));
    } else if (r.kind === "num") {
      g.push(htext(x, cy + 9, String(r.get(m)), 28, DISP, 700, INK));
    } else if (r.kind === "bt") {
      if (BT[c.id]) {
        g.push(tick(x, cy - 6));
        g.push(htext(x, cy + 26, BT[c.id], 12.5, UI, 500, BODY));
      } else {
        g.push(cross(x, cy - 6));
        g.push(htext(x, cy + 26, "none", 12.5, UI, 600, SUBTLE));
      }
    } else if (r.kind === "rech") {
      if (m.rechargeable) {
        g.push(tick(x, cy - 6));
        g.push(htext(x, cy + 26, "just charge it", 12.5, UI, 500, BODY));
      } else {
        g.push(cross(x, cy - 6));
        g.push(htext(x, cy + 26, "change batteries", 12.5, UI, 600, SUBTLE));
      }
    } else {
      g.push(htext(x, cy + 8, r.get(m) + " years", 18, UI, 600, BODY));
    }
  });
  if (ri < SPEC.length - 1)
    g.push(`<line x1="${cardX}" y1="${top + ROWH}" x2="${cardX + cardW}" y2="${top + ROWH}" stroke="${BORDER}" stroke-width="1"/>`);
});
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── "Synva's assessment" — rule 6d: fenced, labelled, never a spec row ───────
g.push(`<rect x="${cardX}" y="${ASSESS_T}" width="${cardW}" height="${assessH}" rx="22" fill="${PAPER}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(text(rail, ASSESS_T + 42, "Synva's assessment", 20, DISP, 700, INK));
g.push(text(rail, ASSESS_T + 66, "How these actually perform in our fittings.", 13, UI, 400, SUBTLE));
g.push(text(rail, ASSESS_T + 86, "Our own read, not a manufacturer spec.", 13, UI, 600, YELLOW_DARK));
for (let i = 0; i <= COLS.length; i++)
  g.push(`<line x1="${gridX + i * MCOL}" y1="${ASSESS_T + 16}" x2="${gridX + i * MCOL}" y2="${ASSESS_T + assessH - 16}" stroke="${BORDER}" stroke-width="1"/>`);

COLS.forEach((c, i) => {
  const cy = ASSESS_T + assessH / 2;
  g.push(htext(cc(i), cy + 8, VERDICT[c.id], 21, DISP, 700, c.id === "HA-141" ? YELLOW_DARK : INK));
});

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
