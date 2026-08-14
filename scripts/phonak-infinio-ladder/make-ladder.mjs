// LADDER board -> the hub, at 34%. The spine of the whole video.
//
// WHAT THIS BOARD SHOWS: I30 -> I50 -> I70 -> I90 as three STEPS, each with what
// it costs and what it ADDS. Never what the lower one lacks.
//
// ⚠️ ADDITIVE ONLY, AND THIS IS NOT A STYLE PREFERENCE. Someone watching already
// owns the cheap one. `addsFrom()` only ever computes hi-minus-lo; rendering the
// reverse would claim a downgrade and lose exactly the viewer this video is for.
// Same rule the ₹50k video's delta board learned the hard way.
//
// ⚠️ ONE FACT ON THIS BOARD DOES NOT COME FROM THE DB, ON PURPOSE.
// The I70 -> I90 step also gains an AutoSense automatic program, "Speech in loud
// noise". Phonak's own feature summary (doc 028-2681-03) tiers AutoSense by
// program count -- 4 / 6 / 7 / 8 across I30 / I50 / I70 / I90 -- but the
// catalogue stores AutoSense as ONE ungraded row, identical at every level. So
// the DB *understates* this step, which is the step the whole video turns on.
// It is merged in from the vendor document and labelled as such on the board.
// See docs/db-fixes-phonak-infinio.md item 4. Do not "fix" this by trusting the
// join -- the join is the thing that is wrong.
//
// ⚠️ CHANNELS AND WARRANTY ARE COLUMNS, NOT FEATURE ROWS, so the feature join
// misses them entirely. Read from hearing_aid_models and merged per step.
//
// THE VEILS: one per step. Chintan reveals a rung at a time so a dense board
// does not dump three answers at once. Keep the rungs independently coverable.
//
// SPHERE IS NOT ON THIS LADDER. It is a branch, not a rung, and it gets its own
// board at 46%. Putting it here would turn one clean climb into a fork.
//
// NO IMAGES (rule 8): a capability ladder, not a shape argument.
// Data pulled live 2026-08-13. Run: npm run board:infinio-ladder
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-infinio-ladder", "ladder.svg");

const RUNGS = [
  { id: "HA-271", level: "I30", tier: "Essential" },
  { id: "HA-270", level: "I50", tier: "Standard" },
  { id: "HA-269", level: "I70", tier: "Advanced" },
  { id: "HA-268", level: "I90", tier: "Premium" },
];
const IDS = RUNGS.map((r) => r.id);

const models = await rest(
  `hearing_aid_models?id=in.(${IDS.join(",")})&select=id,mrp,unit,channels,warranty_years`,
);
const byId = new Map(models.map((m) => [m.id, m]));
for (const r of RUNGS) {
  const m = byId.get(r.id);
  if (!m) throw new Error(`${r.id} missing from the catalogue — refusing to guess`);
  if (m.unit !== "Pair") throw new Error(`${r.id} is a ${m.unit} row, expected Pair`);
  Object.assign(r, { mrp: m.mrp, channels: m.channels, warranty: m.warranty_years });
}

const feats = await rest(
  `model_features?model_id=in.(${IDS.join(",")})&select=model_id,feature_library(feature_name)`,
);
const setOf = (id) =>
  new Set(
    feats.filter((f) => f.model_id === id).map((f) => f.feature_library?.feature_name).filter(Boolean),
  );
const F = Object.fromEntries(IDS.map((id) => [id, setOf(id)]));
/** ADDITIONS ONLY. Never the reverse direction. */
const addsFrom = (lo, hi) => [...F[hi]].filter((x) => !F[lo].has(x)).sort();

// Vendor-only additions, keyed by the step they belong to. Sourced from Phonak's
// feature summary, NOT from the catalogue — see the header note.
const VENDOR_ADDS = {
  "I70→I90": ['AutoSense program: "Speech in loud noise"'],
};

const steps = [];
for (let i = 1; i < RUNGS.length; i++) {
  const lo = RUNGS[i - 1];
  const hi = RUNGS[i];
  const key = `${lo.level}→${hi.level}`;
  const specs = [];
  if (hi.channels !== lo.channels) specs.push(`${lo.channels} → ${hi.channels} channels`);
  if (hi.warranty !== lo.warranty) specs.push(`${lo.warranty} → ${hi.warranty} year warranty`);
  steps.push({
    key,
    from: lo,
    to: hi,
    cost: hi.mrp - lo.mrp,
    specs,
    adds: [...addsFrom(lo.id, hi.id), ...(VENDOR_ADDS[key] || [])],
  });
}

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const W = 1560;
const PAD = 56;
const inner = W - PAD * 2;
const g = [];

// ── header ───────────────────────────────────────────────────────────────────
const KICK = "WHAT EACH STEP ACTUALLY ADDS";
const kw = KICK.length * 11.5 * 0.62 + 34;
g.push(`<rect x="${PAD}" y="64" width="${kw}" height="32" rx="16" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 17, 80, KICK, 11.5, UI, 700, YELLOW_DARK));
g.push(text(PAD, 169, "The ladder, one step at a time", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="188" width="72" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 232, "Every level includes everything below it. These are only the additions.", 18, UI, 400, BODY));

// ── the base rung ────────────────────────────────────────────────────────────
let y = 276;
const BASE_H = 84;
g.push(`<rect x="${PAD}" y="${y}" width="${inner}" height="${BASE_H}" rx="18" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(`<rect x="${PAD}" y="${y}" width="8" height="${BASE_H}" rx="4" fill="${BORDER}"/>`);
g.push(ltext(PAD + 34, y + 34, `${RUNGS[0].level}  ·  ${RUNGS[0].tier}`, 24, DISP, 700, INK));
g.push(ltext(PAD + 34, y + 62, `${RUNGS[0].channels} channels · ${RUNGS[0].warranty} year warranty · the starting point`, 15, UI, 400, MUTED));
g.push(ltext(W - PAD - 240, y + BASE_H / 2, inr(RUNGS[0].mrp), 26, DISP, 700, INK));
y += BASE_H + 22;

// ── the three steps ──────────────────────────────────────────────────────────
const CHIP_H = 38;
const CHIP_GAP = 10;

steps.forEach((s, i) => {
  const last = i === steps.length - 1;

  // chip layout first, so the rung box can be sized to fit
  const items = [...s.specs.map((t) => ({ t, spec: true })), ...s.adds.map((t) => ({ t, spec: false }))];
  const maxW = inner - 68;
  const lines = [[]];
  let lw = 0;
  for (const it of items) {
    const w = Math.round(tw(it.t, 15, 0.56)) + 34;
    if (lw + w > maxW && lines[lines.length - 1].length) {
      lines.push([]);
      lw = 0;
    }
    lines[lines.length - 1].push({ ...it, w });
    lw += w + CHIP_GAP;
  }
  const chipsH = lines.length * (CHIP_H + CHIP_GAP);
  const H = 76 + chipsH + 18;

  g.push(
    `<rect x="${PAD}" y="${y}" width="${inner}" height="${H}" rx="18" fill="${last ? YELLOW_LIGHT : WHITE}" stroke="${last ? YELLOW : BORDER}" stroke-width="${last ? 2 : 1.5}"/>`,
  );
  g.push(`<rect x="${PAD}" y="${y}" width="8" height="${H}" rx="4" fill="${YELLOW}"/>`);

  g.push(ltext(PAD + 34, y + 36, `${s.from.level}  →  ${s.to.level}   ·   ${s.to.tier}`, 24, DISP, 700, INK));
  g.push(ltext(W - PAD - 300, y + 36, `+ ${inr(s.cost)}`, 26, DISP, 700, last ? YELLOW_DARK : INK));
  g.push(ltext(W - PAD - 300, y + 62, `total ${inr(s.to.mrp)} per pair`, 13.5, UI, 400, SUBTLE));

  let cy = y + 76;
  for (const line of lines) {
    let cx = PAD + 34;
    for (const it of line) {
      g.push(
        `<rect x="${cx}" y="${cy}" width="${it.w}" height="${CHIP_H}" rx="${CHIP_H / 2}" fill="${it.spec ? PAPER : WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`,
      );
      g.push(mtext(cx + it.w / 2, cy + CHIP_H / 2, it.t, 15, UI, it.spec ? 700 : 500, it.spec ? YELLOW_DARK : BODY));
      cx += it.w + CHIP_GAP;
    }
    cy += CHIP_H + CHIP_GAP;
  }

  y += H + 22;
});

// ── footnote ─────────────────────────────────────────────────────────────────
y += 12;
g.push(text(PAD, y, "Feature additions from the live catalogue, verified against Phonak's Infinio feature summary, doc 028-2681-03.", 14, UI, 400, SUBTLE));
g.push(text(PAD, y + 26, 'The AutoSense program on the I70 → I90 step comes from that document. The catalogue does not record it.', 14, UI, 400, SUBTLE));

const HT = y + 26 + PAD;
g.unshift(`<rect x="0" y="0" width="${W}" height="${HT}" fill="${PAPER}"/>`);

writeBoard(OUT, { w: W, h: HT, body: g.join("\n") });
