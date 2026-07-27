// Synva 3-STEP FRAMEWORK board -> website-styled SVG for a video explainer.
//
// Mirrors the homepage framework section (src/components/sections/home/
// how-it-works.tsx + data/how-it-works-data.ts): three colour-coded step panels
// (01 hearing = yellow, 02 lifestyle = blue, 03 budget = green), each with a text
// column + three white cards, chained by carry-forward connector pills.
//
// Board rules (skill): strictly Synva tokens (globals.css), single font-family
// per <text>, vector Lucide <path> icons, FLAT fills only, real SVG centring.
// The step's photos can't be raster-embedded on a Figma board (no <image>), so
// step 01's device tiles lead with the device-type name + a unifying ear icon.
// Copy transcribed from the website data (presentational framework narrative,
// not catalogue data). Free-size — sized to content.
//
// Run: npm run board:framework
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { logo, soundwave, WAVE_RATIO } from "../../lib/brand.mjs";
import { text, mtext, wrap, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK,
  BLUE, BLUE_LIGHT, BLUE_DARK,
  GREEN, GREEN_LIGHT, GREEN_DARK,
  DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-framework.svg");

// ── content (from how-it-works-data.ts — the three-lens colour coding is the
//    website's intentional design, the reason boards go beyond yellow here) ────
const HEADER = {
  eyebrow: "The framework",
  title: "The right way to choose a hearing aid",
  sub: "Three things matter. That's it. We narrow down 500+ options using this exact framework.",
};
const CLOSE = "Three filters, give you the best three models that fit your Hearing, Lifestyle and your Budget.";

const STEPS = [
  {
    num: "01", title: "Your hearing loss", kind: "devices",
    tint: YELLOW_LIGHT, accent: YELLOW_DARK, plate: YELLOW_LIGHT, glyph: YELLOW_DARK,
    body: "Your hearing loss decides whether you need a RIC, BTE, or in-ear device, not advertisements. Your audiogram narrows the field before anything else does.",
    carry: "Your device type carries into step 02",
    cards: [
      { icon: "ear", name: "RIC", blurb: "Receiver-in-canal, the modern default" },
      { icon: "ear", name: "BTE", blurb: "Behind-the-ear, power and reliability" },
      { icon: "ear", name: "In-ear", blurb: "In-the-ear to invisible, the discreet family" },
    ],
  },
  {
    num: "02", title: "Your lifestyle", kind: "personas",
    tint: BLUE_LIGHT, accent: BLUE_DARK, plate: BLUE_LIGHT, glyph: BLUE_DARK,
    body: "We identify the features you truly need based on how you actually live. Three profiles cover almost everyone, and most people land in the first two.",
    carry: "Type + features carry into step 03",
    cards: [
      { icon: "coffee", name: "Quiet & Cozy", channels: "6 to 8 channels", features: ["Programmable digital basics"], ideal: "Calm, quiet environments" },
      { icon: "users", name: "Social & Fulfilling", channels: "8 to 12 channels", features: ["Noise & feedback cancellation", "Adaptive microphones"], ideal: "Conversations and group settings" },
      { icon: "rocket", name: "Dynamic & Demanding", channels: "16 to 20 channels", features: ["Dynamic sound processing", "AI noise cancellation"], ideal: "Active, fast-paced lifestyles" },
    ],
  },
  {
    num: "03", title: "Your budget", kind: "tiers",
    tint: GREEN_LIGHT, accent: GREEN_DARK, fill: GREEN, band: GREEN_DARK,
    body: "We shortlist into three tiers based on your budget. No salesy pitches, no gimmicks, just what makes sense for you.",
    cards: [
      { level: 1, name: "Essential", bandText: "₹30k to 65k", blurb: "Basics that matter" },
      { level: 2, name: "Good-to-Buy", bandText: "₹90k to 1.5L", blurb: "Improved daily comfort" },
      { level: 3, name: "Premium", bandText: "₹2.0L+", blurb: "Only if it adds real value, Everyone doesn't need a Mercedes xD" },
    ],
  },
];

// ── icons ─────────────────────────────────────────────────────────────────────
const ICON_NAMES = [...new Set(STEPS.flatMap((s) => s.cards.map((c) => c.icon).filter(Boolean)))];
const icon = await loadIcons(ICON_NAMES, { stroke: 1.9 });

// ── layout constants ──────────────────────────────────────────────────────────
const PAD = 60, PANEL_PAD = 36, LEFT_W = 380, COL_GAP = 44;
const CARD_W = 240, CARD_GAP = 16, CARD_PAD = 18;
const CARD_INNER = CARD_W - CARD_PAD * 2;                    // 204
const RIGHT_W = CARD_W * 3 + CARD_GAP * 2;                   // 752
const PANEL_W = PANEL_PAD * 2 + LEFT_W + COL_GAP + RIGHT_W;  // 1248
const W = PAD * 2 + PANEL_W;                                 // 1368
const cardX = (i) => PAD + PANEL_PAD + LEFT_W + COL_GAP + i * (CARD_W + CARD_GAP);
const leftX = PAD + PANEL_PAD;

// ── card measure (returns wrapped lines + height) ─────────────────────────────
function measureCard(kind, c) {
  if (kind === "devices") {
    const blurb = wrap(c.blurb, CARD_INNER, 12.5, 0.53);
    return { ...c, blurb, h: 94 + 22 + (blurb.length - 1) * 18 + 20 };
  }
  if (kind === "personas") {
    const nameLines = wrap(c.name, CARD_INNER, 14, 0.55);
    const featLines = c.features.map((f) => wrap(f, CARD_INNER, 12, 0.53));
    const idealLines = wrap("Ideal for " + c.ideal.charAt(0).toLowerCase() + c.ideal.slice(1), CARD_INNER, 11.5, 0.53);
    const featCount = featLines.reduce((a, l) => a + l.length, 0);
    const nameBottom = 82 + (nameLines.length - 1) * 18;
    const featBottom = nameBottom + 20 + 22 + (featCount - 1) * 17;
    const idealBlock = 18 + (idealLines.length - 1) * 15;    // divider->ideal + extra lines
    return { ...c, nameLines, featLines, idealLines, h: Math.max(featBottom + 14 + idealBlock + 18, 180) };
  }
  // tiers
  const blurb = wrap(c.blurb, CARD_INNER, 12, 0.53);
  return { ...c, blurb, h: 100 + 22 + (blurb.length - 1) * 17 + 20 };
}

function measureLeft(step) {
  const body = wrap(step.body, LEFT_W, 14, 0.5);
  return { body, h: 14 + 40 + 30 + (body.length - 1) * 22 + 6 };
}

// measure panels + assign y
const HEAD_H = 292, CARRY_H = 62;
const panels = STEPS.map((step) => {
  const cards = step.cards.map((c) => measureCard(step.kind, c));
  const maxCardH = Math.max(...cards.map((c) => c.h));
  const left = measureLeft(step);
  const contentH = Math.max(maxCardH, left.h);
  return { step, cards, maxCardH, left, contentH, panelH: contentH + PANEL_PAD * 2 };
});
let yCursor = HEAD_H;
panels.forEach((p, i) => { p.y = yCursor; yCursor += p.panelH + (i < panels.length - 1 ? CARRY_H : 0); });
const panelsBottom = yCursor;
const CLOSE_TOP = panelsBottom + 44;
const WAVE_W = 440, WAVE_H = WAVE_W * WAVE_RATIO;
const waveY = CLOSE_TOP + 40;
const H = Math.round(waveY + WAVE_H + PAD);

// ── build ─────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`);

// header (centred) + logo top-right
g.push(logo(W - PAD, PAD - 4, 46));
const cx = W / 2;
const eyeW = Math.round(tw(HEADER.eyebrow, 13, 0.56)) + 40;
g.push(`<rect x="${cx - eyeW / 2}" y="${PAD}" width="${eyeW}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(cx, PAD + 17, HEADER.eyebrow, 13, UI, 700, YELLOW_DARK));
g.push(text(cx, PAD + 96, HEADER.title, 44, DISP, 700, INK, "middle"));
g.push(`<rect x="${cx - 38}" y="${PAD + 112}" width="76" height="7" rx="3.5" fill="${YELLOW}"/>`);
wrap(HEADER.sub, 560, 16.5, 0.52).forEach((ln, k) =>
  g.push(text(cx, PAD + 152 + k * 25, ln, 16.5, UI, 400, MUTED, "middle")));

// carry pill between panels
function carryPill(labelUpper, centerY) {
  const t = labelUpper.toUpperCase();
  const w = Math.round(tw(t, 11, 0.72)) + 44;
  g.push(`<line x1="${cx}" y1="${centerY - 27}" x2="${cx}" y2="${centerY - 15}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<rect x="${cx - w / 2}" y="${centerY - 15}" width="${w}" height="30" rx="15" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(mtext(cx, centerY, t, 11, UI, 600, MUTED));
  g.push(`<line x1="${cx}" y1="${centerY + 15}" x2="${cx}" y2="${centerY + 27}" stroke="${BORDER}" stroke-width="1.5"/>`);
}

// card renderers (x = card left, y = card top, cardH = uniform step height)
function drawDevice(step, c, x, y) {
  g.push(`<rect x="${x + CARD_PAD}" y="${y + 18}" width="46" height="46" rx="14" fill="${step.plate}"/>`);
  g.push(icon(c.icon, x + CARD_PAD + 11, y + 18 + 11, 24, step.glyph, 1.9));
  g.push(text(x + CARD_PAD, y + 94, c.name, 17, DISP, 700, INK));
  c.blurb.forEach((ln, k) => g.push(text(x + CARD_PAD, y + 116 + k * 18, ln, 12.5, UI, 500, BODY)));
}
function drawPersona(step, c, x, y, cardH) {
  g.push(`<rect x="${x + CARD_PAD}" y="${y + 18}" width="34" height="34" rx="11" fill="${step.plate}"/>`);
  g.push(icon(c.icon, x + CARD_PAD + 8, y + 18 + 8, 18, step.glyph, 1.8));
  let ny = y + 82;
  c.nameLines.forEach((ln, k) => g.push(text(x + CARD_PAD, ny + k * 18, ln, 14, UI, 700, INK)));
  ny += (c.nameLines.length - 1) * 18;
  g.push(text(x + CARD_PAD, ny + 20, c.channels, 11.5, UI, 700, step.accent));
  let fy = ny + 42;
  c.featLines.forEach((lines) => lines.forEach((ln) => { g.push(text(x + CARD_PAD, fy, ln, 12, UI, 500, BODY)); fy += 17; }));
  // ideal block, bottom-aligned to the (uniform) card
  const idealTop = y + cardH - 18 - (c.idealLines.length - 1) * 15;
  g.push(`<line x1="${x + CARD_PAD}" y1="${idealTop - 18}" x2="${x + CARD_W - CARD_PAD}" y2="${idealTop - 18}" stroke="${BORDER}" stroke-width="1"/>`);
  c.idealLines.forEach((ln, k) => g.push(text(x + CARD_PAD, idealTop + k * 15, ln, 11.5, UI, 400, MUTED)));
}
function drawTier(step, c, x, y) {
  const segGap = 6, segW = (CARD_INNER - segGap * 2) / 3;
  [0, 1, 2].forEach((s) =>
    g.push(`<rect x="${x + CARD_PAD + s * (segW + segGap)}" y="${y + 20}" width="${segW}" height="6" rx="3" fill="${s < c.level ? step.fill : BORDER}"/>`));
  g.push(text(x + CARD_PAD, y + 62, c.name, 14, UI, 700, INK));
  g.push(text(x + CARD_PAD, y + 82, c.bandText, 13, DISP, 600, step.band));
  c.blurb.forEach((ln, k) => g.push(text(x + CARD_PAD, y + 104 + k * 17, ln, 12, UI, 500, BODY)));
}

// panels
panels.forEach((p, pi) => {
  const { step } = p;
  // panel card
  g.push(`<rect x="${PAD}" y="${p.y}" width="${PANEL_W}" height="${p.panelH}" rx="28" fill="${step.tint}"/>`);
  const contentTop = p.y + PANEL_PAD;
  // left text column, vertically centred
  const lY = contentTop + (p.contentH - p.left.h) / 2;
  g.push(text(leftX, lY + 12, `STEP ${step.num}`, 12, UI, 700, step.accent));
  g.push(text(leftX, lY + 52, step.title, 27, DISP, 700, INK));
  p.left.body.forEach((ln, k) => g.push(text(leftX, lY + 84 + k * 22, ln, 14, UI, 500, BODY)));
  // three cards, vertically centred, uniform height
  const cY = contentTop + (p.contentH - p.maxCardH) / 2;
  p.cards.forEach((c, i) => {
    const x = cardX(i);
    g.push(`<rect x="${x}" y="${cY}" width="${CARD_W}" height="${p.maxCardH}" rx="18" fill="${WHITE}"/>`);
    if (step.kind === "devices") drawDevice(step, c, x, cY);
    else if (step.kind === "personas") drawPersona(step, c, x, cY, p.maxCardH);
    else drawTier(step, c, x, cY);
  });
  // carry connector to the next panel
  if (step.carry) carryPill(step.carry, p.y + p.panelH + CARRY_H / 2);
});

// honest close + brand soundwave foot
wrap(CLOSE, 720, 15, 0.5).forEach((ln, k) =>
  g.push(text(cx, CLOSE_TOP + k * 24, ln, 15, UI, 500, BODY, "middle")));
g.push(soundwave((W - WAVE_W) / 2, waveY, WAVE_W, YELLOW_DARK));

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), log: false });
console.log(`wrote ${OUT} (${W}x${H}); icons: ${ICON_NAMES.join(", ")}`);
