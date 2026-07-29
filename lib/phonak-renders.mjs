// Real Phonak device renders, embedded into boards.
//
// Source: the Admin app's `data/phonak_images` library — 481 deduplicated
// 600x600 PNGs extracted from Phonak Target 11.2.3, plus `phonak_renders.csv`
// saying which models use which render. Read live via phonakImages(); never
// copied and never written to.
//
// COLOUR POLICY: black first, then beige (Chintan, 2026-07-29). Neither is
// universal, so the choice is made against what the catalogue actually offers
// per model rather than assumed — Naida L30-UP, for instance, has NO black
// render at all (only Beige, Champagne, Graphite Gray, Sandalwood). Asking for
// black there and silently getting nothing would leave a hole on the board, so
// resolution walks a preference list and reports which colour it landed on.
//
// TWO NAME GOTCHAS, both of which silently returned zero matches at first:
//   1. `used_by_models` spells it **"Naída"** with an accent. Match is
//      accent-folded, so "Naida L30-UP" from Supabase finds it.
//   2. Supabase and the library disagree on separators. Supabase writes
//      "Audeo I 30-R" and "Terra BTE UP"; the library writes "Audéo I30-R" and
//      "Terra BTE-UP". Spaces AND hyphens are therefore stripped for a loose
//      second-pass match — stripping only spaces missed every Terra BTE.
//
// A THIRD THING THAT LOOKS LIKE A BUG AND IS NOT: Phonak reuses housings across
// lines and generations, and the library labels a shared render by its FLAGSHIP
// line (see its README). So Terra+ RIC-R resolves to an `Audeo-Lumity-R` file,
// and Naida L30-UP to a `Naida-Lumity-Link-L` one. Trust `used_by_models`, never
// the filename prefix — reading the prefix instead is how you conclude a model
// has no black render when it plainly does.
//
// PNG only: Figma's `createImage` will not take webp, and `npm run verify`
// errors on a non-PNG embed. These are already PNG, so no conversion is needed
// — only a trim and a resize.
import fs from "node:fs";
import path from "node:path";
import { phonakImages, phonakFile } from "./paths.mjs";
import { pngDataUri } from "./brand.mjs";

/** Fold accents and case so "Naída L30-UP" and "naida l30-up" compare equal. */
const fold = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// Black first, then beige. Custom (in-ear) shells name colours differently, so
// their variants are in the list too.
export const DEFAULT_COLOUR_PREFERENCE = [
  "velvet black",
  "shell black / fp black",
  "black",
  "beige",
  "sand beige",
  "shell cocoa / fp black",
  "shell tan / fp tan",
  "sandalwood",
];

/**
 * Display scale per form factor, as a fraction of a BTE.
 *
 * Phonak shoots every render at its own zoom, so at 1:1 each device fills its
 * frame and a CIC ends up looking BIGGER than a RIC. Any board that compares
 * bodies must scale by these or the picture contradicts the words. Approximate
 * real lengths: BTE ~50mm · RIC ~42mm · ITC ~22mm · CIC ~17mm.
 *
 * One table, used by every board — do not re-declare these locally.
 */
export const FORM_FACTOR_SCALE = {
  BTE: 1.0,
  "BTE-SlimTube": 0.95,
  CI: 1.0,
  RIC: 0.84,
  Custom: 0.46, // ITC-sized; a CIC row should override to ~0.36
};

/** Scale for a resolved render, with a CIC nudge since both share "Custom". */
export function scaleFor(render, { cic = false } = {}) {
  if (cic) return 0.36;
  return FORM_FACTOR_SCALE[render?.formFactor] ?? 0.8;
}

let cachedRows = null;

/** Parse phonak_renders.csv once. Minimal CSV reader — the file is well-formed. */
function rows() {
  if (cachedRows) return cachedRows;
  const raw = fs.readFileSync(phonakFile("phonak_renders.csv"), "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const head = splitCsv(lines[0]);
  cachedRows = lines.slice(1).map((ln) => {
    const cells = splitCsv(ln);
    return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ""]));
  });
  return cachedRows;
}

function splitCsv(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

/**
 * The best render for a model, honouring the colour preference.
 *   renderFor("Naida L30-UP") -> { file, colour, formFactor, side, absolute }
 * Returns null when the model has no render at all.
 */
export function renderFor(modelName, prefer = DEFAULT_COLOUR_PREFERENCE) {
  const want = fold(modelName);
  const squash = (s) => fold(s).replace(/[\s-]+/g, "");
  const wantSquashed = squash(modelName);
  const mine = rows().filter((r) =>
    r.used_by_models
      .split(";")
      .some((m) => fold(m) === want || squash(m) === wantSquashed),
  );
  if (!mine.length) {
    // "<model> Go" is the same aid supplied with the pocket ChargerGo, so Phonak
    // ships no separate render for it. Fall back to the base model rather than
    // leaving a hole (Audeo I30-R Go -> Audeo I30-R).
    const base = modelName.replace(/\s+Go$/i, "");
    if (base !== modelName) return renderFor(base, prefer);
    return null;
  }

  // `generic` renders are the clean catalogue shot; sides are left/right pairs.
  const bySide = (a, b) =>
    (a.side === "generic" ? 0 : 1) - (b.side === "generic" ? 0 : 1);

  for (const colour of prefer) {
    const hit = mine.filter((r) => fold(r.colour_name) === colour).sort(bySide);
    if (hit.length) return shape(hit[0]);
  }
  // Nothing in the preference list — take the first generic render rather than
  // returning null, so a board never silently loses its picture.
  const fallback = [...mine].sort(bySide)[0];
  return shape(fallback);
}

const shape = (r) => ({
  file: r.render_file,
  colour: r.colour_name,
  formFactor: r.form_factor,
  side: r.side,
  absolute: path.join(phonakImages(), r.render_file),
});

/**
 * A model's render as an embeddable PNG data URI, trimmed and sized to `size`.
 *   await renderDataUri("Naida L30-UP", { size: 460 })
 * Returns null when there is no render, so callers can fall back to a slot.
 */
export async function renderDataUri(modelName, { size = 460, prefer } = {}) {
  const r = renderFor(modelName, prefer);
  if (!r) return null;
  const uri = await pngDataUri(fs.readFileSync(r.absolute), (p) =>
    // trim the flat surround, then fit INSIDE a square so nothing is cropped
    p.trim({ threshold: 12 }).resize(size, size, {
      fit: "inside",
      withoutEnlargement: true,
    }),
  );
  return { ...r, uri };
}
