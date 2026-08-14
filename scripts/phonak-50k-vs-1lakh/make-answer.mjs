// ANSWER board -> the Signia answer to Phonak's two gaps. Sits right after
// body-limits.
//
// WHY (Chintan, 2026-07-29): body-limits ends on two dead ends. Leaving a viewer
// there is honest but useless. Both gaps have an answer, and it is Signia — so
// the board pairs each Phonak stop with the device that clears it, side by side.
//
//   BEHIND THE EAR   Phonak's rechargeable BTE stops at 90 dB and is Lumity.
//                    Signia Motion C&G SP 1IX is rechargeable, reaches 120 dB,
//                    and is on IX, the current platform. AND IT COSTS LESS.
//   IN THE CANAL     Phonak has no rechargeable CIC at any price.
//                    Signia Insio C&G CIC 1IX is rechargeable AND invisible.
//
// ⚠️ THE BTE COMPARISON IS THE STRONGER ONE AND THE BOARD SHOULD SHOW IT THAT
// WAY: the Signia does more on every axis AND is cheaper than the Phonak it is
// being compared against (₹1,34,990 vs ₹1,38,000). That is not a talking point
// to bury. The deltas are computed, never typed, and a guard fails the build if
// a repricing ever reverses it.
//
// ⚠️ COMPARE LIKE FOR LIKE. Naida L30-PR is the right Phonak for the BTE row —
// it is Phonak's RECHARGEABLE behind-the-ear, which is the axis in question.
// Comparing against the L30-UP instead would be a straw man: the UP is not
// rechargeable and nobody claims it is.
//
// VISUAL, NOT WORDY (his standing instruction): two device pictures per row, a
// tick/cross ladder between them, two prices. The reader should get it before
// reading a word.
//
// Signia renders come from Supabase Storage (webp -> PNG); Phonak from the local
// Target library. rule 1b — English only.
// Run: npm run board:phonak-answer
import { boardOut } from "../../lib/paths.mjs";
import { rest, storageBuffer } from "../../lib/supabase.mjs";
import { pngDataUri } from "../../lib/brand.mjs";
import { renderDataUri, scaleFor } from "../../lib/phonak-renders.mjs";
import { imageSlot } from "../../lib/imageslot.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "answer.svg");

const PHONAK_BTE = "HA-284";  // Naida L30-PR — Phonak's rechargeable BTE
const SIGNIA_BTE = "HA-040";  // Motion C&G SP 1IX
const PHONAK_CIC = "HA-301";  // Virto I30-10 NW O
const SIGNIA_CIC = "HA-067";  // Insio C&G CIC 1IX (the Pair row)

const IDS = [PHONAK_BTE, SIGNIA_BTE, PHONAK_CIC, SIGNIA_CIC];
const rows = await rest(
  `hearing_aid_models?id=in.(${IDS.join(",")})&select=id,model_name,mrp,unit,channels,rechargeable,fitting_min,fitting_max`,
);
const byId = new Map(rows.map((r) => [r.id, r]));
const pair = (id) => {
  const m = byId.get(id);
  return m.unit === "Pcs" ? m.mrp * 2 : m.mrp;
};
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// Display names: the catalogue suffix "NW O" wraps to a lonely "O" on a card and
// tells a viewer nothing. Board label only — never used for render lookup.
const SHORT = { "HA-301": "Virto I30-10" };
const label = (id) => SHORT[id] || byId.get(id).model_name;

const pB = byId.get(PHONAK_BTE), sB = byId.get(SIGNIA_BTE);
const pC = byId.get(PHONAK_CIC), sC = byId.get(SIGNIA_CIC);

// GUARDS — every claim on this board, checked live.
if (!sB.rechargeable || sB.fitting_max <= pB.fitting_max) {
  throw new Error(
    `answer: the board claims Motion SP 1IX is rechargeable and reaches further than ` +
      `Naida L30-PR, but the catalogue says ${sB.fitting_max} dB vs ${pB.fitting_max} dB.`,
  );
}
if (pair(SIGNIA_BTE) >= pair(PHONAK_BTE)) {
  throw new Error(
    `answer: the board's strongest line is that the Signia BTE costs LESS. ` +
      `It is now ${inr(pair(SIGNIA_BTE))} vs ${inr(pair(PHONAK_BTE))}. Re-word before shipping.`,
  );
}
if (!sC.rechargeable || pC.rechargeable) {
  throw new Error("answer: expected the Signia CIC rechargeable and the Phonak CIC not.");
}
const bteSave = pair(PHONAK_BTE) - pair(SIGNIA_BTE);

// ── art ──────────────────────────────────────────────────────────────────────
const signiaArt = async (id) => {
  const hero = await rest(`model_images?model_id=eq.${id}&role=eq.hero&select=images(bucket,path)`);
  const im = hero[0]?.images;
  if (!im) return null;
  const buf = await storageBuffer(im.bucket, im.path);
  if (!buf) return null;
  return { uri: await pngDataUri(buf, (s) => s.trim({ threshold: 12 }).resize(420, 420, { fit: "inside" })) };
};
const art = {
  [PHONAK_BTE]: await renderDataUri(pB.model_name, { size: 400 }),
  [PHONAK_CIC]: await renderDataUri(pC.model_name, { size: 400 }),
  [SIGNIA_BTE]: await signiaArt(SIGNIA_BTE),
  [SIGNIA_CIC]: await signiaArt(SIGNIA_CIC),
};
// Scale by real body size so the CIC never renders bigger than the BTE.
const SCALE = { [PHONAK_BTE]: 1.0, [SIGNIA_BTE]: 1.0, [PHONAK_CIC]: 0.36, [SIGNIA_CIC]: 0.36 };

// ── the two rows ─────────────────────────────────────────────────────────────
const ROWS = [
  {
    shape: "BEHIND THE EAR",
    gap: "Rechargeable, or profound. Never both.",
    left: {
      brand: "PHONAK", id: PHONAK_BTE,
      facts: [
        { ok: true, t: "Rechargeable" },
        { ok: false, t: `Only to ${pB.fitting_max} dB` },
        { ok: false, t: "Lumity, the previous platform" },
      ],
    },
    right: {
      brand: "SIGNIA", id: SIGNIA_BTE,
      facts: [
        { ok: true, t: "Rechargeable" },
        { ok: true, t: `All the way to ${sB.fitting_max} dB` },
        { ok: true, t: "IX, the current platform" },
      ],
    },
    verdict: `Everything Phonak cannot do here, and ${inr(bteSave)} less.`,
  },
  {
    shape: "COMPLETELY IN THE CANAL",
    gap: "Invisible, or rechargeable. Never both.",
    left: {
      brand: "PHONAK", id: PHONAK_CIC,
      facts: [
        { ok: true, t: "Invisible" },
        { ok: false, t: "Size 10 battery" },
        { ok: false, t: "No rechargeable CIC, at any price" },
      ],
    },
    right: {
      brand: "SIGNIA", id: SIGNIA_CIC,
      facts: [
        { ok: true, t: "Invisible" },
        { ok: true, t: "Rechargeable" },
        { ok: true, t: "IX, the current platform" },
      ],
    },
    verdict: "The one thing Phonak does not make, in any shape.",
  },
];

// ── pieces ───────────────────────────────────────────────────────────────────
const tick = (cx, cy, r = 12) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${YELLOW}"/>` +
  `<path d="M ${cx - 5} ${cy} l 3 3.5 l 6 -6.5" fill="none" stroke="${YELLOW_DARK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy, r = 12) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${SUBTLE}" stroke-width="1.8"/>` +
  `<path d="M ${cx - 4.5} ${cy - 4.5} L ${cx + 4.5} ${cy + 4.5} M ${cx + 4.5} ${cy - 4.5} L ${cx - 4.5} ${cy + 4.5}" stroke="${SUBTLE}" stroke-width="2.2" stroke-linecap="round"/>`;

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const SIDEW = 430, ARROWW = 116;
const CARDW = SIDEW * 2 + ARROWW;
const W = PAD * 2 + CARDW;
const T = 250;
const SLOT = 150;
const ROWH = 478, ROWGAP = 28;
// The winner's highlight box must ENCLOSE all three facts. Facts run to y+318+2*32;
// a box of ROWH-190 ended above the last one and clipped it.
const WINBOX_H = 294;
const H = T + ROWS.length * ROWH + (ROWS.length - 1) * ROWGAP + 104 + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "SO WHAT DO YOU DO INSTEAD?";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "Both gaps have an answer", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "It just is not Phonak. We sell both brands, so we can say that.", 18, UI, 400, MUTED));

ROWS.forEach((r, ri) => {
  const y = T + ri * (ROWH + ROWGAP);
  g.push(`<rect x="${PAD}" y="${y}" width="${CARDW}" height="${ROWH}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);

  g.push(ltext(PAD + 32, y + 42, r.shape, 12, UI, 700, SUBTLE));
  g.push(ltext(PAD + 32, y + 74, r.gap, 26, DISP, 700, INK));
  g.push(`<line x1="${PAD + 32}" y1="${y + 100}" x2="${PAD + CARDW - 32}" y2="${y + 100}" stroke="${BORDER}" stroke-width="1"/>`);

  const side = (sx, s, win) => {
    if (win) {
      g.push(`<rect x="${sx + 14}" y="${y + 118}" width="${SIDEW - 28}" height="${WINBOX_H}" rx="18" fill="${YELLOW_LIGHT}" stroke="${YELLOW}" stroke-width="2"/>`);
    }
    g.push(imageSlot({ x: sx + 34, y: y + 138, size: SLOT, uri: art[s.id]?.uri, uriScale: SCALE[s.id] }));

    const tx = sx + 34 + SLOT + 26;
    g.push(ltext(tx, y + 162, s.brand, 11, UI, 700, win ? YELLOW_DARK : SUBTLE));
    wrap(label(s.id), SIDEW - SLOT - 92, 20, 0.56).forEach((ln, li) =>
      g.push(ltext(tx, y + 190 + li * 24, ln, 20, DISP, 700, INK)),
    );
    g.push(ltext(tx, y + 252, inr(pair(s.id)), 24, DISP, 700, INK));
    g.push(ltext(tx, y + 276, "a pair", 12.5, UI, 400, SUBTLE));

    s.facts.forEach((f, fi) => {
      const fy = y + 318 + fi * 32;
      if (f.ok) g.push(tick(sx + 46, fy)); else g.push(cross(sx + 46, fy));
      g.push(ltext(sx + 68, fy, f.t, 14.5, UI, 600, f.ok ? INK : SUBTLE));
    });
  };

  side(PAD, r.left, false);
  side(PAD + SIDEW + ARROWW, r.right, true);

  // the arrow between them
  const ax = PAD + SIDEW + ARROWW / 2, ay = y + 236;
  g.push(`<line x1="${ax - 26}" y1="${ay}" x2="${ax + 14}" y2="${ay}" stroke="${YELLOW}" stroke-width="6" stroke-linecap="round"/>`);
  g.push(`<path d="M ${ax + 6} ${ay - 14} L ${ax + 26} ${ay} L ${ax + 6} ${ay + 14}" fill="none" stroke="${YELLOW}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);

  g.push(ltext(PAD + 32, y + ROWH - 34, r.verdict, 16, UI, 700, YELLOW_DARK));
});

const footT = T + ROWS.length * ROWH + (ROWS.length - 1) * ROWGAP;
g.push(text(PAD, footT + 52, "This is why we do not sell one brand.", 20, DISP, 700, INK));
g.push(text(PAD, footT + 80, "MRP, a pair. Both brands are on our shelf, so the recommendation costs us nothing either way.", 14.5, UI, 400, MUTED));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
