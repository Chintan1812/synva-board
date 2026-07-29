// ENTRY board -> the HOOK. The first thing on screen, at 0%.
//
// ⚠️⚠️ THIS BOARD MUST NOT NAME THE FEATURE. Read this before editing.
//
// The frozen hook says: *"jis EK feature mein Phonak apne saare competitors se
// BEST hai, aapko pata hi nahi hoga, ki woh unke 50,000 wale device mein hai hi
// nahi."* The viewer is told a feature is MISSING. They are never told WHICH.
// That withholding is the open loop, and the loop is the reason anyone watches
// past sixty seconds.
//
// An earlier version of this board printed "Bluetooth: NONE" at 62px, because
// the ON SCREEN note in 02-hook.md said the cell must dominate. Chintan caught
// it: it answers the hook's question before he has finished saying his name.
// Both the note and the board are corrected (2026-07-29). **The reveal belongs
// to band50 (26%) and turn50 (33%).** If you are about to write the word
// Bluetooth on this board, stop.
//
// WHAT IT DOES CARRY, mirroring the hook's actual argument in order:
//   1. Both budgets fit the SAME hearing loss -> proved with the real range, so
//      the viewer cannot dismiss it as a claim.
//   2. Therefore the question is not your hearing loss, it is your LIFESTYLE.
//      That is the hook's thesis and the video's spine.
//   3. A REDACTED row where the feature belongs: present at ₹1,00,000, absent at
//      ₹50,000, unnamed at both. The shape of the answer without the answer.
//
// Phonak vs Phonak, never Phonak vs Signia — Signia answers the ₹50,000 problem
// and Chintan says so on camera at turn50, but the rival does not belong on the
// opening prop (Chintan, 2026-07-28).
//
// NO IMAGES: both columns are RIC devices that look alike, and nothing here is a
// shape argument (rule 8).
//
// PRICING: the column headers are the viewer's BUDGET BANDS, from the title. No
// MRP row — a price table invites spec-reading, and this board wants a question,
// not a comparison. The prices land on band50/band1l where they can be explained.
//
// rule 1b — English only. Data pulled live. Run: npm run board:phonak-entry
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "entry.svg");

// One representative per band: the entry Phonak, and the one Chintan recommends.
const COLS = [
  { id: "HA-262", band: "₹50,000", name: "Terra RIC-312", sub: "the entry Phonak", has: false },
  { id: "HA-315", band: "₹1,00,000", name: "Audeo I30-R Go", sub: "the one we recommend", has: true },
];

const rows = await rest(
  `hearing_aid_models?id=in.(${COLS.map((c) => c.id).join(",")})` +
    "&select=id,model_name,warranty_years,fitting_min,fitting_max",
);
const byId = new Map(rows.map((r) => [r.id, r]));

// GUARD. The board asserts in words that both devices cover the same hearing
// loss and the same warranty — the "same ear, double the price" claim the whole
// hook rests on. Prose cannot be checked by `npm run verify`, so it is checked
// here: if the catalogue stops supporting the sentence, the build fails loudly
// rather than putting something untrue on camera.
const [A, B] = COLS.map((c) => byId.get(c.id));
if (A.fitting_min !== B.fitting_min || A.fitting_max !== B.fitting_max) {
  throw new Error(
    `entry: the board claims both fit the same loss, but the catalogue says\n` +
      `  ${A.model_name}: ${A.fitting_min}-${A.fitting_max} dB\n` +
      `  ${B.model_name}: ${B.fitting_min}-${B.fitting_max} dB\n` +
      `Fix the copy or pick different representatives — do not ship the claim.`,
  );
}
if (A.warranty_years !== B.warranty_years) {
  throw new Error(
    `entry: the board claims the same warranty, but the catalogue says ` +
      `${A.warranty_years} vs ${B.warranty_years} years.`,
  );
}
const FIT = `${A.fitting_min} to ${A.fitting_max} dB`;
const WARR = `${A.warranty_years} years`;

const icon = await loadIcons(["lock", "ear"]);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const LABELW = 330, MCOL = 366;
const cardX = PAD, cardW = LABELW + COLS.length * MCOL, gridX = cardX + LABELW;
const rail = cardX + 28;
const cc = (i) => gridX + i * MCOL + MCOL / 2;
const W = PAD * 2 + cardW;

const T = 222, HEADH = 150;
const SAME_ROWH = 82;
const LOCK_ROWH = 188; // the withheld row, deliberately the biggest thing here

// Only facts that are IDENTICAL go above the line. Their sameness is the setup:
// if the hearing loss is the same, the decision has to be about something else.
const SAME = [
  { label: "Fits which hearing loss", sub: "the audiogram range it covers", value: FIT },
  { label: "Warranty", sub: "years covered", value: WARR },
];

const rowTop = [];
let acc = T + HEADH;
for (const r of SAME) { rowTop.push(acc); acc += SAME_ROWH; }
const lockT = acc;
acc += LOCK_ROWH;
const cardH = acc - T;
const H = T + cardH + 104 + PAD;

// ── pieces ───────────────────────────────────────────────────────────────────
const tick = (cx, cy, r = 20) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${YELLOW}"/>` +
  `<path d="M ${cx - 8} ${cy} l 5 5.5 l 10.5 -11" fill="none" stroke="${YELLOW_DARK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy, r = 20) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${SUBTLE}" stroke-width="2.2"/>` +
  `<path d="M ${cx - 7.5} ${cy - 7.5} L ${cx + 7.5} ${cy + 7.5} M ${cx + 7.5} ${cy - 7.5} L ${cx - 7.5} ${cy + 7.5}" stroke="${SUBTLE}" stroke-width="2.8" stroke-linecap="round"/>`;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "₹50,000 OR ₹1,00,000, IN PHONAK?";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));

g.push(text(PAD, 158, "It was never about your hearing loss", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "At both budgets Phonak fits the same ears. So the real question is your lifestyle.", 18, UI, 400, MUTED));

// card
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="${WHITE}"/>`);
for (let i = 0; i <= COLS.length; i++)
  g.push(`<line x1="${gridX + i * MCOL}" y1="${T}" x2="${gridX + i * MCOL}" y2="${T + cardH}" stroke="${BORDER}" stroke-width="1"/>`);

g.push(text(rail, T + 58, "Two budgets", 20, DISP, 600, INK));
g.push(text(rail, T + 86, "One of these is twice", 13.5, UI, 400, SUBTLE));
g.push(text(rail, T + 106, "the price of the other.", 13.5, UI, 400, SUBTLE));

COLS.forEach((c, i) => {
  const x = cc(i);
  g.push(htext(x, T + 62, c.band, 40, DISP, 700, INK));
  g.push(htext(x, T + 92, c.name, 17, DISP, 600, BODY));
  g.push(htext(x, T + 116, c.sub, 13, UI, 400, SUBTLE));
});
g.push(`<line x1="${cardX}" y1="${T + HEADH}" x2="${cardX + cardW}" y2="${T + HEADH}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── the identical rows: quiet, and the point is that they match ─────────────
SAME.forEach((r, ri) => {
  const top = rowTop[ri], cy = top + SAME_ROWH / 2;
  g.push(text(rail, cy - 4, r.label, 18, UI, 600, INK));
  g.push(text(rail, cy + 18, r.sub, 13, UI, 400, SUBTLE));
  COLS.forEach((c, i) => g.push(htext(cc(i), cy + 8, r.value, 22, DISP, 700, INK)));
  g.push(`<line x1="${cardX}" y1="${top + SAME_ROWH}" x2="${cardX + cardW}" y2="${top + SAME_ROWH}" stroke="${BORDER}" stroke-width="1"/>`);
});

// a quiet "identical" tag down the label rail, so the sameness is stated once
g.push(`<rect x="${gridX - 1}" y="${rowTop[0]}" width="${COLS.length * MCOL}" height="${SAME.length * SAME_ROWH}" fill="${PAPER}" opacity="0.6"/>`);
SAME.forEach((r, ri) => {
  const cy = rowTop[ri] + SAME_ROWH / 2;
  COLS.forEach((c, i) => g.push(htext(cc(i), cy + 8, r.value, 22, DISP, 700, INK)));
});

// ── the redacted row. The feature is NOT named. ─────────────────────────────
const lockCy = lockT + LOCK_ROWH / 2;
g.push(`<rect x="${cardX + 1.5}" y="${lockT}" width="${cardW - 3}" height="${LOCK_ROWH}" fill="${YELLOW_LIGHT}"/>`);
g.push(text(rail, lockCy - 26, "The one thing Phonak does", 19, DISP, 700, YELLOW_DARK));
g.push(text(rail, lockCy - 2, "better than anyone else", 19, DISP, 700, YELLOW_DARK));
g.push(text(rail, lockCy + 30, "You already know the brand.", 13.5, UI, 400, YELLOW_DARK));
g.push(text(rail, lockCy + 50, "You do not know this bit.", 13.5, UI, 600, YELLOW_DARK));

COLS.forEach((c, i) => {
  const x = cc(i);
  // a bar of redacted blocks — the shape of a word, without the word
  const blocks = [58, 34, 78, 26];
  const gap = 9;
  const totalW = blocks.reduce((a, b) => a + b, 0) + gap * (blocks.length - 1);
  let bx = x - totalW / 2;
  blocks.forEach((bw) => {
    g.push(`<rect x="${bx}" y="${lockCy - 46}" width="${bw}" height="20" rx="5" fill="${c.has ? YELLOW_DARK : SUBTLE}" opacity="${c.has ? 0.85 : 0.35}"/>`);
    bx += bw + gap;
  });

  if (c.has) {
    g.push(tick(x - 78, lockCy + 20));
    g.push(htext(x + 22, lockCy + 28, "It is in here", 20, DISP, 700, YELLOW_DARK));
  } else {
    g.push(cross(x - 92, lockCy + 20));
    g.push(htext(x + 16, lockCy + 28, "It is NOT in here", 20, DISP, 700, INK));
  }
  g.push(htext(x, lockCy + 62, c.has ? "and it is why people pay this" : "and nobody tells you that", 13.5, UI, 400, c.has ? YELLOW_DARK : SUBTLE));
});

g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── the close: restate the reframe, do not resolve the loop ────────────────
g.push(text(PAD, T + cardH + 56, "Same ears. Same warranty. Twice the price.", 22, DISP, 700, INK));
g.push(text(PAD, T + cardH + 88, "So the question was never which one suits your hearing loss. It is which one suits your life.", 16.5, UI, 400, MUTED));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
