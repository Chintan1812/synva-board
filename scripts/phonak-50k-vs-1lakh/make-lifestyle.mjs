// LIFESTYLE board -> the loop close, at 85%. The practical answer.
//
// ⚠️⚠️ READ THIS BEFORE TOUCHING THE LEVELS. An earlier version labelled the
// LIFESTYLES themselves Essential / Good to have / Premium — L1 = "Essential".
// That is backwards and says the opposite of what is true. Chintan caught it.
//
// The site's three levels are a spend scale **INSIDE one lifestyle**, exactly as
// the Styletto lifestyle boards do it (scripts/styletto-ix/make-lifestyle.mjs:
// one board per lifestyle, three level columns within it). For a calm life the
// scale runs Essential ~₹25,000 -> Good to have ~₹50,000 -> Premium. So ₹50,000
// at L1 is "Good to have", i.e. GENEROUS. Calling L1 "Essential" reads as "this
// person is the entry-tier person", which is both wrong and insulting.
//
// THE BOARD IS THAT INSIGHT: the same money sits at a different level depending
// on the life. ₹50,000 is more than enough at L1, a good start at L2, and does
// not qualify at all at L3. Read a row across and you see it.
//
// The mapping is Chintan's, confirmed 2026-07-29 — do not re-derive it:
//   L1  Essential ~₹25,000 · Good to have ₹50,000 · Premium ₹1,00,000
//   L2  Essential ₹50,000  · Good to have ₹1,00,000 · Premium above
//   L3  ₹50,000 is BELOW the scale entirely · Essential ₹1,00,000 · then above
//
// This board also closes the feature loop without restating it: L3's own
// catalogue description says the aid must "switch seamlessly between noisy and
// quiet settings, stream clearly from devices" — the withheld feature, revealed
// back at band50 (26%).
//
// THE HONEST BEAT: at ₹50,000 the recommendation is a Signia, not a Phonak,
// because Phonak's entry has neither rechargeability nor the feature. Naming a
// rival on Synva's own board is the point (established on turn50). Do not soften.
//
// ⚠️ ILLUSTRATIONS ARE SQUARE (360x360). An earlier version forced them into a
// landscape strip with sharp's `fit: "cover"` and cropped every one — the same
// mistake the plugin already made and fixed (CLAUDE.md, "images zoom in on
// import"). Square area, `fit: "inside"`. Never "cover" on a board.
//
// Profiles pulled LIVE from lifestyle_profiles. rule 1b — English only.
// Run: npm run board:phonak-lifestyle
import { boardOut, websiteImage } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { pngDataUri } from "../../lib/brand.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, ltext, wrap, image, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK,
  BLUE, BLUE_LIGHT, BLUE_DARK,
  PURPLE, PURPLE_LIGHT, PURPLE_DARK,
  DISP, UI,
} from "../../lib/tokens.mjs";
import fs from "node:fs";

const OUT = boardOut("phonak-50k-vs-1lakh", "lifestyle.svg");

// The site's own vocabulary and colours (browse.ts PICK_LEVEL_BADGE / _LABEL).
const LEVELS = [
  { key: "essential", label: "Essential", cue: "₹", tint: BLUE_LIGHT, primary: BLUE, dark: BLUE_DARK },
  { key: "good", label: "Good to have", cue: "₹₹", tint: YELLOW_LIGHT, primary: YELLOW, dark: YELLOW_DARK },
  { key: "premium", label: "Premium", cue: "₹₹₹", tint: PURPLE_LIGHT, primary: PURPLE, dark: PURPLE_DARK },
];

// Two devices carry the whole board: one per budget band.
const AT_50K = "HA-140";  // Signia Orion C&G 50
const AT_1L = "HA-315";   // Phonak Audeo I30-R Go

// `inScope` = this video actually covers that money. Anything else is greyed,
// which doubles as an honest statement of what the video does not cover.
const LIFE = {
  L1: {
    illo: "lifestyle-calm-2.webp",
    short: "Quiet days, familiar voices",
    cells: {
      essential: { money: "around ₹25,000", note: "A simpler aid covers this life.", inScope: false },
      good: { money: "₹50,000", model: AT_50K, note: "More than enough here.", inScope: true, best: true },
      premium: { money: "₹1,00,000", note: "More than you need. It buys you almost nothing you will notice.", inScope: true },
    },
  },
  L2: {
    illo: "lifestyle-social-2.webp",
    short: "Calm most days, lively some days",
    cells: {
      essential: { money: "₹50,000", model: AT_50K, note: "A very good start.", inScope: true },
      good: { money: "₹1,00,000", model: AT_1L, note: "More than enough. Worth it if your rooms get loud often.", inScope: true, best: true },
      premium: { money: "above ₹1,00,000", note: "Outside this video.", inScope: false },
    },
  },
  L3: {
    illo: "lifestyle-active-2.webp",
    short: "Meetings, calls, driving, noise",
    // ₹50,000 is BELOW this scale entirely (Chintan, 2026-07-29) — it is not an
    // Essential option that falls short, it does not qualify for this life.
    offScale: true, // rendered as a chip in the column header
    cells: {
      essential: { money: "₹1,00,000", model: AT_1L, note: "The starting point, and a sensible investment.", inScope: true, best: true },
      good: { money: "above ₹1,00,000", note: "Outside this video.", inScope: false },
      premium: { money: "above ₹1,00,000", note: "Outside this video.", inScope: false },
    },
  },
};

const ORDER = ["L1", "L2", "L3"];

const profiles = await rest("lifestyle_profiles?select=id,name,description&order=id");
const byProfile = new Map(profiles.map((p) => [p.id, p]));

const models = await rest(
  `hearing_aid_models?id=in.(${AT_50K},${AT_1L})&select=id,model_name,brand_id`,
);
const brands = await rest("brands?select=id,name");
const brandName = new Map(brands.map((b) => [b.id, b.name]));
const modelById = new Map(models.map((m) => [m.id, m]));
const deviceLabel = (id) => {
  const m = modelById.get(id);
  return m ? `${brandName.get(m.brand_id)} ${m.model_name}` : null;
};

const icon = await loadIcons(["house", "users", "briefcase"]);
const ICON = { L1: "house", L2: "users", L3: "briefcase" };

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const RAILW = 250, COLW = 396;
const gridX = PAD + RAILW;
const W = PAD * 2 + RAILW + ORDER.length * COLW;
const cx = (i) => gridX + i * COLW + COLW / 2;

const T = 232;
const ILLO = 176;         // SQUARE — the source art is 360x360
const HEADH = ILLO + 128; // room for the L3 "not on this scale" chip

// Illustrations: square area, `inside`, never cropped.
const illo = new Map();
for (const k of ORDER) {
  illo.set(
    k,
    await pngDataUri(fs.readFileSync(websiteImage("hearing-aids", LIFE[k].illo)), (s) =>
      s.resize(ILLO * 2, ILLO * 2, { fit: "inside", withoutEnlargement: true }),
    ),
  );
}

// Rows are measured from their own content, never a guessed constant.
const noteLines = {};
for (const lv of LEVELS)
  for (const k of ORDER)
    noteLines[`${k}.${lv.key}`] = wrap(LIFE[k].cells[lv.key].note, COLW - 56, 13.5, 0.55);
// Row height is the tallest CELL, measured — not a formula. A cell with a device
// chip is 26px taller than one without, and ignoring that pushed the second note
// line straight out of the row band and into the row below.
const CHIP_H = 26;
const cellBottom = (k, lv) => {
  const cell = LIFE[k].cells[lv.key];
  const ty = 74 + (cell.model && cell.inScope ? CHIP_H : 0);
  return ty + 12 + noteLines[`${k}.${lv.key}`].length * 18 + 8;
};
const rowH = LEVELS.map((lv) => Math.max(...ORDER.map((k) => cellBottom(k, lv))) + 14);
const rowTop = [];
let acc = T + HEADH;
for (const h of rowH) { rowTop.push(acc); acc += h; }
const cardH = acc - T;
const H = T + cardH + 168 + PAD; // room for the body-choice footnote

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "THE ACTUAL ANSWER";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "The same ₹50,000 means three different things", 44, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 206, "Every life has its own Essential, Good to have and Premium. Read a row across.", 18, UI, 400, MUTED));

// card shell
g.push(`<rect x="${PAD}" y="${T}" width="${W - PAD * 2}" height="${cardH}" rx="22" fill="${WHITE}"/>`);

// level tint bands, drawn first so the grid lines sit on top
LEVELS.forEach((lv, ri) => {
  g.push(`<rect x="${PAD + 1.5}" y="${rowTop[ri]}" width="${W - PAD * 2 - 3}" height="${rowH[ri]}" fill="${lv.tint}"/>`);
});

// ── column headers: who each life is ────────────────────────────────────────
ORDER.forEach((k, i) => {
  const prof = byProfile.get(k), x = gridX + i * COLW;
  g.push(image(illo.get(k), x + (COLW - ILLO) / 2, T + 14, ILLO, ILLO));
  g.push(icon(ICON[k], x + 26, T + ILLO + 26, 20, YELLOW_DARK, 2));
  g.push(ltext(x + 54, T + ILLO + 36, `${prof.id} · ${prof.name}`, 19, DISP, 700, INK));
  g.push(ltext(x + 26, T + ILLO + 64, LIFE[k].short, 13.5, UI, 400, SUBTLE));

  // L3 only: say plainly that ₹50,000 is not on this life's scale. Without this
  // the column just silently starts at ₹1,00,000 and a viewer may not notice.
  if (LIFE[k].offScale) {
    const t = "₹50,000 is not on this scale";
    const cw = t.length * 12.5 * 0.55 + 46;
    g.push(`<rect x="${x + 26}" y="${T + ILLO + 78}" width="${cw}" height="30" rx="15" fill="${WHITE}" stroke="${SUBTLE}" stroke-width="1.5"/>`);
    g.push(`<path d="M ${x + 42} ${T + ILLO + 87} l 10 12 M ${x + 52} ${T + ILLO + 87} l -10 12" stroke="${SUBTLE}" stroke-width="2" stroke-linecap="round"/>`);
    g.push(ltext(x + 60, T + ILLO + 93, t, 12.5, UI, 600, SUBTLE));
  }
});

// the rail's header explains what the rows are
g.push(text(PAD + 28, T + 52, "Every life has", 19, DISP, 600, INK));
g.push(text(PAD + 28, T + 78, "its own scale", 19, DISP, 600, INK));
g.push(text(PAD + 28, T + 112, "The levels below are", 13.5, UI, 400, SUBTLE));
g.push(text(PAD + 28, T + 132, "what that money means", 13.5, UI, 400, SUBTLE));
g.push(text(PAD + 28, T + 152, "for THAT life, not a", 13.5, UI, 400, SUBTLE));
g.push(text(PAD + 28, T + 172, "ranking of the people.", 13.5, UI, 600, YELLOW_DARK));

g.push(`<line x1="${PAD}" y1="${T + HEADH}" x2="${W - PAD}" y2="${T + HEADH}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── the level rows ──────────────────────────────────────────────────────────
LEVELS.forEach((lv, ri) => {
  const top = rowTop[ri], h = rowH[ri];

  // rail: level label + ₹ cue
  g.push(ltext(PAD + 28, top + 40, lv.label, 19, DISP, 700, lv.dark));
  g.push(ltext(PAD + 28, top + 68, lv.cue, 20, DISP, 700, lv.dark));
  g.push(`<rect x="${PAD + 28}" y="${top + 84}" width="40" height="5" rx="2.5" fill="${lv.dark}"/>`);

  ORDER.forEach((k, i) => {
    const cell = LIFE[k].cells[lv.key], x = gridX + i * COLW;
    const dim = !cell.inScope;
    const money = cell.money;

    // the money, biggest thing in the cell
    g.push(htext(cx(i), top + 46, money, dim ? 22 : 30, DISP, 700, dim ? SUBTLE : lv.dark));

    let ty = top + 74;
    if (cell.model && !dim) {
      const label = deviceLabel(cell.model);
      const lwid = label.length * 13 * 0.56 + 30;
      g.push(`<rect x="${cx(i) - lwid / 2}" y="${ty - 15}" width="${lwid}" height="28" rx="14" fill="${WHITE}" stroke="${lv.primary}" stroke-width="1.5"/>`);
      g.push(mtext(cx(i), ty - 1, label, 13, UI, 700, INK));
      ty += CHIP_H;
    }
    noteLines[`${k}.${lv.key}`].forEach((ln, li) =>
      g.push(htext(cx(i), ty + 12 + li * 18, ln, 13.5, UI, dim ? 400 : 500, dim ? SUBTLE : lv.dark)),
    );

    // the recommended cell for this life
    if (cell.best) {
      g.push(`<rect x="${x + 8}" y="${top + 6}" width="${COLW - 16}" height="${h - 12}" rx="16" fill="none" stroke="${lv.dark}" stroke-width="2.5"/>`);
    }
  });

  if (ri < LEVELS.length - 1)
    g.push(`<line x1="${PAD}" y1="${top + h}" x2="${W - PAD}" y2="${top + h}" stroke="${BORDER}" stroke-width="1"/>`);
});

// column separators
for (let i = 0; i <= ORDER.length; i++)
  g.push(`<line x1="${gridX + i * COLW}" y1="${T}" x2="${gridX + i * COLW}" y2="${T + cardH}" stroke="${BORDER}" stroke-width="1"/>`);
g.push(`<rect x="${PAD}" y="${T}" width="${W - PAD * 2}" height="${cardH}" rx="22" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── the close ────────────────────────────────────────────────────────────────
g.push(text(PAD, T + cardH + 52, "₹50,000 is more than enough for one life, a good start for another, and not enough for the third.", 20, DISP, 700, INK));
g.push(text(PAD, T + cardH + 82, "For an Active Professional it is not even on the scale. Buy for the life you actually live, not for the spec sheet.", 16.5, UI, 400, MUTED));

// The named devices are all RIC. Say so, rather than implying the other bodies
// do not exist at these budgets — Naida (BTE) and Virto (custom) both sit in the
// ₹1,00,000 band, and Terra has a BTE at ₹50,000 (Chintan asked, 2026-07-29).
g.push(text(PAD, T + cardH + 116, "Each named device is the behind-the-ear-with-a-wire pick. Need a different body? At ₹1,00,000 the same budget buys", 13.5, UI, 400, SUBTLE));
g.push(text(PAD, T + cardH + 138, "a Naida behind the ear or a Virto inside it; at ₹50,000 Terra has a behind-the-ear too. Which body you need is its own question.", 13.5, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), xlink: true });
