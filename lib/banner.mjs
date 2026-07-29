// Title banner — the lockup that sits on top of a board.
//
// A white rounded bar with a bold yellow left accent, an optional kicker, the
// title, and the real Synva logo on the right.
//
// The drawing lives here rather than in one generator because the banner is
// needed BOTH as a reusable brand asset and per video, with different copy. When
// it was a script with `const TITLE = ...` at the top, using it for a video meant
// editing the brand file — which silently replaced the previous video's banner.
// Now `scripts/brand/make-title-banner.mjs` and any `scripts/<video>/make-trust.mjs`
// both call this, write to their own paths, and never collide.
//
// Board rules: strictly Synva tokens, single font-family, flat fills, real SVG
// centring, English only (rule 1b). Copy-only — no data.
import { logo } from "./brand.mjs";
import { text, wrap } from "./svg.mjs";
import { INK, WHITE, BORDER, YELLOW, YELLOW_DARK, DISP, UI } from "./tokens.mjs";

/**
 * titleBanner({ kicker, title, width })
 *   kicker  small eyebrow above the title; "" or omitted to hide it
 *   title   wraps as needed; the bar grows to fit
 *   width   defaults to 1328, which matches the lifestyle boards so it aligns
 *
 * Returns { w, h, body, xlink } — pass straight to writeBoard.
 */
export function titleBanner({ kicker = "", title, width = 1328 }) {
  const W = width, PAD = 44, TITLE_S = 46, LH = 52, LOGO_W = 150, ACCENT_W = 9;
  const textX = PAD + ACCENT_W + 28;
  const titleLines = wrap(title, W - textX - PAD - LOGO_W - 24, TITLE_S, 0.58);
  const kickerH = kicker ? 26 : 0;
  const blockH = kickerH + titleLines.length * LH - (LH - TITLE_S);
  const H = Math.round(Math.max(150, 44 * 2 + blockH));
  const blockTop = (H - blockH) / 2;

  const g = [];
  g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="24" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<rect x="${PAD}" y="${blockTop}" width="${ACCENT_W}" height="${blockH}" rx="4.5" fill="${YELLOW}"/>`);

  let ty = blockTop;
  if (kicker) {
    g.push(text(textX, ty + 15, kicker, 13, UI, 700, YELLOW_DARK));
    ty += kickerH;
  }
  titleLines.forEach((ln, k) =>
    g.push(text(textX, ty + TITLE_S - 8 + k * LH, ln, TITLE_S, DISP, 700, INK)),
  );
  g.push(logo(W - PAD, (H - 44) / 2, 44));

  return { w: W, h: H, xlink: true, body: g.join("\n") };
}
