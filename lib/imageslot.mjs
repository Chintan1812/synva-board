// Image slot — a 1:1 picture area on a board.
//
// Chintan's call (2026-07-29, revised): boards **embed the real render**. Pass
// `uri` (a PNG data URI, normally from lib/phonak-renders.mjs) and the square is
// filled with the actual device. Omit it and you get a dashed placeholder plus
// whatever reference text you pass — the fallback for a model with no render,
// or for a brand with no local library (Signia).
//
// **The picture area is 1:1** (his ask). Label, caption and any reference line
// sit BELOW the square, never inside it — otherwise the text eats the space the
// image was reserved for and the frame is no longer square in practice. The
// layout maths is identical either way, so a board does not shift when a render
// is added or removed.
//
// PNG only: Figma's `createImage` will not take webp and `npm run verify` errors
// on a non-PNG embed. A board with any <image> must pass `xlink: true` to
// writeBoard, or verify errors on the missing declaration.
//
// WHERE SLOTS BELONG (Chintan, 2026-07-29). Not every board:
//   • product-comparison boards where the SHAPE is the argument -> yes
//     (brand/form-factors, cheezein, band1l)
//   • argument boards -> no (band50, entry, turn50, mrp-note, common, delta,
//     bonus, trust, plan, cta)
// Consistency is by board TYPE, so a mixed set reads as intentional rather than
// unfinished. "Product boards carry the device; argument boards carry the
// argument."
//
// The URL is a SEPARATE text node on purpose, exactly like the CTA pill's
// synva.io line: Figma cannot hyperlink part of a string, so it has to stand
// alone to be selectable and linkable.
import { text, htext, mtext, ltext, image } from "./svg.mjs";
import { BORDER, SUBTLE, MUTED, INK, WHITE, YELLOW, YELLOW_DARK, YELLOW_LIGHT, UI, DISP } from "./tokens.mjs";

// `storageUrl()` lives in lib/supabase.mjs — import it from there, do not add a
// second copy here.

const LABEL_H = 22, CAPTION_H = 19, URL_H = 16, TEXT_GAP = 14;

/** Total height of a slot, so a caller can lay out before drawing. */
export function imageSlotHeight({ size, label, caption, url }) {
  let h = size;
  if (label || caption || url) h += TEXT_GAP;
  if (label) h += LABEL_H;
  if (caption) h += CAPTION_H;
  if (url) h += URL_H;
  return h;
}

/**
 * A reserved 1:1 image frame with its metadata underneath.
 *   imageSlot({ x, y, size, label, url, caption, tone })
 *
 * `x`, `y`  top-left of the SQUARE
 * `size`    the square's side (the picture area, 1:1)
 * `label`   what belongs here, e.g. "Naida L30-UP"
 * `caption` optional line under the label, e.g. "BTE"
 * `url`     public image URL, rendered as its own text node
 * `tone`    "neutral" | "hot" (yellow, for the anchor/flagged item)
 *
 * Dashed border so it reads as "to be filled", never as a finished element that
 * happens to be blank.
 */
/**
 * `uriScale` (0-1) shrinks the render inside its square, centred. Renders are
 * shot at different zooms, so left alone every device fills its frame and a CIC
 * ends up looking bigger than a RIC. On any board comparing SIZE, pass a scale
 * per form factor so the picture tells the truth the words are telling.
 */
export function imageSlot({ x, y, size, label, url, caption, uri, uriScale = 1, tone = "neutral" }) {
  const g = [];
  const hot = tone === "hot";
  const cx = x + size / 2;
  const stroke = hot ? YELLOW : BORDER;
  const glyph = hot ? YELLOW_DARK : SUBTLE;

  if (uri) {
    // The real render. Quiet rounded plate behind it so a device with a light
    // body still reads against the paper background, then the image itself
    // inset and letterboxed (preserveAspectRatio in image()) so it is never
    // cropped or stretched.
    const pad = Math.round(size * 0.06);
    const box = size - pad * 2;
    const drawn = box * Math.max(0.05, Math.min(1, uriScale));
    const off = (size - drawn) / 2; // centred, whatever the scale
    g.push(
      `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="16" fill="${hot ? YELLOW_LIGHT : WHITE}" stroke="${hot ? YELLOW : BORDER}" stroke-width="${hot ? 2 : 1.5}"/>`,
      // note the arg order: image(href, x, y, w, h) — href FIRST
      image(uri, x + off, y + off, drawn, drawn),
    );
  } else {
    g.push(
      `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="16" fill="${hot ? YELLOW_LIGHT : WHITE}"/>`,
      `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="16" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="8 7"/>`,
    );

    // picture glyph, centred in the square, scaled to it. Flat shapes only.
    const iw = Math.min(58, size * 0.42), ih = iw * 0.78;
    const ix = cx - iw / 2, iy = y + size / 2 - ih / 2;
    const r = Math.max(3, iw * 0.085);
    g.push(
      `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="${iw * 0.13}" fill="none" stroke="${glyph}" stroke-width="2.5"/>`,
      `<circle cx="${ix + iw * 0.3}" cy="${iy + ih * 0.33}" r="${r}" fill="${glyph}"/>`,
      `<path d="M ${ix + iw * 0.09} ${iy + ih * 0.82} L ${ix + iw * 0.37} ${iy + ih * 0.42} L ${ix + iw * 0.63} ${iy + ih * 0.82}" fill="none" stroke="${glyph}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M ${ix + iw * 0.54} ${iy + ih * 0.82} L ${ix + iw * 0.74} ${iy + ih * 0.55} L ${ix + iw * 0.93} ${iy + ih * 0.82}" fill="none" stroke="${glyph}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  // ── metadata, BELOW the square ────────────────────────────────────────────
  let ty = y + size + TEXT_GAP;
  if (label) {
    g.push(htext(cx, ty + 12, label, 15, DISP, 700, INK));
    ty += LABEL_H;
  }
  if (caption) {
    g.push(htext(cx, ty + 11, caption, 12.5, UI, 500, hot ? YELLOW_DARK : SUBTLE));
    ty += CAPTION_H;
  }
  // `url` is what gets PRINTED, and the caller decides what that is. A full
  // Storage URL is ~95 chars and cannot fit a card column at a readable size —
  // it overflowed into the neighbouring card when this tried to auto-shrink it.
  // So a board with narrow cards passes the object path and prints the base URL
  // once in a footnote; a board with room passes the whole thing. Auto-fit still
  // guards the remaining slack.
  if (url) {
    const fit = Math.max(7, Math.min(9.5, size / (url.length * 0.5)));
    g.push(htext(cx, ty + 9, url, fit, UI, 400, SUBTLE));
  }

  return g.join("\n");
}
