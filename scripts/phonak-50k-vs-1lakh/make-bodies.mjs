// BODIES boards -> the ₹1,00,000 category seen by BODY, not by platform. TWO FILES:
//   bodies.svg       what Phonak offers in each of the four shapes
//   body-limits.svg  the two shapes where Phonak stops short, spelled out
//
// WHY (Chintan, 2026-07-29): `delta` walks the platform ladder, but that ladder
// is entirely RIC. A viewer who needs a behind-the-ear or an in-ear device has
// not been answered by it. These two boards do the same job across all four
// bodies, and then make the two gaps unmissable.
//
// ⚠️ THESE OVERLAP WITH `cheezein` BY DESIGN, AND THAT IS A PROBLEM TO RESOLVE.
// `cheezein` (66%) states the same two facts framed as two PEOPLE who cannot be
// served, and adds the Signia line. body-limits states them as PRODUCT gaps at
// 45-48%. Revealing the same thing twice blunts the second one. Flagged to
// Chintan — either cheezein moves/goes, or these sit where cheezein does.
//
// THE FACTS, verified live below and guarded:
//   BTE  1. Rechargeable stops BELOW the top power. Naida L30-PR is rechargeable
//           but fits 20-90 dB; the UP reaches 120 dB on a disposable battery.
//        2. Lumity only. There is no Infinio behind-the-ear, at any price.
//   CIC  No rechargeable CIC exists at all. Phonak's rechargeable custom stops
//        at ITC (Virto I30-R). The CIC is a size 10 battery.
//
// ⚠️ NEVER let this read as "Phonak has no rechargeable BTE" — Naida L30-PR is
// on the board precisely so the honest, narrower claim is visible.
//
// VISUAL, NOT WORDY (his standing instruction). Ticks, crosses, dB bars, prices.
// rule 1b — English only. Run: npm run board:phonak-bodies
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { renderDataUri, scaleFor } from "../../lib/phonak-renders.mjs";
import { imageSlot } from "../../lib/imageslot.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const IDS = ["HA-275", "HA-271", "HA-315", "HA-231", "HA-284", "HA-314", "HA-301"];
const rows = await rest(
  `hearing_aid_models?id=in.(${IDS.join(",")})&select=id,model_name,mrp,unit,channels,rechargeable,fitting_min,fitting_max`,
);
const byId = new Map(rows.map((r) => [r.id, r]));
const pair = (id) => {
  const m = byId.get(id);
  return m.unit === "Pcs" ? m.mrp * 2 : m.mrp;
};
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const PR = byId.get("HA-284"); // Naida L30-PR — rechargeable BTE
const UP = byId.get("HA-231"); // Naida L30-UP — the one that reaches profound

// GUARDS — both boards rest on these. Fail loudly rather than mislead.
if (!PR.rechargeable || UP.rechargeable) {
  throw new Error("bodies: expected Naida L30-PR rechargeable and L30-UP not. Catalogue changed.");
}
if (PR.fitting_max >= UP.fitting_max) {
  throw new Error(
    `bodies: the boards claim the rechargeable BTE stops short of the battery one, but ` +
      `PR reaches ${PR.fitting_max} dB and UP reaches ${UP.fitting_max} dB.`,
  );
}
if (byId.get("HA-301").rechargeable) {
  throw new Error("bodies: the boards claim no rechargeable CIC, but Virto I30-10 now is.");
}
if (!byId.get("HA-314").rechargeable) {
  throw new Error("bodies: the boards claim the rechargeable custom stops AT ITC, but Virto I30-R is not rechargeable.");
}

// ── the four bodies ──────────────────────────────────────────────────────────
const BODIES = [
  {
    code: "RIC", name: "Receiver in canal", art: "HA-271",
    models: ["HA-275", "HA-271", "HA-315"],
    platforms: "Lumity and Infinio",
    rech: true, complete: true,
  },
  {
    code: "BTE", name: "Behind the ear", art: "HA-284",
    models: ["HA-231", "HA-284"],
    platforms: "Lumity only",
    rech: "partial", complete: false,
    flag: "Two catches",
  },
  {
    code: "ITC", name: "In the canal", art: "HA-314",
    models: ["HA-314"],
    platforms: "Infinio",
    rech: true, complete: true,
  },
  {
    code: "CIC", name: "Completely in canal", art: "HA-301",
    models: ["HA-301"],
    platforms: "Infinio",
    rech: false, complete: false,
    flag: "One catch",
  },
];

// Renders are keyed by MODEL ID, not by body code, because body-limits compares
// two models WITHIN a body (PR vs UP, ITC vs CIC) and each needs its own picture.
const CIC_IDS = new Set(["HA-301"]);
const art = new Map();
for (const id of IDS) {
  const r = await renderDataUri(byId.get(id).model_name, { size: 400 });
  if (!r) console.warn(`bodies: no render for ${byId.get(id).model_name}`);
  art.set(id, r);
}
const artScale = (id) => scaleFor(art.get(id), { cic: CIC_IDS.has(id) });

// ── shared pieces ────────────────────────────────────────────────────────────
const tick = (cx, cy, r = 15) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${YELLOW}"/>` +
  `<path d="M ${cx - 6} ${cy} l 3.5 4 l 7.5 -8" fill="none" stroke="${YELLOW_DARK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy, r = 15) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${SUBTLE}" stroke-width="2"/>` +
  `<path d="M ${cx - 5.5} ${cy - 5.5} L ${cx + 5.5} ${cy + 5.5} M ${cx + 5.5} ${cy - 5.5} L ${cx - 5.5} ${cy + 5.5}" stroke="${SUBTLE}" stroke-width="2.4" stroke-linecap="round"/>`;

// ════════════════════════════════════════════════════════════════════════════
// BOARD 1 — the four bodies
// ════════════════════════════════════════════════════════════════════════════
{
  const PAD = 56, GAP = 24, CARDW = 356;
  const W = PAD * 2 + 4 * CARDW + 3 * GAP;
  const T = 250;
  const SLOT = CARDW - 120;
  const maxModels = Math.max(...BODIES.map((b) => b.models.length));
  const CARDH = SLOT + 150 + maxModels * 52 + 84;
  const FOOT_T = T + CARDH + 44;
  const H = FOOT_T + 62 + PAD;

  const g = [];
  g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

  const kicker = "THE ₹1,00,000 CATEGORY, BY BODY";
  const kw = kicker.length * 12 * 0.62 + 36;
  g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
  g.push(text(PAD, 158, "Four bodies. Two are complete. Two are not.", 46, DISP, 700, INK));
  g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
  g.push(text(PAD, 208, "Same engine in all of them. What changes is where it sits, and what Phonak can offer in that shape.", 18, UI, 400, MUTED));

  BODIES.forEach((b, i) => {
    const x = PAD + i * (CARDW + GAP);
    const warn = !b.complete;
    g.push(
      `<rect x="${x}" y="${T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${warn ? YELLOW : BORDER}" stroke-width="${warn ? 2.5 : 1.5}"/>`,
    );

    g.push(htext(x + CARDW / 2, T + 50, b.code, 30, DISP, 700, INK));
    g.push(htext(x + CARDW / 2, T + 74, b.name, 13.5, UI, 400, SUBTLE));

    g.push(imageSlot({ x: x + (CARDW - SLOT) / 2, y: T + 96, size: SLOT, uri: art.get(b.art)?.uri, uriScale: artScale(b.art) }));

    let y = T + 96 + SLOT + 44;
    b.models.forEach((id) => {
      const m = byId.get(id);
      g.push(ltext(x + 26, y, m.model_name, 16, DISP, 700, INK));
      g.push(text(x + CARDW - 26, y, inr(pair(id)), 15, DISP, 700, BODY, "end"));
      y += 52;
    });

    // the two facts that decide whether the shape is complete
    const fy = T + CARDH - 76;
    g.push(`<line x1="${x + 26}" y1="${fy - 24}" x2="${x + CARDW - 26}" y2="${fy - 24}" stroke="${BORDER}" stroke-width="1"/>`);
    g.push(ltext(x + 26, fy, b.platforms, 13.5, UI, 600, warn ? YELLOW_DARK : SUBTLE));

    const ry = fy + 30;
    if (b.rech === true) { g.push(tick(x + 36, ry)); g.push(ltext(x + 58, ry, "Rechargeable", 13.5, UI, 600, BODY)); }
    else if (b.rech === false) { g.push(cross(x + 36, ry)); g.push(ltext(x + 58, ry, "No rechargeable", 13.5, UI, 600, SUBTLE)); }
    else { g.push(tick(x + 36, ry)); g.push(ltext(x + 58, ry, "Rechargeable, but not at the top", 13, UI, 600, YELLOW_DARK)); }

    if (b.flag) {
      const bw = b.flag.length * 11.5 * 0.62 + 30;
      g.push(`<rect x="${x + CARDW - bw - 22}" y="${T + 22}" width="${bw}" height="26" rx="13" fill="${YELLOW}"/>`);
      g.push(mtext(x + CARDW - bw / 2 - 22, T + 35, b.flag, 11.5, UI, 700, YELLOW_DARK));
    }
  });

  g.push(text(PAD, FOOT_T + 24, "Behind the ear and completely in the canal are the two where Phonak stops short. That is the next board.", 19, DISP, 700, INK));
  g.push(text(PAD, FOOT_T + 52, "MRP, a pair. Phonak's own renders, sized to approximate real relative scale.", 13, UI, 400, SUBTLE));

  writeBoard(boardOut("phonak-50k-vs-1lakh", "bodies.svg"), { w: W, h: H, body: g.join("\n"), xlink: true });
}

// ════════════════════════════════════════════════════════════════════════════
// BOARD 2 — where those two stop
//
// Both cards use ONE shared device-pair layout (devicePair below): two real
// renders side by side, tick/cross, and the fact underneath. Chintan asked for
// the behind-the-ear pictures to match the Virto treatment — and it is the right
// call, because the whole argument is "these two are the same shape, and only
// one of them does the thing you want".
// ════════════════════════════════════════════════════════════════════════════
{
  const PAD = 56, GAP = 28, CARDW = 664;
  const W = PAD * 2 + 2 * CARDW + GAP;
  const T = 250;

  // ── the shared pair layout ────────────────────────────────────────────────
  const PAIR_H = 300, SLOT = 130;
  /** Two devices side by side inside a card, with the picture doing the work. */
  const devicePair = (g, x, y, cardW, pair) => {
    const CW = (cardW - 64 - 24) / 2;
    pair.forEach((c, i) => {
      const cx0 = x + 32 + i * (CW + 24);
      g.push(
        `<rect x="${cx0}" y="${y}" width="${CW}" height="${PAIR_H}" rx="18" fill="${c.ok ? YELLOW_LIGHT : PAPER}" stroke="${c.ok ? YELLOW : BORDER}" stroke-width="${c.ok ? 2 : 1.5}"/>`,
      );
      g.push(imageSlot({ x: cx0 + (CW - SLOT) / 2, y: y + 18, size: SLOT, uri: art.get(c.id)?.uri, uriScale: artScale(c.id) }));
      g.push(htext(cx0 + CW / 2, y + 18 + SLOT + 38, byId.get(c.id).model_name, 17, DISP, 700, INK));
      // verdict, centred as a unit so the glyph and the word read together
      const vw = c.verdict.length * 13.5 * 0.55 + 34;
      const vy = y + 18 + SLOT + 66;
      if (c.ok) g.push(tick(cx0 + CW / 2 - vw / 2 + 12, vy, 12));
      else g.push(cross(cx0 + CW / 2 - vw / 2 + 12, vy, 12));
      g.push(ltext(cx0 + CW / 2 - vw / 2 + 32, vy, c.verdict, 13.5, UI, 700, c.ok ? YELLOW_DARK : SUBTLE));
      // the number or the note, whichever carries the point
      if (c.pill) {
        const pw = c.pill.length * 13 * 0.56 + 30;
        g.push(`<rect x="${cx0 + CW / 2 - pw / 2}" y="${vy + 20}" width="${pw}" height="28" rx="14" fill="${c.ok ? YELLOW : SUBTLE}"/>`);
        g.push(mtext(cx0 + CW / 2, vy + 34, c.pill, 13, UI, 700, c.ok ? YELLOW_DARK : WHITE));
      }
      if (c.note) g.push(htext(cx0 + CW / 2, vy + (c.pill ? 66 : 24), c.note, 12.5, UI, 400, SUBTLE));
    });
  };

  const CARDH = 700;
  const H = T + CARDH + 100 + PAD;

  const g = [];
  g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

  const kicker = "WHERE PHONAK STOPS SHORT";
  const kw = kicker.length * 12 * 0.62 + 36;
  g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
  g.push(text(PAD, 158, "Two shapes, three catches", 46, DISP, 700, INK));
  g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
  g.push(text(PAD, 208, "Not a budget problem. Spending more does not fix any of these.", 18, UI, 400, MUTED));

  // ── BTE, two catches ──────────────────────────────────────────────────────
  {
    const x = PAD;
    g.push(`<rect x="${x}" y="${T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${YELLOW}" stroke-width="2.5"/>`);
    g.push(ltext(x + 32, T + 44, "BEHIND THE EAR", 12, UI, 700, YELLOW_DARK));
    g.push(ltext(x + 32, T + 78, "Two catches", 30, DISP, 700, INK));
    g.push(`<line x1="${x + 32}" y1="${T + 104}" x2="${x + CARDW - 32}" y2="${T + 104}" stroke="${BORDER}" stroke-width="1"/>`);

    g.push(`<circle cx="${x + 46}" cy="${T + 142}" r="15" fill="${YELLOW}"/>`);
    g.push(mtext(x + 46, T + 142, "1", 14, UI, 700, YELLOW_DARK));
    g.push(ltext(x + 72, T + 142, "Rechargeable stops before the power does", 19, DISP, 700, INK));

    devicePair(g, x, T + 172, CARDW, [
      { id: "HA-284", ok: true, verdict: "Rechargeable", pill: `${PR.fitting_min} to ${PR.fitting_max} dB` },
      { id: "HA-231", ok: false, verdict: "Battery", pill: `${UP.fitting_min} to ${UP.fitting_max} dB` },
    ]);
    g.push(ltext(x + 32, T + 172 + PAIR_H + 26, "The one that reaches profound is not the rechargeable one.", 14, UI, 600, YELLOW_DARK));

    // catch 2 — no Infinio BTE
    const c2 = T + 172 + PAIR_H + 72;
    g.push(`<circle cx="${x + 46}" cy="${c2}" r="15" fill="${YELLOW}"/>`);
    g.push(mtext(x + 46, c2, "2", 14, UI, 700, YELLOW_DARK));
    g.push(ltext(x + 72, c2, "There is no Infinio behind the ear", 19, DISP, 700, INK));

    let cxp = x + 72;
    [{ n: "Terra", ok: true }, { n: "Lumity", ok: true }, { n: "Infinio", ok: false }].forEach((p) => {
      const w = p.n.length * 15 * 0.62 + 54;
      g.push(`<rect x="${cxp}" y="${c2 + 26}" width="${w}" height="42" rx="21" fill="${p.ok ? WHITE : PAPER}" stroke="${p.ok ? YELLOW : BORDER}" stroke-width="2"/>`);
      if (p.ok) g.push(tick(cxp + 24, c2 + 47, 11)); else g.push(cross(cxp + 24, c2 + 47, 11));
      g.push(ltext(cxp + 42, c2 + 47, p.n, 15, DISP, 700, p.ok ? INK : SUBTLE));
      cxp += w + 12;
    });

    g.push(ltext(x + 32, T + CARDH - 30, "Need a behind-the-ear? You cannot have the latest platform. At any price.", 14.5, UI, 600, YELLOW_DARK));
  }

  // ── CIC, one catch ────────────────────────────────────────────────────────
  {
    const x = PAD + CARDW + GAP;
    g.push(`<rect x="${x}" y="${T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${YELLOW}" stroke-width="2.5"/>`);
    g.push(ltext(x + 32, T + 44, "COMPLETELY IN THE CANAL", 12, UI, 700, YELLOW_DARK));
    g.push(ltext(x + 32, T + 78, "One catch", 30, DISP, 700, INK));
    g.push(`<line x1="${x + 32}" y1="${T + 104}" x2="${x + CARDW - 32}" y2="${T + 104}" stroke="${BORDER}" stroke-width="1"/>`);

    g.push(`<circle cx="${x + 46}" cy="${T + 142}" r="15" fill="${YELLOW}"/>`);
    g.push(mtext(x + 46, T + 142, "1", 14, UI, 700, YELLOW_DARK));
    g.push(ltext(x + 72, T + 142, "The rechargeable custom stops at ITC", 19, DISP, 700, INK));

    devicePair(g, x, T + 172, CARDW, [
      { id: "HA-314", ok: true, verdict: "Rechargeable", note: "But you can see it." },
      { id: "HA-301", ok: false, verdict: "Battery only", note: "Invisible. Size 10 battery." },
    ]);
    g.push(ltext(x + 32, T + 172 + PAIR_H + 26, "Rechargeable does exist in Phonak. Just never in the invisible one.", 14, UI, 600, YELLOW_DARK));

    g.push(ltext(x + 32, T + CARDH - 30, "Want invisible AND rechargeable? Phonak does not make one. At any price.", 14.5, UI, 600, YELLOW_DARK));
  }

  g.push(text(PAD, T + CARDH + 52, "Both are honest limits of the brand, not of your budget.", 20, DISP, 700, INK));
  g.push(text(PAD, T + CARDH + 80, "Phonak does make a rechargeable behind-the-ear. It just does not reach the top power. That distinction matters.", 15, UI, 400, MUTED));

  writeBoard(boardOut("phonak-50k-vs-1lakh", "body-limits.svg"), { w: W, h: H, body: g.join("\n"), xlink: true });
}
