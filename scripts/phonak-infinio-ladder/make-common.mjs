// COMMON board -> the shared floor, at 22%.
//
// WHAT THIS BOARD SHOWS: everything that is IDENTICAL across all four levels.
// It runs BEFORE the ladder on purpose. Additive framing only works if the
// viewer already knows what the floor is -- otherwise "the I70 adds StereoZoom"
// sounds like the I30 is missing something essential.
//
// ⚠️ THE THREE FACTS THAT DO THE REAL WORK are the spec chips, not the feature
// list: Bluetooth is the SAME on all four, the fitting range is the SAME on all
// four, and the body is the same. Together they kill the two most common reasons
// people get talked upwards ("the expensive one connects better", "my loss needs
// the higher one"). Neither is true inside this family.
//
// ⚠️ AutoSense OS 7.0, NOT 6.0. The catalogue still says 6.0 and is wrong -- the
// Infinio Ultra firmware (October 2025) ships 7.0, trained on 18x more scenarios
// and 24% more precise. The board prints the corrected name and does NOT read it
// from feature_library, because feature_library is the thing that is stale.
// See docs/db-fixes-phonak-infinio.md item 1. Delete the override once that
// rename is applied in the Admin app.
//
// The shared features are computed as the INTERSECTION across all four levels,
// live. If a future catalogue edit moves a feature up a tier, this board drops it
// automatically rather than making a stale claim.
//
// NO IMAGES (rule 8). Data pulled live 2026-08-13.
// Run: npm run board:infinio-common
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-infinio-ladder", "common.svg");

const IDS = ["HA-271", "HA-270", "HA-269", "HA-268"]; // I30 I50 I70 I90, Pair rows

const models = await rest(
  `hearing_aid_models?id=in.(${IDS.join(",")})&select=id,fitting_min,fitting_max,rechargeable,warranty_years`,
);
if (models.length !== IDS.length) throw new Error("missing catalogue rows — refusing to guess");

const fmin = [...new Set(models.map((m) => m.fitting_min))];
const fmax = [...new Set(models.map((m) => m.fitting_max))];
const sameRange = fmin.length === 1 && fmax.length === 1;

const feats = await rest(
  `model_features?model_id=in.(${IDS.join(",")})&select=model_id,feature_library(feature_name)`,
);
const setOf = (id) =>
  new Set(feats.filter((f) => f.model_id === id).map((f) => f.feature_library?.feature_name).filter(Boolean));
const sets = IDS.map(setOf);
let shared = [...sets[0]].filter((n) => sets.every((s) => s.has(n)));

// The one override, and the only one. See the header note.
shared = shared.map((n) => (/^AutoSense OS/i.test(n) ? "AutoSense OS 7.0" : n)).sort();

const W = 1560;
const PAD = 56;
const inner = W - PAD * 2;
const g = [];

const KICK = "TRUE AT EVERY PRICE, I30 TO I90";
const kw = KICK.length * 11.5 * 0.62 + 34;
g.push(`<rect x="${PAD}" y="64" width="${kw}" height="32" rx="16" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 17, 80, KICK, 11.5, UI, 700, YELLOW_DARK));
g.push(text(PAD, 169, "What you get whatever you spend", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="188" width="72" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 232, "None of this is a reason to move up a level.", 18, UI, 400, BODY));

// ── the three spec chips that kill the two common upsells ────────────────────
const SPECS = [
  { k: "Bluetooth", v: "5.3", n: "identical on all four levels" },
  {
    k: "Fitting range",
    v: sameRange ? `${fmin[0]} to ${fmax[0]} dB` : "varies",
    n: sameRange ? "identical on all four levels" : "CHECK: catalogue disagrees across levels",
  },
  { k: "Build", v: "IP68 · rechargeable", n: "same body, same charger options" },
];

const S_T = 276;
const S_H = 128;
const GAP = 22;
const sw = (inner - GAP * 2) / 3;
SPECS.forEach((s, i) => {
  const x = PAD + i * (sw + GAP);
  const cx = x + sw / 2;
  g.push(`<rect x="${x}" y="${S_T}" width="${sw}" height="${S_H}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<rect x="${x}" y="${S_T}" width="${sw}" height="6" rx="3" fill="${YELLOW}"/>`);
  g.push(htext(cx, S_T + 44, s.k.toUpperCase(), 11.5, UI, 700, MUTED));
  g.push(htext(cx, S_T + 80, s.v, 26, DISP, 700, INK));
  g.push(htext(cx, S_T + 106, s.n, 13.5, UI, 400, SUBTLE));
});

// ── the shared feature band ──────────────────────────────────────────────────
const B_T = S_T + S_H + 34;
g.push(text(PAD, B_T, `THE ${shared.length} FEATURES EVERY LEVEL ALREADY HAS`, 11.5, UI, 700, SUBTLE));

const CHIP_H = 42;
const CHIP_GAP = 10;
const maxW = inner - 56;
const lines = [[]];
let lw = 0;
for (const nme of shared) {
  const w = Math.round(tw(nme, 16, 0.56)) + 38;
  if (lw + w > maxW && lines[lines.length - 1].length) {
    lines.push([]);
    lw = 0;
  }
  lines[lines.length - 1].push({ nme, w });
  lw += w + CHIP_GAP;
}
const bandH = 34 + lines.length * (CHIP_H + CHIP_GAP) + 12;
const BAND_T = B_T + 16;
g.push(`<rect x="${PAD}" y="${BAND_T}" width="${inner}" height="${bandH}" rx="20" fill="${YELLOW_LIGHT}"/>`);

let cy = BAND_T + 24;
for (const line of lines) {
  let cx = PAD + 28;
  for (const c of line) {
    g.push(`<rect x="${cx}" y="${cy}" width="${c.w}" height="${CHIP_H}" rx="${CHIP_H / 2}" fill="${WHITE}"/>`);
    g.push(mtext(cx + c.w / 2, cy + CHIP_H / 2, c.nme, 16, UI, 500, INK));
    cx += c.w + CHIP_GAP;
  }
  cy += CHIP_H + CHIP_GAP;
}

const F_T = BAND_T + bandH + 44;
g.push(text(PAD, F_T, "Shared features computed live as the intersection of all four levels.", 14, UI, 400, SUBTLE));
g.push(text(PAD, F_T + 26, "AutoSense OS 7.0 arrived with the Infinio Ultra firmware, October 2025. The catalogue still says 6.0.", 14, UI, 400, SUBTLE));

const H = F_T + 26 + PAD;
g.unshift(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
