// Synva CTA PILL -> a subtle, reusable "go explore it yourself" button for a board.
//
// A good-looking compact pill: [cursor icon] <invite line> · synva.io ↗. NOT a
// help-desk "reach out" — an open invitation to go play with the site at their own
// pace. The URL is its OWN text node so Chintan links it in Figma (select it →
// right-click → Add link). Drop it on any board at the "…want to see for yourself?"
// beat.
//
// Board rules: strictly Synva tokens, single font-family per text, flat fills, real
// SVG centring, vector Lucide icon. Transparent background so it overlays anything.
//
// Run: npm run board:cta
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { ltext, tw, writeBoard } from "../../lib/svg.mjs";
import { INK, WHITE, BORDER, YELLOW_LIGHT, YELLOW_DARK, DISP, UI } from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-cta-pill.svg");

// ── EDIT PER VIDEO ────────────────────────────────────────────────────────────
// e.g. "Browse at your own pace" · "Play with the features, hands on" ·
//      "See the full details for yourself"
const INVITE = "Browse at your own pace";
const URL_TEXT = "synva.io";               // link this text to your URL in Figma
const ICON = "mouse-pointer-click";        // any Lucide name (hands-on / explore vibe)
// ──────────────────────────────────────────────────────────────────────────────

// ── icons ─────────────────────────────────────────────────────────────────────
const icon = await loadIcons([ICON, "arrow-up-right"]);

// ── layout (single row, vertically centred) ───────────────────────────────────
const H = 78, PAD = 28, TILE = 44, GAP = 16, INVITE_S = 20, URL_S = 16.5;
const cy = H / 2;
let x = PAD;
const tileY = (H - TILE) / 2;
const tileX = x;
x += TILE + GAP;
const inviteX = x;
x += Math.round(tw(INVITE, INVITE_S, 0.56)) + 20;
const divX = x;
x += 20;
const urlX = x;
x += Math.round(tw(URL_TEXT, URL_S, 0.56)) + 9;
const arrowX = x;
x += 18 + PAD;
const W = x;

const g = [];
g.push(`<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(`<rect x="${tileX}" y="${tileY}" width="${TILE}" height="${TILE}" rx="14" fill="${YELLOW_LIGHT}"/>`);
g.push(icon(ICON, tileX + 10, tileY + 10, 24, YELLOW_DARK, 2));
g.push(ltext(inviteX, cy, INVITE, INVITE_S, DISP, 700, INK));
g.push(`<line x1="${divX}" y1="${cy - 14}" x2="${divX}" y2="${cy + 14}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(ltext(urlX, cy, URL_TEXT, URL_S, UI, 700, YELLOW_DARK));
g.push(icon("arrow-up-right", arrowX, cy - 9, 18, YELLOW_DARK, 2.2));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
