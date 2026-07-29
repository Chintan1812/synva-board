// COMMON board -> "it is not the hearing loss that decides the price", at 12%.
//
// WHAT THIS BOARD DOES: kills the assumption the viewer walked in with — that a
// worse audiogram means a bigger bill — and hands straight off to the 3-step
// framework board at 18%. It is the common-traits-before-deltas beat, but framed
// as a REFRAME rather than a table of shared specs (Chintan, 2026-07-29).
//
// THE ARGUMENT, in the site's own language: your hearing loss decides whether you
// need a RIC, a BTE or an in-ear device — it narrows the SHAPE before anything
// else does. What it does not decide is the PRICE, because both budgets already
// cover the whole range. Your lifestyle is what decides the price.
//
// ⚠️ THE EVIDENCE HAS TO BE ON THE BOARD or the reframe is just an assertion. The
// two dB bars are the proof: both bands span 0 to 120 dB, and both carry the same
// warranty. Pulled live, with a guard, so the claim cannot rot.
//
// ⚠️ THE OBVIOUS VERSION OF THAT PROOF IS FALSE. The build plan said "the same
// fitting range across every model". It is not the same per model — Naida L30-UP
// fits 60-120, L30-PR 20-90, both Virtos are NULL. The true statement is at BAND
// level: each budget SPANS 0 to 120 using two different models. Say it that way.
//
// THE HANDOFF IS THE POINT OF THE BOTTOM STRIP. It previews the three steps in
// the website's own colours (01 hearing yellow, 02 lifestyle blue, 03 budget
// green — the site's intentional three-lens coding, the valid reason to use
// non-yellow families here) and marks where the viewer is: step 1 answered, step
// 2 is what decides, step 3 comes last. Chintan then walks onto the framework
// board and it is already familiar. Do not reorder or recolour these.
//
// NO IMAGES: a range argument, not a shape argument (rule 8).
// rule 1b — English only. Run: npm run board:phonak-common
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK,
  BLUE, BLUE_LIGHT, BLUE_DARK,
  GREEN, GREEN_LIGHT, GREEN_DARK,
  DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "common.svg");

const BANDS = [
  {
    label: "₹50,000",
    ids: ["HA-262", "HA-263", "HA-264", "HA-265", "HA-258", "HA-259", "HA-260", "HA-261", "HA-257", "HA-140", "HA-141"],
  },
  {
    label: "₹1,00,000",
    ids: ["HA-231", "HA-275", "HA-284", "HA-301", "HA-314", "HA-271", "HA-315"],
  },
];

const rows = await rest(
  `hearing_aid_models?id=in.(${BANDS.flatMap((b) => b.ids).join(",")})` +
    "&select=id,model_name,fitting_min,fitting_max,warranty_years",
);
const byId = new Map(rows.map((r) => [r.id, r]));

for (const b of BANDS) {
  const fitted = b.ids.map((id) => byId.get(id)).filter((m) => m && m.fitting_min != null);
  b.min = Math.min(...fitted.map((m) => m.fitting_min));
  b.max = Math.max(...fitted.map((m) => m.fitting_max));
}

// GUARDS — the board says both budgets cover the same ears and carry the same
// warranty. If the catalogue stops supporting either, fail loudly.
const [A, B] = BANDS;
if (A.min !== B.min || A.max !== B.max) {
  throw new Error(
    `common: the board claims both budgets cover the same range, but the catalogue says\n` +
      `  ${A.label}: ${A.min}-${A.max} dB\n  ${B.label}: ${B.min}-${B.max} dB`,
  );
}
const warranties = [...new Set(rows.map((r) => r.warranty_years))];
if (warranties.length !== 1) {
  throw new Error(`common: the board claims one shared warranty, found ${warranties.join(", ")} years.`);
}
const WARR = warranties[0];
const SPAN = `${A.min} to ${A.max} dB`;

const icon = await loadIcons(["ear", "activity"]);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 28;
const COLW = 660;
const W = PAD * 2 + COLW * 2 + GAP;

const T = 250;
const CARDH = 396;
const STEP_T = T + CARDH + 40;
const STEP_H = 150;
const H = STEP_T + STEP_H + 74 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "BEFORE WE COMPARE ANYTHING";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "Your hearing loss does not decide the price", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, `Both budgets already fit the same ears, ${SPAN}. Something else decides what you spend.`, 18, UI, 400, MUTED));

// ── left: what does NOT decide it, with the proof ──────────────────────────
{
  const x = PAD;
  g.push(`<rect x="${x}" y="${T}" width="${COLW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);

  g.push(`<circle cx="${x + 46}" cy="${T + 46}" r="19" fill="none" stroke="${SUBTLE}" stroke-width="2.2"/>`);
  g.push(`<path d="M ${x + 39} ${T + 39} L ${x + 53} ${T + 53} M ${x + 53} ${T + 39} L ${x + 39} ${T + 53}" stroke="${SUBTLE}" stroke-width="2.6" stroke-linecap="round"/>`);
  g.push(ltext(x + 80, T + 38, "DOES NOT DECIDE THE PRICE", 11.5, UI, 700, SUBTLE));
  g.push(ltext(x + 80, T + 62, "Your hearing loss", 30, DISP, 700, INK));

  // the proof: both bands span the same range
  const trackX = x + 176, trackW = COLW - 176 - 44;
  const px = (db) => trackX + (db / A.max) * trackW;
  BANDS.forEach((b, i) => {
    const y = T + 128 + i * 62;
    g.push(ltext(x + 34, y + 13, b.label, 19, DISP, 700, INK));
    g.push(`<rect x="${trackX}" y="${y}" width="${trackW}" height="26" rx="13" fill="${YELLOW_LIGHT}"/>`);
    g.push(mtext(trackX + trackW / 2, y + 13, `${b.min} to ${b.max} dB`, 14, UI, 700, YELLOW_DARK));
  });
  g.push(htext(x + 34 + (trackX - x - 34) / 2, T + 118, "", 11, UI, 700, SUBTLE));
  g.push(ltext(trackX, T + 118, "MILD", 10.5, UI, 700, SUBTLE));
  g.push(text(trackX + trackW, T + 118, "PROFOUND", 10.5, UI, 700, SUBTLE, "end"));

  g.push(ltext(x + 34, T + 274, `Same ${WARR} year warranty on every one of them.`, 14.5, UI, 500, BODY));

  // what it DOES decide — keeps the beat additive, and sets up cheezein
  const note = wrap(
    "It decides the shape you need, behind the ear or inside it. Not the price.",
    COLW - 76, 14, 0.55,
  );
  const nh = note.length * 20 + 34;
  g.push(`<rect x="${x + 22}" y="${T + CARDH - nh - 20}" width="${COLW - 44}" height="${nh}" rx="14" fill="${PAPER}"/>`);
  note.forEach((ln, li) => g.push(ltext(x + 40, T + CARDH - nh - 20 + 26 + li * 20, ln, 14, UI, 600, SUBTLE)));
}

// ── right: what DOES decide it ─────────────────────────────────────────────
{
  const x = PAD + COLW + GAP;
  g.push(`<rect x="${x}" y="${T}" width="${COLW}" height="${CARDH}" rx="22" fill="${BLUE_LIGHT}" stroke="${BLUE}" stroke-width="2.5"/>`);

  g.push(`<circle cx="${x + 46}" cy="${T + 46}" r="19" fill="${BLUE}"/>`);
  g.push(`<path d="M ${x + 38} ${T + 46} l 6 6.5 l 12 -13" fill="none" stroke="${BLUE_DARK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`);
  g.push(ltext(x + 80, T + 38, "THIS IS WHAT DECIDES IT", 11.5, UI, 700, BLUE_DARK));
  g.push(ltext(x + 80, T + 62, "Your lifestyle", 30, DISP, 700, INK));

  const REASONS = [
    "Where your day actually happens.",
    "How often the room around you changes.",
    "Whether you are on calls, or across a quiet table.",
  ];
  REASONS.forEach((r, i) => {
    const y = T + 132 + i * 42;
    g.push(`<circle cx="${x + 42}" cy="${y - 5}" r="4.5" fill="${BLUE_DARK}"/>`);
    g.push(ltext(x + 62, y - 5, r, 16.5, UI, 500, INK));
  });

  const note = wrap(
    "A quiet life needs far less of the device than a day of meetings does. That is the whole reason these two prices exist.",
    COLW - 76, 14, 0.55,
  );
  const nh = note.length * 20 + 34;
  g.push(`<rect x="${x + 22}" y="${T + CARDH - nh - 20}" width="${COLW - 44}" height="${nh}" rx="14" fill="${WHITE}"/>`);
  note.forEach((ln, li) => g.push(ltext(x + 40, T + CARDH - nh - 20 + 26 + li * 20, ln, 14, UI, 600, BLUE_DARK)));
}

// ── the handoff: the three steps, in the site's own colours ────────────────
// This strip is the bridge to the framework board at 18%. Chintan points at
// step 2 here, then walks onto that board and it is already familiar.
const STEPS = [
  { n: "01", label: "Your hearing loss", state: "Answered. It sets the shape.", tint: YELLOW_LIGHT, primary: YELLOW, dark: YELLOW_DARK, done: true },
  { n: "02", label: "Your lifestyle", state: "This is the one that decides.", tint: BLUE_LIGHT, primary: BLUE, dark: BLUE_DARK, here: true },
  { n: "03", label: "Your budget", state: "The last filter. Never the first.", tint: GREEN_LIGHT, primary: GREEN, dark: GREEN_DARK },
];
const SW = (W - PAD * 2 - GAP * 2) / 3;
STEPS.forEach((s, i) => {
  const x = PAD + i * (SW + GAP);
  g.push(
    `<rect x="${x}" y="${STEP_T}" width="${SW}" height="${STEP_H}" rx="20" fill="${s.tint}" stroke="${s.here ? s.primary : "none"}" stroke-width="${s.here ? 2.5 : 0}"/>`,
  );
  g.push(ltext(x + 30, STEP_T + 42, s.n, 26, DISP, 700, s.primary));
  g.push(ltext(x + 76, STEP_T + 42, s.label, 22, DISP, 700, INK));
  g.push(ltext(x + 30, STEP_T + 84, s.state, 15, UI, 500, s.dark));

  if (s.done) {
    g.push(`<circle cx="${x + SW - 42}" cy="${STEP_T + 36}" r="15" fill="${s.primary}"/>`);
    g.push(`<path d="M ${x + SW - 49} ${STEP_T + 36} l 4.5 5 l 9.5 -10" fill="none" stroke="${s.dark}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  if (s.here) {
    g.push(`<rect x="${x + 30}" y="${STEP_T + 104}" width="${SW - 60}" height="6" rx="3" fill="${s.primary}"/>`);
  }
});

g.push(text(PAD, STEP_T + STEP_H + 46, "So the rest of this video is really about step two.", 20, DISP, 700, INK));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
