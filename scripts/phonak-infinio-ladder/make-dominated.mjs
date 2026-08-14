// DOMINATED board -> the inversion, at 70%. The most useful 40 seconds of the video.
//
// WHAT THIS BOARD SHOWS: the I90-R costs ₹80,000 MORE than the I70-Sphere and is
// the worse buy for the job people are sold the I90 to do. Head to head, with the
// price arrow pointing the "wrong" way.
//
// THE ARGUMENT, in order:
//   1. What the I90-R adds over the I70-R is loud-noise handling
//      (Speech Enhancer + the "Speech in loud noise" AutoSense program).
//   2. Loud noise is exactly what the DEEPSONIC chip in the Sphere does, and it
//      does it with dedicated silicon rather than a processing tweak.
//   3. The Sphere also carries a longer warranty.
//   4. And it costs less.
// Four independent facts pointing one way. That is why this beat can be slow.
//
// ⚠️ THIS IS A PRICE COMPARISON BETWEEN TWO REAL SKUs, not a value judgement
// dressed up as one. Every number is a catalogue Pair row and every feature claim
// is in Phonak's feature summary. Keep it that way -- the moment this board editorialises
// it becomes attackable, and it is the board most likely to be screenshotted.
//
// ⚠️ BLOCKED PENDING CHINTAN. If there is a genuine clinical reason to fit an
// I90-R over an I70-Sphere, it belongs on this board as a fourth row and the
// title softens. Asked in 01-research.md, flag 1. Do not ship without the answer.
//
// NO IMAGES (rule 8): both are RICs and look identical. A photo pair here would
// imply the difference is cosmetic, which is the opposite of the point.
//
// Data pulled live 2026-08-13. Run: npm run board:infinio-dominated
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import { marker } from "../../lib/callout.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-infinio-ladder", "dominated.svg");

const DEAR = "HA-268"; // Audeo I 90-R,      Pair
const BETTER = "HA-267"; // Audeo I 70-Sphere, Pair

const rows = await rest(
  `hearing_aid_models?id=in.(${DEAR},${BETTER})&select=id,model_name,mrp,unit,channels,warranty_years`,
);
const byId = new Map(rows.map((r) => [r.id, r]));
const dear = byId.get(DEAR);
const better = byId.get(BETTER);
if (!dear || !better) throw new Error("missing catalogue rows — refusing to guess");
for (const m of [dear, better]) {
  if (m.unit !== "Pair") throw new Error(`${m.id} is a ${m.unit} row, expected Pair`);
}
const gapAmount = dear.mrp - better.mrp;
if (gapAmount <= 0) {
  throw new Error(
    `The inversion no longer holds: I90-R ${dear.mrp} vs I70-Sphere ${better.mrp}. ` +
      `This board's entire argument is dead — re-check pricing before shipping it.`,
  );
}

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const CARDS = [
  {
    m: dear,
    label: "I90-R",
    tier: "Premium, no Sphere",
    tone: "no",
    accent: false,
    rows: [
      { t: "No AI chip at all", tone: "no" },
      { t: "Handles loud noise with Speech Enhancer", tone: "neutral" },
      { t: `${dear.channels} channels · ${dear.warranty_years} year warranty`, tone: "neutral" },
    ],
  },
  {
    m: better,
    label: "I70-Sphere",
    tier: "Advanced, with Sphere",
    tone: "yes",
    accent: true,
    rows: [
      { t: "DEEPSONIC AI chip, dedicated to speech in noise", tone: "yes" },
      { t: "Spheric Speech Clarity, medium strength", tone: "yes" },
      { t: `${better.channels} channels · ${better.warranty_years} year warranty`, tone: "yes" },
    ],
  },
];

const W = 1560;
const PAD = 56;
const inner = W - PAD * 2;
const g = [];

const KICK = "THE ONE THAT COSTS MORE IS NOT THE BETTER BUY";
const kw = KICK.length * 11.5 * 0.62 + 34;
g.push(`<rect x="${PAD}" y="64" width="${kw}" height="32" rx="16" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 17, 80, KICK, 11.5, UI, 700, YELLOW_DARK));
g.push(text(PAD, 169, "₹80,000 more, and worse at the hard part", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="188" width="72" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 232, "Both are Audéo Infinio Ultra. Both fit the same hearing loss.", 18, UI, 400, BODY));

// ── the two cards, with the price gap badge between them ─────────────────────
const C_T = 276;
const C_H = 330;
const BADGE_W = 210;
const cw = (inner - BADGE_W - 44) / 2;

CARDS.forEach((c, i) => {
  const x = PAD + i * (cw + BADGE_W + 44);
  const cx = x + cw / 2;
  g.push(
    `<rect x="${x}" y="${C_T}" width="${cw}" height="${C_H}" rx="22" fill="${c.accent ? YELLOW_LIGHT : WHITE}" stroke="${c.accent ? YELLOW : BORDER}" stroke-width="${c.accent ? 2.5 : 1.5}"/>`,
  );

  g.push(htext(cx, C_T + 58, c.label, 38, DISP, 700, INK));
  g.push(htext(cx, C_T + 86, c.tier.toUpperCase(), 12, UI, 700, MUTED));
  g.push(htext(cx, C_T + 138, inr(c.m.mrp), 34, DISP, 700, c.accent ? YELLOW_DARK : INK));
  g.push(htext(cx, C_T + 162, "per pair", 13, UI, 400, SUBTLE));

  g.push(`<line x1="${x + 30}" y1="${C_T + 186}" x2="${x + cw - 30}" y2="${C_T + 186}" stroke="${c.accent ? YELLOW : BORDER}" stroke-width="1.5"/>`);

  let ry = C_T + 218;
  for (const r of c.rows) {
    g.push(marker(r.tone, x + 42, ry, 13));
    const lines = wrap(r.t, cw - 92, 15.5, 0.55);
    lines.forEach((ln, li) => {
      g.push(ltext(x + 68, ry + li * 20 - (lines.length - 1) * 10, ln, 15.5, UI, 500, BODY));
    });
    ry += Math.max(38, lines.length * 20 + 18);
  }
});

// ── the gap badge ────────────────────────────────────────────────────────────
const bx = PAD + cw + 22;
const bcy = C_T + C_H / 2;
g.push(`<rect x="${bx}" y="${bcy - 74}" width="${BADGE_W}" height="148" rx="22" fill="${INK}"/>`);
g.push(mtext(bx + BADGE_W / 2, bcy - 40, "THE SPHERE IS", 11.5, UI, 700, PAPER));
g.push(mtext(bx + BADGE_W / 2, bcy + 4, inr(gapAmount), 36, DISP, 700, YELLOW));
g.push(mtext(bx + BADGE_W / 2, bcy + 44, "CHEAPER", 17, DISP, 700, PAPER));

// ── the closing line ─────────────────────────────────────────────────────────
const L_T = C_T + C_H + 40;
g.push(`<rect x="${PAD}" y="${L_T}" width="${inner}" height="84" rx="20" fill="${WHITE}" stroke="${YELLOW}" stroke-width="2"/>`);
g.push(ltext(PAD + 32, L_T + 42, "What the I90-R adds over the I70-R is loud-noise handling. That is exactly what the Sphere's chip is built for.", 19, UI, 600, INK));

const F_T = L_T + 84 + 40;
g.push(text(PAD, F_T, "Prices are MRP per pair from the live catalogue. Feature claims from Phonak's Infinio feature summary, doc 028-2681-03.", 14, UI, 400, SUBTLE));

const H = F_T + PAD;
g.unshift(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
