// Verify a board before handing it over.  npm run verify [path|filter ...]
//
// Two jobs:
//   1. LINT the things that silently break the Figma import. These are errors and
//      they exit non-zero, so a broken board can never be handed over quietly.
//   2. RENDER a PNG into .tmp/ so the board can actually be looked at — nothing
//      here catches "the text overflows its pill". A human still eyeballs it.
//
// The colour check is a WARNING, not an error, on purpose: a real product finish
// colour is legitimately off-palette (skill rule 4's sanctioned exception), so the
// unknown hexes are listed for a glance rather than blocking.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/paths.mjs";
import { TOKEN_HEXES, FONTS } from "../lib/tokens.mjs";

const BOARDS = path.join(ROOT, "boards");
const TMP = path.join(ROOT, ".tmp");

function allBoards(dir = BOARDS) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return allBoards(p);
    return e.name.endsWith(".svg") ? [p] : [];
  });
}

const args = process.argv.slice(2);
const targets = args.length
  ? args.flatMap((a) => {
      if (fs.existsSync(a) && a.endsWith(".svg")) return [path.resolve(a)];
      const hits = allBoards().filter((p) => p.includes(a));
      if (!hits.length) console.warn(`no board matches "${a}"`);
      return hits;
    })
  : allBoards();

if (!targets.length) {
  console.error("No boards to verify. Generate one first (npm run boards:all).");
  process.exit(1);
}

// ── the lint ──────────────────────────────────────────────────────────────────
function lint(svg) {
  const errors = [];
  const warnings = [];

  // A fallback stack makes Figma's importer mis-size and wrap the text.
  const fonts = [...svg.matchAll(/font-family="([^"]*)"/g)].map((m) => m[1]);
  for (const f of new Set(fonts)) {
    if (f.includes(",")) errors.push(`font-family is a fallback stack: "${f}" (use a single family)`);
    else if (!FONTS.has(f)) errors.push(`font-family "${f}" is not a board font (${[...FONTS].join(" / ")})`);
  }

  // These break figma.createNodeFromSvg outright.
  for (const tag of ["linearGradient", "radialGradient", "filter", "pattern", "mask"]) {
    if (new RegExp(`<${tag}\\b`).test(svg)) {
      errors.push(`<${tag}> present — breaks the Figma import (use flat fills; fill-opacity is fine)`);
    }
  }

  // figma.createImage takes PNG/JPEG bytes only; webp imports as nothing.
  for (const m of svg.matchAll(/href="data:image\/([a-z+]+)/g)) {
    if (!["png", "jpeg", "jpg"].includes(m[1])) {
      errors.push(`embedded image is ${m[1]} — convert to PNG at generation time`);
    }
  }
  if (/<image\b/.test(svg) && !/xmlns:xlink=/.test(svg)) {
    errors.push(`board has an <image> but no xmlns:xlink declaration (pass xlink: true to writeBoard)`);
  }

  // Off-palette colours: report, don't block.
  const hexes = new Set(
    [...svg.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1].toUpperCase()),
  );
  const expand = (h) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h);
  const unknown = [...hexes].map(expand).filter((h) => !TOKEN_HEXES.has(h));
  if (unknown.length) {
    warnings.push(
      `${unknown.length} non-token colour${unknown.length === 1 ? "" : "s"}: ${unknown.sort().join(" ")}` +
        `\n      OK only if these are real product data (a device finish). Otherwise fix to a brand token.`,
    );
  }

  return { errors, warnings };
}

// ── run ───────────────────────────────────────────────────────────────────────
fs.mkdirSync(TMP, { recursive: true });
const { default: sharp } = await import("sharp");

let errorCount = 0;
let warnCount = 0;

for (const file of targets) {
  const rel = path.relative(ROOT, file);
  const svg = fs.readFileSync(file, "utf8");
  const { errors, warnings } = lint(svg);
  const dims = svg.match(/<svg[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/);

  let png = "";
  try {
    const out = path.join(TMP, path.basename(file).replace(/\.svg$/, ".png"));
    await sharp(Buffer.from(svg), { density: 110 }).png().toFile(out);
    png = path.relative(ROOT, out);
  } catch (e) {
    errors.push(`could not render to PNG: ${e.message}`);
  }

  const status = errors.length ? "FAIL" : warnings.length ? "warn" : "ok  ";
  console.log(`${status}  ${rel}${dims ? `  ${dims[1]}x${dims[2]}` : ""}${png ? `  -> ${png}` : ""}`);
  for (const e of errors) console.log(`      ERROR  ${e}`);
  for (const w of warnings) console.log(`      warn   ${w}`);

  errorCount += errors.length;
  warnCount += warnings.length;
}

console.log(
  `\n${targets.length} board${targets.length === 1 ? "" : "s"} checked · ` +
    `${errorCount} error${errorCount === 1 ? "" : "s"} · ${warnCount} warning${warnCount === 1 ? "" : "s"}`,
);
if (!errorCount) console.log(`PNGs in .tmp/ — open them before handing a board over.`);
process.exit(errorCount ? 1 : 0);
