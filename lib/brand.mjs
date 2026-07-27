// Real Synva design-system assets, read LIVE from the website repo.
//
// The logo and the soundwave signature are never copied into this repo — they are
// read from `public/brand/` at generation time and inlined as flat paths, so a
// board always carries the current mark. See WEBSITE.md.
import fs from "node:fs";
import { brandAsset } from "./paths.mjs";
import { YELLOW_DARK } from "./tokens.mjs";

/** Strip the outer <svg> wrapper so the contents can be inlined into a board. */
export const innerOf = (file) =>
  fs
    .readFileSync(file, "utf8")
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim();

// Intrinsic viewBox sizes of the two brand assets, used to scale them.
const LOGO_VB = { w: 3761.6, h: 1366 };
const WAVE_VB = { w: 3626.56, h: 178.72 };

/** Aspect ratio of the soundwave, for laying out space before you draw it. */
export const WAVE_RATIO = WAVE_VB.h / WAVE_VB.w;

/**
 * The official horizontal wordmark (dark-yellow variant — flat paths, no <text>),
 * right-aligned at rightX and scaled to targetH.
 */
export function logo(rightX, topY, targetH) {
  const inner = innerOf(brandAsset("synva-logo-horizontal-darkyellow.svg"));
  const s = targetH / LOGO_VB.h;
  return `<g transform="translate(${(rightX - LOGO_VB.w * s).toFixed(2)} ${topY}) scale(${s.toFixed(5)})">${inner}</g>`;
}

/**
 * The brand soundwave signature, recoloured to a token tone.
 * Opt-in: a board uses it as a closing footer, it is not a default.
 */
export function soundwave(x, y, targetW, color = YELLOW_DARK) {
  const inner = innerOf(brandAsset("soundwave-signature.svg")).replace(
    /stroke="#000"/gi,
    `stroke="${color}"`,
  );
  const s = targetW / WAVE_VB.w;
  return `<g transform="translate(${x} ${y}) scale(${s.toFixed(5)})" fill="${color}">${inner}</g>`;
}

/**
 * Encode an image as a PNG data URI for embedding.
 *
 * PNG is not optional: Figma's `createImage` will not take webp, and the plugin
 * decodes the data URI to bytes. `transform` gets the sharp pipeline so a caller
 * can trim, resize or flatten before encoding.
 *
 *   await pngDataUri(buffer, (p) => p.trim({ threshold: 12 }).resize(460, 460, { fit: "inside" }))
 */
export async function pngDataUri(source, transform) {
  const { default: sharp } = await import("sharp");
  let pipeline = sharp(source);
  if (transform) pipeline = transform(pipeline);
  const png = await pipeline.png().toBuffer();
  return "data:image/png;base64," + png.toString("base64");
}
