// ENTRY board -> the hook, at 0%.
//
// WHAT THIS BOARD SHOWS: the four Audéo Infinio Ultra performance levels, their
// price per pair, and their fine-tuning channels. Nothing else. No feature names,
// no verdict, no Sphere. The hook's job is to make the SPREAD visible
// (₹1,54,000 to ₹8,75,000 for the same device) and then withhold the answer.
//
// ⚠️ THE DELTA STRIP IS THE LOOP. The three chips under the columns show what
// each step COSTS. The third one (I70 -> I90, +₹2,26,000) is the number the hook
// names and refuses to explain. Chintan covers that chip with a veil from
// brand/reveal-covers and lifts it at 55% on the `turn` board. Do not redesign
// the strip so the third chip stops being independently coverable.
//
// ⚠️ CHANNELS ARE VENDOR-VERIFIED, and they are the quiet argument here:
// 12 / 16 / 20 / 20. They stop climbing at I70 while the price keeps going.
// Confirmed against Phonak Audéo I Product Information, doc 027-0712-02.
//
// SPHERE IS DELIBERATELY ABSENT. The hook is about the four LEVELS. Adding the
// two Sphere SKUs here would make six columns and pre-empt the 46% beat.
//
// NO IMAGES: this is a price argument, not a shape argument (rule 8). Four RICs
// that look identical would imply the difference is cosmetic.
//
// Data pulled live 2026-08-13. Run: npm run board:infinio-entry
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-infinio-ladder", "entry.svg");

// Pair rows only. figma-board-svg rule 9: never double a Pcs price when a Pair
// row exists, and every one of these has one.
const LEVELS = [
  { id: "HA-271", level: "I30", tier: "Essential" },
  { id: "HA-270", level: "I50", tier: "Standard" },
  { id: "HA-269", level: "I70", tier: "Advanced" },
  { id: "HA-268", level: "I90", tier: "Premium" },
];

const rows = await rest(
  `hearing_aid_models?id=in.(${LEVELS.map((l) => l.id).join(",")})&select=id,model_name,mrp,unit,channels`,
);
const byId = new Map(rows.map((r) => [r.id, r]));
for (const l of LEVELS) {
  const r = byId.get(l.id);
  if (!r) throw new Error(`${l.id} missing from the catalogue — refusing to guess`);
  if (r.unit !== "Pair") throw new Error(`${l.id} is a ${r.unit} row, expected Pair`);
  l.mrp = r.mrp;
  l.channels = r.channels;
}

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const W = 1560;
const PAD = 56;
const inner = W - PAD * 2;
const g = [];

// ── header ───────────────────────────────────────────────────────────────────
const KICK = "THE SAME HEARING AID, FOUR PRICES";
const kw = KICK.length * 11.5 * 0.62 + 34;
g.push(`<rect x="${PAD}" y="64" width="${kw}" height="32" rx="16" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 17, 80, KICK, 11.5, UI, 700, YELLOW_DARK));
g.push(text(PAD, 169, "Phonak Audéo Infinio Ultra", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="188" width="72" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 232, "Same body. Same ear. Same fitting. Four performance levels.", 18, UI, 400, BODY));

// ── the four columns ─────────────────────────────────────────────────────────
const COL_T = 272;
const GAP = 22;
const cw = (inner - GAP * 3) / 4;
const COL_H = 296;

LEVELS.forEach((l, i) => {
  const x = PAD + i * (cw + GAP);
  const cx = x + cw / 2;
  g.push(`<rect x="${x}" y="${COL_T}" width="${cw}" height="${COL_H}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<rect x="${x}" y="${COL_T}" width="${cw}" height="6" rx="3" fill="${YELLOW}"/>`);

  g.push(htext(cx, COL_T + 74, l.level, 44, DISP, 700, INK));
  g.push(htext(cx, COL_T + 104, l.tier.toUpperCase(), 12.5, UI, 700, MUTED));

  g.push(`<line x1="${x + 28}" y1="${COL_T + 128}" x2="${x + cw - 28}" y2="${COL_T + 128}" stroke="${BORDER}" stroke-width="1.5"/>`);

  g.push(htext(cx, COL_T + 168, "PRICE PER PAIR", 11, UI, 700, SUBTLE));
  g.push(htext(cx, COL_T + 204, inr(l.mrp), 27, DISP, 700, INK));

  // channels sit in a paper chip so the 20/20 repeat reads as deliberate
  const chipW = cw - 56;
  g.push(`<rect x="${x + 28}" y="${COL_T + 228}" width="${chipW}" height="48" rx="12" fill="${PAPER}"/>`);
  g.push(mtext(cx, COL_T + 252, `${l.channels} channels`, 16.5, UI, 600, BODY));
});

// ── the delta strip: what each STEP costs ────────────────────────────────────
// Chip 3 is the veil target. Keep the three chips independent and evenly spaced.
const D_T = COL_T + COL_H + 58;
const D_H = 92;
g.push(text(PAD, D_T - 14, "WHAT EACH STEP COSTS YOU", 11.5, UI, 700, SUBTLE));

const deltas = [];
for (let i = 0; i < LEVELS.length - 1; i++) {
  deltas.push({
    from: LEVELS[i].level,
    to: LEVELS[i + 1].level,
    add: LEVELS[i + 1].mrp - LEVELS[i].mrp,
  });
}

const dw = (inner - GAP * 2) / 3;
deltas.forEach((d, i) => {
  const x = PAD + i * (dw + GAP);
  const cx = x + dw / 2;
  const last = i === deltas.length - 1;
  g.push(
    `<rect x="${x}" y="${D_T + 10}" width="${dw}" height="${D_H}" rx="18" fill="${last ? YELLOW_LIGHT : WHITE}" stroke="${last ? YELLOW : BORDER}" stroke-width="${last ? 2 : 1.5}"/>`,
  );
  g.push(htext(cx, D_T + 46, `${d.from}  →  ${d.to}`, 15, UI, 700, last ? YELLOW_DARK : MUTED));
  g.push(htext(cx, D_T + 84, `+ ${inr(d.add)}`, 30, DISP, 700, INK));
});

// ── footnote ─────────────────────────────────────────────────────────────────
const F_T = D_T + D_H + 46;
g.push(text(PAD, F_T, "Channels verified against Phonak Audéo I Product Information, doc 027-0712-02.", 14, UI, 400, SUBTLE));
g.push(text(PAD, F_T + 26, "Prices are MRP per pair from the live catalogue. Sphere models are a separate branch, covered later.", 14, UI, 400, SUBTLE));

const H = F_T + 26 + PAD;
g.unshift(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
