// Styletto IX HOOK table -> compact website-styled SVG for the trailer.
//
// The small "at a glance" version of styletto-ix-comparison.svg: ONLY the frozen
// consumer headline specs (skill Rule 6) so it reads in a couple of seconds over
// a video hook — Price, Channels, Clarity in noise, Auto-adaptation, Warranty.
// Landscape, self-contained, drops into After Effects or a Figma board.
//
// STRICTLY Synva brand tokens (globals.css) — no invented tints. The 1-5 level is
// shown by the DIGIT, so every rating disc is the one Synva yellow (a heat ramp
// would need off-brand shades). Centred text uses text-anchor/dominant-baseline
// so digits sit dead-centre in every renderer (raster, After Effects, Figma).
//
// Same live data as the full board. Data pulled live 2026-07-21.
// Run: npm run board:styletto-hook
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("styletto-ix", "styletto-ix-hook.svg");

const ORDER = ["HA-005", "HA-004", "HA-003", "HA-002", "HA-001"];
const VAR = { "HA-005": "1IX", "HA-004": "2IX", "HA-003": "3IX", "HA-002": "5IX", "HA-001": "7IX" };

const models = await rest(`hearing_aid_models?id=in.(${ORDER.join(",")})&select=id,mrp,channels,warranty_years,perf_speech_noise,perf_auto_adapt`);
const byId = new Map(models.map((m) => [m.id, m]));

// ── helpers ──────────────────────────────────────────────────────────────────
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const disc = (cx, cy, score, r = 16) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${YELLOW}"/>` + mtext(cx, cy, String(score), 18, UI, 700, YELLOW_DARK);
const dash = (cx, cy) => `<line x1="${cx - 8}" y1="${cy}" x2="${cx + 8}" y2="${cy}" stroke="${SUBTLE}" stroke-width="2.5" stroke-linecap="round"/>`;

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 48, LABELW = 306, MCOL = 176;
const cardX = PAD, cardW = LABELW + 5 * MCOL, gridX = cardX + LABELW;
const rail = cardX + 26;
const cc = (i) => gridX + i * MCOL + MCOL / 2;
const W = PAD * 2 + cardW;
const T = 128, HEADH = 118, ROWH = 64;

const ROWS = [
  { label: "Channels", sub: "sound processing detail", kind: "num", get: (m) => m.channels },
  { label: "Clarity in noise", sub: "speech in loud places", kind: "score", get: (m) => m.perf_speech_noise },
  { label: "Auto-adaptation", sub: "adjusts as you move", kind: "score", get: (m) => m.perf_auto_adapt },
  { label: "Warranty", sub: "years covered by Synva", kind: "warranty", get: (m) => m.warranty_years },
];
const cardH = HEADH + ROWS.length * ROWH;
const H = T + cardH + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);
g.push(text(PAD, 58, "Which Styletto IX is right for you?", 34, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="70" width="58" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 102, "The five, at a glance. Ratings run 1 (basic) to 5 (best).", 16, UI, 400, MUTED));

// card fill, zebra rows (paper), flagship (7IX) column (yellow-light)
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="20" fill="${WHITE}"/>`);
ROWS.forEach((_, ri) => {
  if (ri % 2 === 1) g.push(`<rect x="${cardX + 1.5}" y="${T + HEADH + ri * ROWH}" width="${cardW - 3}" height="${ROWH}" fill="${PAPER}"/>`);
});
g.push(`<rect x="${gridX + 4 * MCOL}" y="${T + 1.5}" width="${MCOL}" height="${cardH - 3}" fill="${YELLOW_LIGHT}"/>`);
for (let i = 0; i <= 5; i++) g.push(`<line x1="${gridX + i * MCOL}" y1="${T}" x2="${gridX + i * MCOL}" y2="${T + cardH}" stroke="${BORDER}" stroke-width="1"/>`);

// header: tier + price per column
g.push(text(rail, T + 46, "The Styletto IX line", 16, DISP, 600, INK));
g.push(text(rail, T + 68, "Signia flagship, slim RIC", 12.5, UI, 400, SUBTLE));
g.push(text(rail, T + 96, "Price (MRP)", 12.5, UI, 600, BODY));
ORDER.forEach((id, i) => {
  const m = byId.get(id), x = cc(i);
  g.push(htext(x, T + 32, "STYLETTO", 10, UI, 700, SUBTLE));
  g.push(htext(x, T + 62, VAR[id], 30, DISP, 700, INK));
  g.push(`<rect x="${x - 16}" y="${T + 72}" width="32" height="5" rx="2.5" fill="${YELLOW}"/>`);
  g.push(htext(x, T + 100, m.mrp != null ? inr(m.mrp) : "On request", 18, DISP, 600, INK));
});
g.push(`<line x1="${cardX}" y1="${T + HEADH}" x2="${cardX + cardW}" y2="${T + HEADH}" stroke="${BORDER}" stroke-width="1.5"/>`);

// spec rows
ROWS.forEach((r, ri) => {
  const top = T + HEADH + ri * ROWH, cy = top + ROWH / 2;
  g.push(text(rail, cy - 4, r.label, 16.5, UI, 600, INK));
  g.push(text(rail, cy + 15, r.sub, 12, UI, 400, SUBTLE));
  ORDER.forEach((id, i) => {
    const v = r.get(byId.get(id));
    if (r.kind === "num") g.push(htext(cc(i), cy + 8, v != null ? String(v) : "—", 26, DISP, 700, INK));
    else if (r.kind === "score") g.push(v != null ? disc(cc(i), cy, Number(v)) : dash(cc(i), cy));
    else g.push(htext(cc(i), cy + 6, (v ?? "—") + " yr", 17, UI, 600, Number(v) >= 4 ? YELLOW_DARK : BODY));
  });
  if (ri < ROWS.length - 1) g.push(`<line x1="${cardX}" y1="${top + ROWH}" x2="${cardX + cardW}" y2="${top + ROWH}" stroke="${BORDER}" stroke-width="1"/>`);
});

g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="20" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
