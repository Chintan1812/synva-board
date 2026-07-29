// FORM FACTORS board -> the four shapes, taught once. REUSABLE ACROSS VIDEOS.
//
// WHY THIS EXISTS (Chintan, 2026-07-29). The question was whether to put product
// images on every board, or gather all products onto one "cast list" board and
// keep the rest text. Both fail: a viewer cannot hold twelve near-identical
// hearing aids in their head, and by the time a model is named the cast board is
// long off screen.
//
// What a viewer genuinely cannot follow is not WHICH MODEL, it is what BTE, RIC,
// ITC and CIC MEAN. That is four items, they are actually visually distinct, and
// the vocabulary is reused in every hearing-aid video. So it gets taught once,
// here, and every other board can then just use the word.
//
// This board lives in boards/brand/ because it is not about one video. Ordered
// biggest to smallest, which is also most-power to least-power — the trade-off
// the viewer needs to internalise.
//
// Renders are the REAL Phonak ones, embedded (Chintan, 2026-07-29), pulled from
// the local Phonak Target library and shown in black where the model offers it.
// The representative model per shape is a real catalogue row, so the picture can
// never drift from the shape it illustrates. Adding a fifth shape (ITE, IIC,
// Slim-RIC all exist) is just another entry in SHAPES.
//
// ⚠️ `scale` IS LOAD-BEARING ON THIS BOARD. Phonak shoots each render at its own
// zoom, so left at 1.0 every device fills its frame and the CIC comes out LOOKING
// BIGGER THAN THE RIC — on the one board whose entire argument is that smaller
// means less visible. These fractions are approximate real-world sizes relative
// to a BTE (roughly 50 / 42 / 22 / 17 mm long), and the board says so in the
// footnote. If you swap a model, re-check its scale.
//
// Board rules: English only (rule 1b) · Synva tokens · flat fills · real centring.
// Run: npm run board:form-factors
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { renderDataUri } from "../../lib/phonak-renders.mjs";
import { text, htext, mtext, ltext, writeBoard, wrap } from "../../lib/svg.mjs";
import { boardHeader } from "../../lib/callout.mjs";
import { imageSlot } from "../../lib/imageslot.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-form-factors.svg");

// Biggest to smallest. `model` is the render we borrow to illustrate the shape.
const SHAPES = [
  {
    code: "BTE",
    name: "Behind the ear",
    model: "HA-231", // Naida L30-UP
    note: "The body sits behind the ear, a tube carries sound in.",
    power: "Most power",
    visible: "Most visible",
    scale: 1.0,
  },
  {
    code: "RIC",
    name: "Receiver in canal",
    model: "HA-271", // Audeo I30-R
    note: "Body behind the ear, the speaker itself sits in the canal.",
    power: "Plenty of power",
    visible: "Slim, discreet",
    scale: 0.84,
  },
  {
    code: "ITC",
    name: "In the canal",
    model: "HA-314", // Virto I30-R
    note: "One custom piece, moulded to your ear. Still visible.",
    power: "Good power",
    visible: "Small",
    scale: 0.46,
  },
  {
    code: "CIC",
    name: "Completely in canal",
    model: "HA-301", // Virto I30-10 NW O
    note: "Sits deep in the canal. Nearly invisible from outside.",
    power: "Least power",
    visible: "Nearly invisible",
    scale: 0.36,
  },
];

// Model names come from Supabase (so they match the catalogue exactly), the
// renders from the local Phonak library. Black where offered, beige next.
const models = await rest(
  `hearing_aid_models?id=in.(${SHAPES.map((s) => s.model).join(",")})&select=id,model_name`,
);
const nameOf = new Map(models.map((m) => [m.id, m.model_name]));

const art = new Map();
for (const s of SHAPES) {
  const name = nameOf.get(s.model) || s.model;
  const r = await renderDataUri(name, { size: 520 });
  if (!r) console.warn(`form-factors: no Phonak render for ${name}`);
  art.set(s.model, r);
}

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 24;
const SLOT = 232; // the 1:1 picture area
const CARDW = SLOT + 48;
const W = PAD * 2 + SHAPES.length * CARDW + (SHAPES.length - 1) * GAP;
const inner = W - PAD * 2;

const head = boardHeader({
  kicker: "THE FOUR SHAPES",
  title: "Every hearing aid is one of these four",
  sub: "Bigger means more power. Smaller means less visible. That is the whole trade.",
  inner,
});

const CARD_T = head.contentT + 24;

// Card height follows the LONGEST note, rather than a guessed constant — a
// three-line note used to spill straight through the card border.
const noteLines = SHAPES.map((s) => wrap(s.note, CARDW - 52, 13, 0.55));
const maxNote = Math.max(...noteLines.map((l) => l.length));
const BODY_T = SLOT + 118; // relative to CARD_T: label block + code + name
const CARDH = BODY_T + 58 + 82 + maxNote * 19 + 22;

const SCALE_T = CARD_T + CARDH + 34;
const FOOT_T = SCALE_T + 74 + 34;
const H = FOOT_T + 22 + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);
g.push(...head.nodes);

SHAPES.forEach((s, i) => {
  const x = PAD + i * (CARDW + GAP);
  g.push(
    `<rect x="${x}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`,
  );

  // 1:1 picture area
  g.push(
    imageSlot({
      x: x + 24,
      y: CARD_T + 24,
      size: SLOT,
      label: nameOf.get(s.model) || s.model,
      caption: art.get(s.model)?.colour || "example",
      uri: art.get(s.model)?.uri,
      uriScale: s.scale,
    }),
  );

  let ty = CARD_T + BODY_T;
  g.push(htext(x + CARDW / 2, ty, s.code, 30, DISP, 700, INK));
  g.push(htext(x + CARDW / 2, ty + 26, s.name, 14.5, UI, 500, MUTED));

  // the trade-off, stated per card
  ty += 58;
  g.push(`<rect x="${x + 24}" y="${ty}" width="${CARDW - 48}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(x + CARDW / 2, ty + 17, s.power, 13, UI, 700, YELLOW_DARK));
  g.push(htext(x + CARDW / 2, ty + 58, s.visible, 13.5, UI, 600, BODY));

  noteLines[i].forEach((ln, li) =>
    g.push(htext(x + CARDW / 2, ty + 82 + li * 19, ln, 13, UI, 400, SUBTLE)),
  );
});

// ── the size scale, running under all four ──────────────────────────────────
g.push(`<rect x="${PAD}" y="${SCALE_T}" width="${inner}" height="74" rx="18" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 28, SCALE_T + 37, "MORE POWER", 13, UI, 700, YELLOW_DARK));
g.push(text(PAD + 28, SCALE_T + 60, "bigger, easier to handle", 12, UI, 400, YELLOW_DARK));

const arrowY = SCALE_T + 37;
const aL = PAD + 190, aR = PAD + inner - 190;
g.push(`<line x1="${aL}" y1="${arrowY}" x2="${aR}" y2="${arrowY}" stroke="${YELLOW}" stroke-width="6" stroke-linecap="round"/>`);
g.push(`<path d="M ${aR - 18} ${arrowY - 13} L ${aR} ${arrowY} L ${aR - 18} ${arrowY + 13}" fill="none" stroke="${YELLOW}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);
g.push(mtext((aL + aR) / 2, arrowY, "BTE  ·  RIC  ·  ITC  ·  CIC", 15, DISP, 700, YELLOW_DARK));

g.push(text(PAD + inner - 168, SCALE_T + 37, "LESS VISIBLE", 13, UI, 700, YELLOW_DARK));
g.push(text(PAD + inner - 168, SCALE_T + 60, "smaller, more discreet", 12, UI, 400, YELLOW_DARK));

// Say where the renders come from, so nobody wonders if they are stock photos.
g.push(text(PAD, FOOT_T, "Phonak's own renders, in black where the model offers it, sized to approximate real relative scale.", 12.5, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), xlink: true });
