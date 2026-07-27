// SVG primitives shared by every board.
//
// Two rules are baked in here and must never be relaxed:
//   • text carries a SINGLE font-family (no fallback stack) — Figma's importer
//     mis-sizes and wraps stacked-font text.
//   • centring is real SVG centring (text-anchor / dominant-baseline), never a
//     hand-computed x offset — an offset drifts per digit and per font. The
//     plugin honours both attributes.
import fs from "node:fs";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Left-aligned text on a baseline. `anchor` optionally switches to middle/end. */
export const text = (x, y, s, size, font, weight, fill, anchor) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor ? ` text-anchor="${anchor}"` : ""}>${esc(s)}</text>`;

/** Horizontally centred on cx, sitting on baseline y. */
export const htext = (cx, y, s, size, font, weight, fill) =>
  `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;

/** Fully centred on (cx, cy) — the correct way to put a digit inside a disc. */
export const mtext = (cx, cy, s, size, font, weight, fill) =>
  `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;

/** Left-aligned but vertically centred on cy — for text beside an icon tile. */
export const ltext = (x, cy, s, size, font, weight, fill) =>
  `<text x="${x}" y="${cy}" dominant-baseline="central" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;

/**
 * Estimated rendered width. Boards are generated headless, so there is no font
 * metric available — a per-font character factor is close enough for sizing
 * pills and wrapping, and the PNG verify step catches anything that overflows.
 * Typical factors: 0.56 for Inter labels, 0.58 for Bricolage display.
 */
export const tw = (s, size, factor) => String(s).length * size * factor;

/** Greedy word wrap using the same width estimate. */
export function wrap(s, maxW, size, factor) {
  const words = String(s).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (t.length * size * factor > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * An embedded raster. PNG or JPEG data URIs only — Figma's createImage rejects
 * webp, so convert at generation time (see brand.mjs pngDataUri).
 * Both href and xlink:href are emitted for renderer compatibility.
 */
export const image = (href, x, y, w, h) =>
  `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="${href}" xlink:href="${href}"/>`;

/** A two-tone finish disc: two flat half-circles, never a gradient. */
export function swatchDot(cx, cy, r, primary, secondary, ring = "#1A1A1A") {
  const k = +(r * 0.7071).toFixed(2);
  const a = `${cx + k} ${cy - k}`;
  const b = `${cx - k} ${cy + k}`;
  return (
    `<path d="M ${a} A ${r} ${r} 0 0 0 ${b} Z" fill="${primary}"/><path d="M ${a} A ${r} ${r} 0 0 1 ${b} Z" fill="${secondary}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring}" stroke-opacity="0.15" stroke-width="1.25"/>`
  );
}

/**
 * Write a board. `xlink` must be true for any board containing an <image>.
 * Returns the path so a generator can log it.
 */
export function writeBoard(out, { w, h, body, xlink = false, log = true }) {
  const ns = xlink
    ? `xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`
    : `xmlns="http://www.w3.org/2000/svg"`;
  fs.writeFileSync(
    out,
    `<svg ${ns} width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${body}
</svg>
`,
  );
  if (log) console.log(`wrote ${out} (${w}x${h})`);
  return out;
}
