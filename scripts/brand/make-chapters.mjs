// Synva CHAPTERS / agenda card -> website-styled SVG for a video intro.
//
// The "what we'll cover" card shown near the start of a video. REUSABLE across
// videos: edit HEADER + CHAPTERS below (2 or 3 entries), re-run. The tile row and
// canvas grow with the chapter count; tile heights stay uniform.
//
// Board rules (skill): strictly Synva tokens (globals.css), single font-family
// per <text>, vector Lucide <path> icons, FLAT fills only (no gradients/filters),
// real SVG centring (text-anchor / dominant-baseline). Copy-only, no live data.
// Free-size — sized to content, not to a video frame (DESIGN.md "Canvas & size").
//
// Run: npm run board:chapters
import { boardOut } from "../../lib/paths.mjs";
import { kebab, loadIcons } from "../../lib/icons.mjs";
import { logo, soundwave, WAVE_RATIO } from "../../lib/brand.mjs";
import { text, mtext, wrap, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-chapters.svg");

// ── EDIT PER VIDEO ────────────────────────────────────────────────────────────
const HEADER = { eyebrow: "In this video", title: "What we'll cover" };
const CHAPTERS = [
  {
    icon: "layout-grid",
    title: "The five models, compared",
    sub: "What sets them apart, and what each costs",
  },
  {
    icon: "compass",
    title: "Matched to your lifestyle",
    sub: "Which model actually fits your life",
  },
];
// ──────────────────────────────────────────────────────────────────────────────

// ── icons (Lucide __iconNode -> flat vector <path>) ───────────────────────────
const ICON_NAMES = [...new Set(CHAPTERS.map((c) => kebab(c.icon)))];
const icon = await loadIcons(ICON_NAMES);

// ── layout constants ──────────────────────────────────────────────────────────
const PAD = 68;               // outer padding
const TILE_W = 604, GAP = 44, CPAD = 40;
const INNER = TILE_W - CPAD * 2;
const N = CHAPTERS.length;

// header block
const EYE_S = 13, HEAD_S = 54, headTop = PAD;
const eyeH = 34, eyeBase = headTop + 23;
const headBase = headTop + eyeH + 16 + HEAD_S;   // headline baseline
const underY = headBase + 16;
const tilesTop = underY + 52;

// chapter tile content geometry (offsets from a tile's top-left)
const ICON_Y = 42, ICON_SZ = 74, NUM_S = 100;
const DIV_Y = 152;
const TITLE_S = 32, LH_T = 42, SUB_S = 19, LH_S = 29;
const TITLE_BASE0 = 208;      // first title-line baseline
const BOTTOM_RESERVE = 100;   // room below the last sub line for the progress track

// pre-wrap each chapter, find the uniform tile height
const laid = CHAPTERS.map((c) => {
  const titleLines = wrap(c.title, INNER, TITLE_S, 0.58);
  const subLines = c.sub ? wrap(c.sub, INNER, SUB_S, 0.53) : [];
  const lastTitle = TITLE_BASE0 + (titleLines.length - 1) * LH_T;
  const firstSub = lastTitle + 38;
  const lastSub = subLines.length ? firstSub + (subLines.length - 1) * LH_S : lastTitle;
  return { ...c, titleLines, subLines, firstSub, bottom: lastSub + BOTTOM_RESERVE };
});
const TILE_H = Math.max(348, ...laid.map((l) => l.bottom));

const W = PAD * 2 + N * TILE_W + (N - 1) * GAP;
const WAVE_W = 460, WAVE_H = WAVE_W * WAVE_RATIO; // centred brand soundwave
const WAVE_GAP = 44;
const waveY = tilesTop + TILE_H + WAVE_GAP;
const H = Math.round(waveY + WAVE_H + PAD);
const tileX = (i) => PAD + i * (TILE_W + GAP);

// ── build ─────────────────────────────────────────────────────────────────────
const g = [];
// canvas (rounded paper card)
g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`);

// header — eyebrow pill (text centred inside the pill, both axes)
const eyeW = Math.round(tw(HEADER.eyebrow, EYE_S, 0.56)) + 40;
g.push(`<rect x="${PAD}" y="${headTop}" width="${eyeW}" height="${eyeH}" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + eyeW / 2, headTop + eyeH / 2, HEADER.eyebrow, EYE_S, UI, 700, YELLOW_DARK));
// headline + underline
g.push(text(PAD, headBase, HEADER.title, HEAD_S, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="${underY}" width="76" height="7" rx="3.5" fill="${YELLOW}"/>`);
// the real Synva wordmark (design-system asset), top-right
g.push(logo(W - PAD, headTop + 28, 50));

// chapter tiles
laid.forEach((c, i) => {
  const x = tileX(i), y = tilesTop, cx = x + CPAD;
  // tile card
  g.push(`<rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="26" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  // icon tile (yellow-light) + glyph
  g.push(`<rect x="${cx}" y="${y + ICON_Y}" width="${ICON_SZ}" height="${ICON_SZ}" rx="20" fill="${YELLOW_LIGHT}"/>`);
  g.push(icon(kebab(c.icon), cx + (ICON_SZ - 36) / 2, y + ICON_Y + (ICON_SZ - 36) / 2, 36, YELLOW_DARK, 2.1));
  // big chapter number, right aligned
  const num = String(i + 1).padStart(2, "0");
  g.push(text(x + TILE_W - CPAD, y + ICON_Y + 82, num, NUM_S, DISP, 700, YELLOW, "end"));
  // hairline divider under the badge row
  g.push(`<line x1="${cx}" y1="${y + DIV_Y}" x2="${x + TILE_W - CPAD}" y2="${y + DIV_Y}" stroke="${BORDER}" stroke-width="1"/>`);
  // title lines
  c.titleLines.forEach((ln, k) => g.push(text(cx, y + TITLE_BASE0 + k * LH_T, ln, TITLE_S, DISP, 700, INK)));
  // sub lines
  c.subLines.forEach((ln, k) => g.push(text(cx, y + c.firstSub + k * LH_S, ln, SUB_S, UI, 400, MUTED)));
  // chapter progress track — how far into the video this chapter sits
  const trackY = y + TILE_H - 44;
  g.push(`<rect x="${cx}" y="${trackY}" width="${INNER}" height="6" rx="3" fill="${YELLOW_LIGHT}"/>`);
  g.push(`<rect x="${cx}" y="${trackY}" width="${Math.round(INNER * (i + 1) / N)}" height="6" rx="3" fill="${YELLOW}"/>`);
});

// closing brand soundwave (design-system signature), centred at the foot,
// in the logo's dark-yellow so the two brand marks bookend the board
g.push(soundwave((W - WAVE_W) / 2, waveY, WAVE_W, YELLOW_DARK));

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), log: false });
console.log(`wrote ${OUT} (${W}x${H}); ${N} chapters; icons: ${ICON_NAMES.join(", ")}`);
