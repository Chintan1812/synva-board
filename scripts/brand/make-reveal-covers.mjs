// Synva REVEAL COVERS -> a kit of frosted "veil" panels to sit on top of a board.
//
// Drop a veil over any part of a board, then delete/slide it away to reveal, one
// piece at a time on camera. A true blur is an SVG <filter> (breaks the Figma
// import), so a veil is a TRANSLUCENT white panel (a hint shows through). For real
// frosted glass, select a veil in Figma -> Effects -> Background blur.
//
// Board rules: strictly Synva tokens, single font-family, flat fills (fill-opacity
// is flat, not a filter — allowed), real SVG centring. Copy-only.
//
// Run: npm run board:reveal-covers
import { boardOut } from "../../lib/paths.mjs";
import { logo } from "../../lib/brand.mjs";
import { text, mtext, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-reveal-covers.svg");

// THE VEIL — a translucent frosted panel (import-safe: fill-opacity, no <filter>)
const veil = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${WHITE}" fill-opacity="0.82" stroke="${INK}" stroke-opacity="0.12" stroke-width="1.5"/>`;

const W = 1240, PAD = 48;
const g = [];
// canvas
const HEAD_H = 200, DEMO_H = 230, KIT_H = 360, H = PAD + HEAD_H + DEMO_H + 60 + KIT_H + 72;
g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`);

// ── header ────────────────────────────────────────────────────────────────────
const eyeW = Math.round(tw("Reveal kit", 13, 0.56)) + 40;
g.push(`<rect x="${PAD}" y="${PAD}" width="${eyeW}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + eyeW / 2, PAD + 17, "Reveal kit", 13, UI, 700, YELLOW_DARK));
g.push(logo(W - PAD, PAD - 4, 44));
g.push(text(PAD, PAD + 92, "Frosted covers", 42, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="${PAD + 108}" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
[
  "Drop a veil over any part of a board, then delete or slide it away",
  "to reveal, one piece at a time.",
].forEach((ln, k) => g.push(text(PAD, PAD + 146 + k * 22, ln, 15, UI, 400, MUTED)));

// ── demo: a veil over a colour band so the frosting is visible ────────────────
const dY = PAD + HEAD_H + 8;
g.push(text(PAD, dY, "How it looks", 13, UI, 700, SUBTLE));
const cardY = dY + 20, cardW = W - PAD * 2, cardH = DEMO_H - 46;
g.push(`<rect x="${PAD}" y="${cardY}" width="${cardW}" height="${cardH}" rx="18" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
// a full-width yellow band + text — real content for the veil to frost
g.push(`<rect x="${PAD + 26}" y="${cardY + 24}" width="${cardW - 52}" height="42" rx="10" fill="${YELLOW}"/>`);
g.push(text(PAD + 44, cardY + 51, "The pick you reveal lives on this row", 15, UI, 700, YELLOW_DARK));
["Signia Styletto 7IX is the flagship model.", "Everyone lands in one of three budget tiers."].forEach((ln, k) =>
  g.push(text(PAD + 26, cardY + 96 + k * 30, ln, 16, UI, 500, BODY)));
// the veil over the RIGHT ~45% — that half reads frosted, the left stays clear
const vX = Math.round(PAD + cardW * 0.55);
g.push(veil(vX, cardY, PAD + cardW - vX, cardH));
g.push(text(PAD + 26, cardY + cardH + 22, "revealed", 12.5, UI, 700, SUBTLE));
g.push(text(vX + 14, cardY + cardH + 22, "still under the veil (frosted)", 12.5, UI, 700, SUBTLE));

// ── kit: grab-able veils at a few sizes ───────────────────────────────────────
const kY = dY + DEMO_H + 56;
g.push(text(PAD, kY, "Grab a veil, resize it over your content, delete to reveal", 13, UI, 700, SUBTLE));
const VEILS = [
  { label: "Small", use: "a chip or a stat", w: 200, h: 118 },
  { label: "Card", use: "one card", w: 250, h: 150 },
  { label: "Column", use: "a whole column", w: 176, h: 300 },
  { label: "Full-width", use: "a wide region", w: 300, h: 150 },
];
let vx = PAD;
const topY = kY + 22;
for (const v of VEILS) {
  g.push(veil(vx, topY, v.w, v.h));
  g.push(mtext(vx + v.w / 2, topY + v.h / 2, "veil", 13, UI, 700, INK));
  g.push(text(vx, topY + v.h + 26, v.label, 15, DISP, 700, INK));
  g.push(text(vx, topY + v.h + 46, v.use, 12.5, UI, 400, MUTED));
  vx += v.w + 34;
}

// footer tip
g.push(text(PAD, H - 34, "Want a real blur? Select a veil in Figma, then Effects, Background blur. It stays import-safe.", 13, UI, 500, SUBTLE));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
