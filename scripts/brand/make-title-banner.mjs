// Synva VIDEO TITLE BANNER -> a title lockup to sit on top of a board.
//
// Reusable: edit KICKER + TITLE below, re-run. A white rounded bar with a bold
// yellow left accent, an optional kicker, the title, and the logo on the right.
// Free-size (W matches the lifestyle boards so it aligns on top; resize in Figma).
//
// Board rules: strictly Synva tokens, single font-family, flat fills, real SVG
// centring. Copy-only.
//
// Run: npm run board:title-banner
import { boardOut } from "../../lib/paths.mjs";
import { logo } from "../../lib/brand.mjs";
import { text, wrap, writeBoard } from "../../lib/svg.mjs";
import { INK, WHITE, BORDER, YELLOW, YELLOW_DARK, DISP, UI } from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-title-banner.svg");

// ── EDIT PER VIDEO ────────────────────────────────────────────────────────────
const KICKER = "Synva Hearing";                 // small eyebrow; set "" to hide
const TITLE = "Which Styletto is right for you?";
// ──────────────────────────────────────────────────────────────────────────────

// ── layout ────────────────────────────────────────────────────────────────────
const W = 1328, PAD = 44, TITLE_S = 46, LH = 52, LOGO_W = 150, ACCENT_W = 9;
const textX = PAD + ACCENT_W + 28;
const titleLines = wrap(TITLE, W - textX - PAD - LOGO_W - 24, TITLE_S, 0.58);
const kickerH = KICKER ? 26 : 0;
const blockH = kickerH + titleLines.length * LH - (LH - TITLE_S);
const H = Math.round(Math.max(150, 44 * 2 + blockH));
const blockTop = (H - blockH) / 2;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="24" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
// yellow left accent bar
g.push(`<rect x="${PAD}" y="${blockTop}" width="${ACCENT_W}" height="${blockH}" rx="4.5" fill="${YELLOW}"/>`);
// kicker + title
let ty = blockTop;
if (KICKER) { g.push(text(textX, ty + 15, KICKER, 13, UI, 700, YELLOW_DARK)); ty += kickerH; }
titleLines.forEach((ln, k) => g.push(text(textX, ty + TITLE_S - 8 + k * LH, ln, TITLE_S, DISP, 700, INK)));
// logo, vertically centred
g.push(logo(W - PAD, (H - 44) / 2, 44));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
