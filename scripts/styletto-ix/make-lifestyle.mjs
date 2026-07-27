// Synva "which Styletto for your lifestyle" INFOGRAPHICS -> one SVG per lifestyle.
//
// Three boards (Quiet & Cozy / Social & Fulfilling / Dynamic & Demanding), each
// mapping the Styletto IX line to the site's three budget levels — Essential
// (blue) / Good to have (yellow) / Premium (purple) with the ₹/₹₹/₹₹₹ cue
// (colours from src/lib/catalog/browse.ts PICK_LEVEL_BADGE). The real lifestyle
// illustration (public/images/hearing-aids/lifestyle-*.webp) is embedded as PNG;
// the plugin (updated) builds a native image fill. Video-thumbnail slots are
// placeholders Chintan drops YouTube thumbs into in Figma.
//
// Board rules: strictly Synva tokens, single font-family, flat fills, real SVG
// centring. Free-size. Model prices shown as the ₹/₹₹/₹₹₹ relative cue, not MRP.
//
// Run: npm run board:lifestyle
import { boardOut, websiteImage } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { logo, pngDataUri } from "../../lib/brand.mjs";
import { text, mtext, wrap, tw, image, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK,
  BLUE, BLUE_LIGHT, BLUE_DARK,
  PURPLE, PURPLE_LIGHT, PURPLE_DARK,
  DISP, UI,
} from "../../lib/tokens.mjs";

// The lifestyle illustrations are read live from the website's public/images.
const illoPath = (file) => websiteImage("hearing-aids", file);

// ── the three budget levels (site vocabulary: browse.ts) ──────────────────────
const LEVEL = {
  essential: { label: "Essential", cue: "₹", tint: BLUE_LIGHT, dark: BLUE_DARK, primary: BLUE },
  good: { label: "Good to have", cue: "₹₹", tint: YELLOW_LIGHT, dark: YELLOW_DARK, primary: YELLOW },
  premium: { label: "Premium", cue: "₹₹₹", tint: PURPLE_LIGHT, dark: PURPLE_DARK, primary: PURPLE },
};

// short "why" per Styletto IX model (curated from the live compare data)
const MODEL = {
  "1IX": "The Styletto starting point",
  "2IX": "Adds Notch tinnitus therapy",
  "3IX": "RealTime Conversation Enhancement",
  "5IX": "SpeechFocus for tough, noisy rooms",
  "7IX": "The flagship, maximum clarity",
};
// a Lucide icon per model's standout feature + its rank in the 5-model line
const MODEL_ICON = { "1IX": "ear", "2IX": "audio-lines", "3IX": "messages-square", "5IX": "focus", "7IX": "sparkles" };
const MODEL_RANK = { "1IX": 1, "2IX": 2, "3IX": 3, "5IX": 4, "7IX": 5 };

// ── content (Chintan's mapping) ───────────────────────────────────────────────
const LIFESTYLES = [
  {
    id: "quiet", file: "synva-lifestyle-quiet-cozy.svg", name: "Quiet & Cozy",
    illo: "lifestyle-calm-2.webp",
    whoFor: "Calm days, mostly at home. One-to-one chats, rarely a crowded, noisy room.",
    cols: [
      { level: "essential", kind: "thumb", budget: "around ₹25,000", note: "A simpler aid covers this life. See the linked video." },
      { level: "good", kind: "thumb", budget: "around ₹50,000", note: "A comfortable step up. See the linked video." },
      { level: "premium", kind: "models", lead: "For a quiet life, the whole Styletto IX line is a premium choice.", models: [{ id: "1IX" }, { id: "2IX" }, { id: "3IX" }, { id: "5IX" }, { id: "7IX" }] },
    ],
  },
  {
    id: "social", file: "synva-lifestyle-social.svg", name: "Social & Fulfilling",
    illo: "lifestyle-social-2.webp",
    whoFor: "Lots of conversations, group settings, eating out, an active social life.",
    cols: [
      { level: "essential", kind: "thumb", budget: "around ₹50,000", note: "The starting pick for this life. See the linked video." },
      { level: "good", kind: "models", models: [{ id: "1IX" }, { id: "2IX", note: "Only worth it if you have tinnitus. Otherwise no real gain over the 1IX." }] },
      { level: "premium", kind: "models", models: [{ id: "3IX" }, { id: "5IX" }, { id: "7IX" }] },
    ],
  },
  {
    id: "dynamic", file: "synva-lifestyle-dynamic.svg", name: "Dynamic & Demanding",
    illo: "lifestyle-active-2.webp",
    whoFor: "Working professionals. Meetings, calls, noisy commutes, fast-paced days.",
    cols: [
      { level: "essential", kind: "models", models: [{ id: "1IX" }] },
      { level: "good", kind: "models", models: [{ id: "3IX" }, { id: "2IX", note: "Moves up to Essential if you have tinnitus." }] },
      { level: "premium", kind: "models", models: [{ id: "5IX" }, { id: "7IX" }] },
    ],
  },
];

// ── icons (Lucide __iconNode -> flat vector <path>) ───────────────────────────
const ICON_NAMES = [...new Set(Object.values(MODEL_ICON))];
const icon = await loadIcons(ICON_NAMES, { stroke: 1.9 });

// ── layout constants ──────────────────────────────────────────────────────────
const PAD = 56, COL_GAP = 26, COL_PAD = 22, COL_W = 388, COLS = 3;
const W = PAD * 2 + COLS * COL_W + (COLS - 1) * COL_GAP;   // 1328
const COL_INNER = COL_W - COL_PAD * 2;                     // 344
const colX = (i) => PAD + i * (COL_W + COL_GAP);
const ILLO = 210, textX = PAD + ILLO + 40;
const colsTop = PAD + ILLO + 46;
const CARD_PAD = 16, CARD_INNER = COL_INNER - CARD_PAD * 2;
const THUMB_H = Math.round(COL_INNER * 9 / 16);            // 194

// ── measure ───────────────────────────────────────────────────────────────────
function measureCol(col) {
  if (col.kind === "thumb") {
    const note = wrap(col.note, COL_INNER, 11.5, 0.53);
    return { ...col, note, contentH: 36 + THUMB_H + 24 + note.length * 15 + 6 };
  }
  const lead = col.lead ? wrap(col.lead, COL_INNER, 12.5, 0.52) : [];
  const TEXT_W = COL_INNER - 82;                 // right of the icon tile
  const cards = col.models.map((m) => {
    const reason = wrap(MODEL[m.id], TEXT_W, 12.5, 0.53);
    const note = m.note ? wrap(m.note, COL_INNER - 48, 11.5, 0.53) : [];
    const rowH = Math.max(46, 20 + reason.length * 18);
    const h = note.length
      ? 14 + rowH + 12 + (10 + note.length * 15 + 10) + 14
      : 14 + rowH + 14;
    return { ...m, reason, note, rowH, h };
  });
  const leadH = lead.length ? lead.length * 18 + 14 : 0;
  const contentH = leadH + cards.reduce((a, c) => a + c.h + 12, 0) - 12;
  return { ...col, lead, cards, contentH };
}

// ── column render ─────────────────────────────────────────────────────────────
function drawColumn(g, col, i, panelH, maxContentH) {
  const L = LEVEL[col.level], x = colX(i), px = x + COL_PAD;
  g.push(`<rect x="${x}" y="${colsTop}" width="${COL_W}" height="${panelH}" rx="24" fill="${L.tint}"/>`);
  // header: level label + ₹ cue + a bold colour accent under the label
  g.push(text(px, colsTop + 40, L.label, 18, DISP, 700, L.dark));
  g.push(text(x + COL_W - COL_PAD, colsTop + 40, L.cue, 17, DISP, 700, L.dark, "end"));
  g.push(`<rect x="${px}" y="${colsTop + 50}" width="44" height="5" rx="2.5" fill="${L.dark}"/>`);
  // content vertically centred in the shared (max) content area, so a short
  // column (one card / a thumbnail) doesn't leave a big empty bottom
  let y = colsTop + 80 + Math.max(0, (maxContentH - col.contentH) / 2);

  if (col.kind === "thumb") {
    g.push(text(px, y + 4, col.budget, 17, DISP, 600, L.dark));
    const ty = y + 24, cxp = x + COL_W / 2, cyp = ty + THUMB_H / 2;
    g.push(`<rect x="${px}" y="${ty}" width="${COL_INNER}" height="${THUMB_H}" rx="16" fill="${WHITE}" stroke="${L.primary}" stroke-width="1.5"/>`);
    g.push(`<circle cx="${cxp}" cy="${cyp - 8}" r="26" fill="${L.primary}"/>`);
    g.push(`<path d="M ${cxp - 7} ${cyp - 8 - 11} L ${cxp + 13} ${cyp - 8} L ${cxp - 7} ${cyp - 8 + 11} Z" fill="${L.dark}"/>`);
    g.push(mtext(cxp, cyp + 32, "Add YouTube thumbnail", 12.5, UI, 600, L.dark));
    let ny = ty + THUMB_H + 24;
    col.note.forEach((ln, k) => g.push(text(px, ny + k * 15, ln, 11.5, UI, 400, MUTED)));
    return;
  }

  col.lead.forEach((ln, k) => g.push(text(px, y + 2 + k * 18, ln, 12.5, UI, 500, L.dark)));
  if (col.lead.length) y += col.lead.length * 18 + 14;
  for (const c of col.cards) {
    g.push(`<rect x="${px}" y="${y}" width="${COL_INNER}" height="${c.h}" rx="16" fill="${WHITE}"/>`);
    // icon tile — the model's standout feature
    g.push(`<rect x="${px + 14}" y="${y + 14}" width="42" height="42" rx="12" fill="${L.tint}"/>`);
    g.push(icon(MODEL_ICON[c.id], px + 24, y + 24, 22, L.dark, 1.9));
    // model name
    g.push(text(px + 68, y + 36, "Styletto " + c.id, 15.5, DISP, 700, INK));
    // tech-level dots — this model's rank in the 5-model Styletto IX line
    const rank = MODEL_RANK[c.id], dg = 11, dx0 = px + COL_INNER - 14 - 4 * dg;
    for (let d = 0; d < 5; d++) g.push(`<circle cx="${dx0 + d * dg}" cy="${y + 31}" r="3.5" fill="${d < rank ? L.dark : BORDER}"/>`);
    // the "why"
    c.reason.forEach((ln, k) => g.push(text(px + 68, y + 56 + k * 18, ln, 12.5, UI, 500, BODY)));
    // conditional (tinnitus) note box
    if (c.note.length) {
      const ny = y + 14 + c.rowH + 12, nbh = 10 + c.note.length * 15 + 10;
      g.push(`<rect x="${px + 14}" y="${ny}" width="${COL_INNER - 28}" height="${nbh}" rx="10" fill="${L.tint}"/>`);
      c.note.forEach((ln, k) => g.push(text(px + 24, ny + 22 + k * 15, ln, 11.5, UI, 600, L.dark)));
    }
    y += c.h + 12;
  }
}

// ── build one board ───────────────────────────────────────────────────────────
function buildBoard(life, illoUri) {
  const cols = life.cols.map(measureCol);
  const maxContentH = Math.max(...cols.map((c) => c.contentH));
  const panelHeight = 104 + maxContentH;
  const H = Math.round(colsTop + panelHeight + PAD);

  const g = [];
  g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`);
  // header
  g.push(image(illoUri, PAD, PAD, ILLO, ILLO));
  g.push(logo(W - PAD, PAD - 4, 46));
  const eyeW = Math.round(tw("Which Styletto IX to buy", 13, 0.56)) + 40;
  g.push(`<rect x="${textX}" y="${PAD + 8}" width="${eyeW}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(textX + eyeW / 2, PAD + 25, "Which Styletto IX to buy", 13, UI, 700, YELLOW_DARK));
  g.push(text(textX, PAD + 96, life.name, 46, DISP, 700, INK));
  g.push(`<rect x="${textX}" y="${PAD + 112}" width="76" height="7" rx="3.5" fill="${YELLOW}"/>`);
  wrap(life.whoFor, 620, 16, 0.52).forEach((ln, k) => g.push(text(textX, PAD + 148 + k * 24, ln, 16, UI, 400, MUTED)));
  // columns
  cols.forEach((col, i) => drawColumn(g, col, i, panelHeight, maxContentH));

  return { W, H, body: g.join("\n") };
}

// ── run ───────────────────────────────────────────────────────────────────────
for (const life of LIFESTYLES) {
  const illoUri = await pngDataUri(illoPath(life.illo));
  const { W, H, body } = buildBoard(life, illoUri);
  writeBoard(boardOut("styletto-ix", life.file), { w: W, h: H, xlink: true, body, log: false });
  console.log(`wrote ${life.file}`);
}
