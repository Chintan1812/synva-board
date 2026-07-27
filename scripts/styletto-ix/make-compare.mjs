// Styletto IX comparison table -> website-styled SVG.
// - REAL manufacturer catalogue feature names (feature_library.feature_name),
//   NOT plain-English. Step-up ladder = the actual additive diff between tiers
//   (feature-ID set difference), the same logic the website's compare matrix uses.
// - Editable <text> (single Figma fonts: Bricolage Grotesque / Inter)
// - Vector Lucide icons (editable), flat fills only (plugin/Figma-import safe).
// Live data pulled from Supabase 2026-07-21.
// Run: npm run board:styletto-compare
import { boardOut } from "../../lib/paths.mjs";
import { kebab, loadIcons } from "../../lib/icons.mjs";
import { text, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("styletto-ix", "styletto-ix-compare.svg");

// Two off-palette greys this board predates the strict-token rule with: a swatch
// ring and a faint flagship-column tint. `npm run verify` flags both as warnings.
// Left as-is so the committed board stays byte-identical; retire them on the next
// visual pass (BORDER for the ring, PAPER for the tint).
const RING = "#C9C2B6";
const FLAG = "#FFFBEF";

// ── data (real catalogue names + icon_id from feature_library) ───────────────
const TWO = [["#f5f5f5", "#c0c0c0"], ["#1a1a1a", "#c0c0c0"]];
const SEVEN = [["#232323", "#141414"], ["#1a1a1a", "#5a5a5a"], ["#1a1a1a", "#c0c0c0"], ["#1e3a8a", "#d4af8f"], ["#f5f5f5", "#b76e79"], ["#f5f5f5", "#c0c0c0"], ["#f5f5f5", "#ececec"]];

const MODELS = [
  { v: "1IX", mrp: "1,49,990", ch: 16, war: 2, colors: TWO, label: "Where it starts", more: 0,
    adds: [["Bluetooth", "Direct audio streaming"], ["Navigation", "Augmented Focus"], ["Navigation", "Focus Stream"], ["Wind", "eWindScreen™"], ["ShieldOff", "Feedback cancellation"]] },
  { v: "2IX", mrp: "2,09,990", ch: 24, war: 2, colors: TWO, label: "Everything in the 1IX, plus", more: 0,
    adds: [["Music", "HD Music"], ["Navigation", "Adaptive directionality"], ["Ear", "Notch Therapy®"], ["Ear", "Ocean Waves Therapy Signal"], ["Ear", "Static Therapy Signal"]] },
  { v: "3IX", mrp: "3,49,990", ch: 32, war: 2, colors: SEVEN, label: "Everything in the 2IX, plus", more: 2,
    adds: [["Mic", "Own Voice Processing 2.0"], ["MessageSquare", "RealTime Conversation Enhancement"], ["MessageSquare", "Conversation Booster"], ["MessageSquare", "Conversation Source Analyzer"], ["Activity", "Motion sensor"]] },
  { v: "5IX", mrp: "4,99,990", ch: 36, war: 4, colors: SEVEN, label: "Everything in the 3IX, plus", more: 0,
    adds: [["Navigation", "SpeechFocus"], ["Smile", "Reverberant Room Program"], ["Navigation", "Spatial Configurator"]] },
  { v: "7IX", mrp: "7,24,990", ch: 48, war: 4, colors: SEVEN, label: "Everything in the 5IX, plus", more: 0,
    adds: [["Navigation", "Dynamic Focus Streams"], ["MessageSquare", "Conversation Dynamics Analyzer"], ["Navigation", "Spatial SpeechFocus"], ["Smile", "Auto EchoShield"], ["Smile", "Extended bandwidth"]] },
];
const SHARED = ["Slim Rechargeable RIC", "Fits mild to profound loss", "Portable charging case", "Same iconic Styletto look"];

// ── icons ───────────────────────────────────────────────────────────────────
const RAIL = ["sliders-horizontal", "shield-check", "palette", "sparkles", "indian-rupee"];
const ICON_NAMES = [...new Set([...MODELS.flatMap((m) => m.adds.map((a) => kebab(a[0]))), ...RAIL])];
const icon = await loadIcons(ICON_NAMES);

// ── helpers ─────────────────────────────────────────────────────────────────
function dot(cx, cy, r, p, sc) {
  const k = +(r * 0.7071).toFixed(2);
  const ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${RING}" stroke-width="1"/>`;
  if (p.toLowerCase() === sc.toLowerCase()) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p}"/>${ring}`;
  const a = `${cx + k} ${cy - k}`, b = `${cx - k} ${cy + k}`;
  return `<path d="M ${a} A ${r} ${r} 0 0 0 ${b} Z" fill="${p}"/><path d="M ${a} A ${r} ${r} 0 0 1 ${b} Z" fill="${sc}"/>${ring}`;
}

// ── layout ──────────────────────────────────────────────────────────────────
const W = 2040, PAD = 56, RAILW = 220, CGAP = 12;
const cardX = PAD, cardW = W - PAD * 2, gridX = cardX + RAILW;
const colW = Math.floor((cardW - RAILW - CGAP * 4) / 5);
const colX = (i) => gridX + i * (colW + CGAP);
const CPAD = 18;

const matrixTop = 210;
const ROWS = [
  { key: "header", h: 120 },
  { key: "features", h: 246, label: "What it adds", ic: "sparkles" },
  { key: "channels", h: 54, label: "Channels", ic: "sliders-horizontal" },
  { key: "warranty", h: 54, label: "Warranty", ic: "shield-check" },
  { key: "colours", h: 74, label: "Colours", ic: "palette" },
];
function rowTop(key) { let y = matrixTop; for (const r of ROWS) { if (r.key === key) return y; y += r.h; } }
const cardH = ROWS.reduce((a, r) => a + r.h, 0);
const H = matrixTop + cardH + PAD;
const rc = (key) => { const r = ROWS.find((x) => x.key === key); return r.h / 2 + 5; };

// ── build ───────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

g.push(text(PAD, 72, "The Styletto IX range, compared", 40, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="86" width="64" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 128, "Same slim shell. Each step up keeps everything below it, and adds a smarter brain.", 18, UI, 400, MUTED));

let sx = PAD;
g.push(text(sx, 173, "Every Styletto IX", 13, UI, 700, SUBTLE));
sx += 150;
for (const s of SHARED) {
  const wid = Math.round(s.length * 7.4) + 30;
  g.push(`<rect x="${sx}" y="158" width="${wid}" height="26" rx="13" fill="${WHITE}" stroke="${BORDER}" stroke-width="1"/>`);
  g.push(text(sx + 15, 175, s, 12.5, UI, 500, BODY));
  sx += wid + 10;
}

g.push(`<rect x="${cardX}" y="${matrixTop}" width="${cardW}" height="${cardH}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
// flagship column tint (behind dividers)
g.push(`<rect x="${colX(4)}" y="${matrixTop + 1.5}" width="${colW}" height="${cardH - 3}" fill="${FLAG}"/>`);
let yy = matrixTop;
for (const r of ROWS) {
  if (yy > matrixTop) g.push(`<line x1="${cardX}" y1="${yy}" x2="${cardX + cardW}" y2="${yy}" stroke="${BORDER}" stroke-width="1"/>`);
  yy += r.h;
}
g.push(`<line x1="${gridX - 6}" y1="${matrixTop}" x2="${gridX - 6}" y2="${matrixTop + cardH}" stroke="${BORDER}" stroke-width="1"/>`);

// rail
for (const r of ROWS) {
  if (r.key === "header") {
    const t = rowTop("header");
    g.push(icon("indian-rupee", cardX + CPAD, t + 30, 20, INK));
    g.push(text(cardX + CPAD + 28, t + 45, "PRICE", 13, UI, 700, INK));
    g.push(text(cardX + CPAD, t + 74, "Per pair, MRP", 12.5, UI, 400, SUBTLE));
    continue;
  }
  const t = rowTop(r.key);
  const cy = t + (r.key === "features" ? 40 : rc(r.key));
  g.push(icon(r.ic, cardX + CPAD, cy - 13, 20, INK));
  g.push(text(cardX + CPAD + 28, cy, r.label.toUpperCase(), 13, UI, 700, INK));
}

// columns
MODELS.forEach((m, i) => {
  const x = colX(i), cx = x + CPAD;

  const ht = rowTop("header");
  g.push(text(cx, ht + 30, "STYLETTO", 11, UI, 700, SUBTLE));
  g.push(text(cx, ht + 62, m.v, 32, DISP, 700, INK));
  g.push(`<rect x="${cx}" y="${ht + 72}" width="34" height="5" rx="2.5" fill="${YELLOW}"/>`);
  g.push(text(cx, ht + 104, "₹" + m.mrp, 21, DISP, 600, INK));

  const ft = rowTop("features");
  g.push(text(cx, ft + 26, m.label, 11, UI, 700, YELLOW_DARK));
  m.adds.forEach(([ic, label], k) => {
    const iy = ft + 46 + k * 34;
    g.push(icon(kebab(ic), cx, iy, 16, YELLOW_DARK, 2));
    g.push(text(cx + 25, iy + 12.5, label, 14, UI, 500, INK));
  });
  if (m.more > 0) {
    const iy = ft + 46 + m.adds.length * 34;
    g.push(text(cx + 25, iy + 12.5, "+ " + m.more + " more", 13, UI, 600, SUBTLE));
  }

  g.push(text(cx, rowTop("channels") + rc("channels"), m.ch + " channels", 15.5, UI, 500, INK));
  g.push(text(cx, rowTop("warranty") + rc("warranty"), m.war + " year warranty", 15.5, UI, 500, INK));

  const ct = rowTop("colours");
  const shown = m.colors.slice(0, 5);
  shown.forEach(([p, s], k) => g.push(dot(cx + 11 + k * 26, ct + 34, 11, p, s)));
  g.push(text(cx + 11 + shown.length * 26 + 6, ct + 39, m.colors.length + " finish" + (m.colors.length > 1 ? "es" : ""), 13.5, UI, 500, MUTED));
});

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), log: false });
console.log(`wrote ${OUT} (${W}x${H}); real catalogue feature names; icons: ${ICON_NAMES.join(", ")}`);
