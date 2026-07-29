// CTA pill — the soft "go explore it yourself" button.
//
// A compact row: [icon tile] <invite line> │ synva.io ↗. Deliberately NOT a
// help-desk "reach out" or "book now" — an open invitation to go play with the
// site at their own pace (Chintan, 2026-07-23). Keep that register.
//
// The URL is its OWN text node so Chintan can link it in Figma (select it,
// right-click, Add link). Figma cannot hyperlink part of a string.
//
// Lives in lib/ because the pill is used BOTH as a standalone brand asset and
// composed into per-video CTA boards. It used to be a script with constants at
// the top, so using it for a video meant editing the brand file and losing the
// previous video's copy.
//
// Transparent-friendly: the pill draws its own white background and nothing else,
// so it overlays any board.
import { loadIcons } from "./icons.mjs";
import { ltext, tw } from "./svg.mjs";
import { INK, WHITE, BORDER, YELLOW_LIGHT, YELLOW_DARK, DISP, UI } from "./tokens.mjs";

/**
 * ctaPill({ invite, urlText, icon, x, y })
 * Returns { w, h, body } — `body` is positioned at (x, y), so it can be dropped
 * into a bigger board or written out on its own at (0, 0).
 */
export async function ctaPill({
  invite = "Browse at your own pace",
  urlText = "synva.io",
  icon: iconName = "mouse-pointer-click",
  x: ox = 0,
  y: oy = 0,
} = {}) {
  const icon = await loadIcons([iconName, "arrow-up-right"]);

  const H = 78, PAD = 28, TILE = 44, GAP = 16, INVITE_S = 20, URL_S = 16.5;
  const cy = oy + H / 2;
  let x = ox + PAD;
  const tileY = oy + (H - TILE) / 2;
  const tileX = x;
  x += TILE + GAP;
  const inviteX = x;
  x += Math.round(tw(invite, INVITE_S, 0.56)) + 20;
  const divX = x;
  x += 20;
  const urlX = x;
  x += Math.round(tw(urlText, URL_S, 0.56)) + 9;
  const arrowX = x;
  x += 18 + PAD;
  const W = x - ox;

  const g = [];
  g.push(`<rect x="${ox + 1}" y="${oy + 1}" width="${W - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<rect x="${tileX}" y="${tileY}" width="${TILE}" height="${TILE}" rx="14" fill="${YELLOW_LIGHT}"/>`);
  g.push(icon(iconName, tileX + 10, tileY + 10, 24, YELLOW_DARK, 2));
  g.push(ltext(inviteX, cy, invite, INVITE_S, DISP, 700, INK));
  g.push(`<line x1="${divX}" y1="${cy - 14}" x2="${divX}" y2="${cy + 14}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(ltext(urlX, cy, urlText, URL_S, UI, 700, YELLOW_DARK));
  g.push(icon("arrow-up-right", arrowX, cy - 9, 18, YELLOW_DARK, 2.2));

  return { w: W, h: H, body: g.join("\n") };
}
