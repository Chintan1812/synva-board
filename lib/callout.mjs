// Callout card — the board shape used for every "one point, said plainly" beat.
//
// Four boards in the Phonak ₹50k-vs-₹1L video are the same object: a headline,
// two to four supporting rows, and an optional footnote. Rather than three near
// identical generators, they share this one. A board script becomes ~30 lines of
// config.
//
// Two modes:
//   rows   — one headline + a list of rows (the turn, the MRP note, don't-buy)
//   panels — two headed panels side by side (the "two things" beat)
//
// Board rules are baked in: English copy only (skill rule 1b), Synva tokens only,
// one font-family per <text>, flat fills, real SVG centring. See
// .claude/skills/figma-board-svg/SKILL.md.
import { text, htext, mtext, ltext, wrap } from "./svg.mjs";
import { imageSlot, imageSlotHeight } from "./imageslot.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "./tokens.mjs";

const PAD = 56;

// ── header geometry ──────────────────────────────────────────────────────────
// Both modes draw the same header (kicker pill, title, yellow rule, subtitle), so
// it lives here ONCE. It used to be copy-pasted into each, which is how the two
// were free to drift apart.
//
// THE RULE THAT MATTERS: vertical gaps are specified to the title's **cap top**,
// never to its baseline. `text()` positions by baseline, so a literal
// `TITLE_T = 132` left only 3px of air under the kicker pill and read as a
// collision (Chintan flagged it, 2026-07-29). Cap top = baseline - size * CAP.
// Change GAP_AFTER_KICKER if the spacing needs tuning; never hardcode TITLE_T.
const KICKER_T = 64, KICKER_H = 32;
const GAP_AFTER_KICKER = 40; // clear air between pill bottom and title cap top
const TITLE_SIZE = 46, TITLE_LEAD = 58;
const CAP = 0.72; // cap-height as a fraction of font size, for the display face

/**
 * Draws the shared board header. **Use this instead of hand-building a kicker +
 * title** — any generator that rolls its own re-opens the spacing bug above.
 * Returns the nodes plus the geometry the body needs; `contentT` is the first y
 * a caller may draw its own content at.
 */
export function boardHeader({ kicker, title, sub, inner, accent = false }) {
  const g = [];
  const titleLines = wrap(title, inner - 40, TITLE_SIZE, 0.55);
  // rounded so every downstream y (and the board height) stays a whole number
  const titleT = kicker
    ? Math.round(KICKER_T + KICKER_H + GAP_AFTER_KICKER + TITLE_SIZE * CAP)
    : 104;
  const titleH = titleLines.length * TITLE_LEAD;
  const subT = titleT + titleH - 12;

  if (kicker) {
    const kw = kicker.length * 11.5 * 0.62 + 34;
    g.push(
      `<rect x="${PAD}" y="${KICKER_T}" width="${kw}" height="${KICKER_H}" rx="${KICKER_H / 2}" fill="${accent ? WHITE : YELLOW_LIGHT}"/>`,
    );
    // vertically centred in the pill via dominant-baseline, not a tuned offset
    g.push(mtext(PAD + kw / 2, KICKER_T + KICKER_H / 2, kicker, 11.5, UI, 700, YELLOW_DARK));
  }

  titleLines.forEach((ln, i) =>
    g.push(text(PAD, titleT + i * TITLE_LEAD, ln, TITLE_SIZE, DISP, 700, INK)),
  );
  g.push(`<rect x="${PAD}" y="${titleT + titleH - 34}" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
  if (sub) g.push(text(PAD, subT + 22, sub, 18, UI, 400, MUTED));

  return { nodes: g, titleT, titleH, subT, contentT: subT + (sub ? 40 : 6) };
}

/** A yes / no / neutral marker. Flat shapes only — no filters, no gradients. */
export function marker(kind, cx, cy, r = 17) {
  if (kind === "yes")
    return (
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${YELLOW}"/>` +
      `<path d="M ${cx - 7} ${cy} l 4.5 5 l 9 -10" fill="none" stroke="${YELLOW_DARK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    );
  if (kind === "no")
    return (
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${BORDER}" stroke-width="2"/>` +
      `<path d="M ${cx - 6} ${cy - 6} L ${cx + 6} ${cy + 6} M ${cx + 6} ${cy - 6} L ${cx - 6} ${cy + 6}" stroke="${SUBTLE}" stroke-width="2.5" stroke-linecap="round"/>`
    );
  // neutral: a quiet yellow dot, for a row that is a statement rather than a verdict
  return `<circle cx="${cx}" cy="${cy}" r="5" fill="${YELLOW}"/>`;
}

/**
 * rows mode.
 *   calloutCard({ kicker, title, sub, rows: [{ label, note, tone }], footnote })
 *   tone: "yes" | "no" | "neutral" (default) | "strike"
 */
export function calloutCard({
  kicker,
  title,
  sub,
  rows = [],
  footnote,
  width = 1240,
  accent = false,
}) {
  const W = width;
  const inner = W - PAD * 2;
  const g = [];

  const head = boardHeader({ kicker, title, sub, inner, accent });
  const ROWH = 78;
  const rowsT = head.contentT + 20;
  const rowsH = rows.length * ROWH;
  const footT = rowsT + rowsH + (footnote ? 30 : 0);
  const H = footT + (footnote ? 42 : 0) + PAD;

  g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${accent ? YELLOW_LIGHT : PAPER}"/>`);
  g.push(...head.nodes);

  // Vertical centring is REAL centring: every line uses dominant-baseline="central"
  // (via ltext) and is positioned symmetrically about the box's own centre. Do not
  // go back to baseline offsets — they left the note overflowing the box.
  rows.forEach((r, i) => {
    const top = rowsT + i * ROWH;
    const boxH = ROWH - 10;
    const cy = top + boxH / 2;
    g.push(
      `<rect x="${PAD}" y="${top}" width="${inner}" height="${boxH}" rx="16" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`,
    );
    g.push(marker(r.tone === "strike" ? "no" : r.tone || "neutral", PAD + 38, cy));

    const strike = r.tone === "strike";
    // one line -> dead centre; two lines -> straddle the centre evenly
    const labelCy = r.note ? cy - 12 : cy;
    g.push(ltext(PAD + 72, labelCy, r.label, 21, DISP, 600, strike ? SUBTLE : INK));
    if (strike) {
      const lw = r.label.length * 21 * 0.55;
      g.push(`<line x1="${PAD + 72}" y1="${labelCy}" x2="${PAD + 72 + lw}" y2="${labelCy}" stroke="${SUBTLE}" stroke-width="2"/>`);
    }
    if (r.note) g.push(ltext(PAD + 72, cy + 13, r.note, 14, UI, 400, r.tone === "yes" ? BODY : SUBTLE));
  });

  if (footnote) {
    g.push(text(PAD, footT + 26, footnote, 15.5, UI, 600, YELLOW_DARK));
  }

  return { w: W, h: H, body: g.join("\n") };
}

/**
 * panels mode — two headed panels side by side.
 *   calloutPanels({ kicker, title, sub, panels: [{ head, sub, rows: [string] }] })
 */
export function calloutPanels({ kicker, title, sub, panels = [], footnote, width = 1400 }) {
  const W = width;
  const inner = W - PAD * 2;
  const GAP = 24;
  const pw = (inner - GAP * (panels.length - 1)) / panels.length;
  const g = [];

  const head = boardHeader({ kicker, title, sub, inner });
  const panelT = head.contentT + 24;

  // Optional 1:1 image slots per panel, for the boards where the SHAPE is the
  // argument (see lib/imageslot.mjs for where slots belong at all). Laid out in
  // a row under the panel head, above the bullets. Panels with different slot
  // counts still line up, because the row height is the max across panels.
  const SLOT_T = 104, SLOT_GAP = 18, SLOT_MAX = 190;
  const slotSize = (n) =>
    n ? Math.min(SLOT_MAX, (pw - 60 - SLOT_GAP * (n - 1)) / n) : 0;
  const panelSlots = panels.map((p) => p.slots || []);
  const anySlots = panelSlots.some((s) => s.length);
  const slotRowH = anySlots
    ? Math.max(
        ...panelSlots.map((s) =>
          s.length ? imageSlotHeight({ size: slotSize(s.length), url: s.some((x) => x.url), label: s.some((x) => x.label), caption: s.some((x) => x.caption) }) : 0,
        ),
      ) + 26
    : 0;
  const bodyT = SLOT_T + slotRowH + (anySlots ? 8 : 14);

  // A row may wrap to several lines. Only the FIRST line of a row gets a bullet;
  // continuation lines are plain and hang under the text, so one sentence reads
  // as one point. Drawing a bullet per rendered line turned a wrapped sentence
  // into two bullets, which is a different claim (caught in the PNG, 2026-07-29).
  const bodyLines = panels.map((p) =>
    p.rows.flatMap((r) =>
      wrap(r, pw - 76, 16, 0.55).map((ln, li) => ({ ln, first: li === 0 })),
    ),
  );
  const maxLines = Math.max(...bodyLines.map((l) => l.length));
  const panelH = bodyT + 14 + maxLines * 28 + 30;
  const footT = panelT + panelH + (footnote ? 32 : 0);
  const H = footT + (footnote ? 42 : 0) + PAD;

  g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);
  g.push(...head.nodes);

  panels.forEach((p, i) => {
    const x = PAD + i * (pw + GAP);
    g.push(`<rect x="${x}" y="${panelT}" width="${pw}" height="${panelH}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
    g.push(`<rect x="${x}" y="${panelT}" width="${pw}" height="6" rx="3" fill="${YELLOW}"/>`);
    g.push(ltext(x + 30, panelT + 48, p.head, 24, DISP, 700, INK));
    if (p.sub) g.push(ltext(x + 30, panelT + 76, p.sub, 14, UI, 400, SUBTLE));

    // slot row, centred in the panel
    const slots = panelSlots[i];
    if (slots.length) {
      const s = slotSize(slots.length);
      const rowW = slots.length * s + SLOT_GAP * (slots.length - 1);
      const sx = x + (pw - rowW) / 2;
      slots.forEach((sl, si) =>
        g.push(
          imageSlot({
            x: sx + si * (s + SLOT_GAP),
            y: panelT + SLOT_T,
            size: s,
            label: sl.label,
            caption: sl.caption,
            url: sl.url,
            uri: sl.uri,
            uriScale: sl.uriScale,
            tone: sl.tone,
          }),
        ),
      );
    }

    bodyLines[i].forEach(({ ln, first }, li) => {
      const ly = panelT + bodyT + 14 + li * 28;
      if (first) g.push(`<circle cx="${x + 34}" cy="${ly}" r="3.5" fill="${YELLOW}"/>`);
      g.push(ltext(x + 48, ly, ln, 16, UI, 500, BODY));
    });
  });

  if (footnote) g.push(text(PAD, footT + 26, footnote, 15.5, UI, 600, YELLOW_DARK));

  return { w: W, h: H, body: g.join("\n") };
}
