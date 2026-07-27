// Styletto IX FULL feature comparison -> website-styled SVG.
//
// Follows the figma-board-svg skill:
//  - Consumer HEADLINE specs first (frozen with Chintan): Price, Channels,
//    Clarity in noise, Auto-adaptation, Warranty. These are what a buyer cares
//    about most and what differs across the line, so they sit at the top.
//  - COMMON traits (identical on all five) stated ONCE in a highlighted band
//    (rechargeable, Bluetooth to iPhone + Android, slim RIC, fitting range,
//    app + remote care) instead of repeating them per model.
//  - Then EVERY feature, grouped by category, nothing hidden (no "+N more").
//  - PERFORMANCE LEVEL (1-5) is shown, not just presence: a feature can be
//    present at different levels on different tiers (e.g. RealTime Conversation
//    Enhancement, SoundSmoothing), and that is the whole point of the compare.
//  - Real Signia catalogue names (feature_library.feature_name), pulled LIVE.
//  - Editable <text> (single Figma fonts), vector icons, flat fills only.
//
// Domain corrections from Chintan (audiologist) that override the DB:
//  - Loss range is "Mild to Severe", NOT the DB's "Mild to Profound". Styletto
//    only takes S/M/P receivers; HP is not compatible, so no Profound.
//  - Receivers: S / M / P.
//  - Direct-streaming feature rows (FT-068/069) are EXCLUDED from the matrix on
//    purpose: streaming is covered by the "Bluetooth to iPhone + Android" line
//    in the common band, so listing it again as features is redundant.
//
// Data pulled live 2026-07-21.
// Run: npm run board:styletto-features
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("styletto-ix", "styletto-ix-comparison.svg");

// Chintan's corrections (override DB):
const LOSS = "Mild to Severe";
const RECEIVERS = "S · M · P";
const EXCLUDE_FEATS = new Set(["FT-068", "FT-069"]); // direct streaming -> covered by Bluetooth line

const ORDER = ["HA-005", "HA-004", "HA-003", "HA-002", "HA-001"];
const VAR = { "HA-005": "1IX", "HA-004": "2IX", "HA-003": "3IX", "HA-002": "5IX", "HA-001": "7IX" };
const CAT_ORDER = ["Conversation Management", "Noise Management", "Listening Comfort", "Tinnitus", "Connectivity", "Wearer Empowerment", "Fitting Tools"];
const CAT_ICON = {
  "Conversation Management": "message-square", "Noise Management": "audio-lines",
  "Listening Comfort": "smile", "Tinnitus": "ear", "Connectivity": "bluetooth",
  "Wearer Empowerment": "activity", "Fitting Tools": "wrench",
};

// Token roles on this board. The product-finish swatches are the sole non-token
// colour, and they are legitimate: those are the devices' real finish colours,
// i.e. product data, not palette choices.
const CATBG = BORDER, FLAG = PAPER, HEADBG = YELLOW_LIGHT, COMMONBG = PAPER;

// ── fetch (live) ─────────────────────────────────────────────────────────────
const inList = `in.(${ORDER.join(",")})`;
const [models, mf, mc] = await Promise.all([
  rest(`hearing_aid_models?id=${inList}&select=id,mrp,channels,warranty_years,rechargeable,perf_speech_noise,perf_auto_adapt`),
  rest(`model_features?model_id=${inList}&select=model_id,feature_id,performance_score`),
  rest(`model_colors?model_id=${inList}&select=model_id,color_id`),
]);
const featIds = [...new Set(mf.map((r) => r.feature_id))].filter((id) => !EXCLUDE_FEATS.has(id));
const colorIds = [...new Set(mc.map((r) => r.color_id))];
const [fl, colorsRows] = await Promise.all([
  rest(`feature_library?id=in.(${featIds.join(",")})&select=id,feature_name,feature_category,icon_id`),
  rest(`colors?id=in.(${colorIds.join(",")})&select=id,name,hex_primary,hex_secondary,sort_order`),
]);

const byId = new Map(models.map((m) => [m.id, m]));
const featById = new Map(fl.map((f) => [f.id, f]));
const colorById = new Map(colorsRows.map((c) => [c.id, c]));

// per-model colour list (sorted)
const modelColors = {};
for (const r of mc) (modelColors[r.model_id] ??= []).push(colorById.get(r.color_id));
for (const m in modelColors) modelColors[m].sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name));

// per-feature per-model cell: {present, score|null}
const cell = {};
for (const r of mf) {
  if (EXCLUDE_FEATS.has(r.feature_id)) continue;
  (cell[r.feature_id] ??= {})[r.model_id] = { present: true, score: r.performance_score != null ? Number(r.performance_score) : null };
}

// group by category; mark rows that vary across the line; sort varies-first
const cellKey = (c) => (c.present ? (c.score == null ? "y" : "s" + c.score) : "-");
const cats = {};
for (const fid of featIds) {
  const f = featById.get(fid);
  if (!f) continue;
  const cells = ORDER.map((m) => cell[fid]?.[m] || { present: false, score: null });
  const varies = new Set(cells.map(cellKey)).size > 1;
  const presentCount = cells.filter((c) => c.present).length;
  (cats[f.feature_category] ??= []).push({ name: f.feature_name, cells, varies, presentCount });
}
for (const c in cats) cats[c].sort((a, b) => (b.varies - a.varies) || (b.presentCount - a.presentCount) || a.name.localeCompare(b.name));
const catList = [...CAT_ORDER.filter((c) => cats[c]), ...Object.keys(cats).filter((c) => !CAT_ORDER.includes(c))];
const totalFeatures = Object.values(cats).reduce((a, r) => a + r.length, 0);

// ── icons ───────────────────────────────────────────────────────────────────
const ICON_NAMES = [...new Set(catList.map((c) => CAT_ICON[c]).filter(Boolean))];
const icon = await loadIcons(ICON_NAMES);

// ── helpers ─────────────────────────────────────────────────────────────────
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// cell glyphs: number disc (Synva yellow, digit shows the level) / check (yellow-light) / dash
const disc = (cx, cy, score) =>
  `<circle cx="${cx}" cy="${cy}" r="11" fill="${YELLOW}"/>` + mtext(cx, cy, String(score), 13, UI, 700, YELLOW_DARK);
const check = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="9" fill="${YELLOW_LIGHT}"/>` +
  `<path d="M ${cx - 3.6} ${cy + 0.4} L ${cx - 1} ${cy + 3.2} L ${cx + 4} ${cy - 3.2}" fill="none" stroke="${YELLOW_DARK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
const dash = (cx, cy) => `<line x1="${cx - 6}" y1="${cy}" x2="${cx + 6}" y2="${cy}" stroke="${SUBTLE}" stroke-width="2" stroke-linecap="round"/>`;
const cellGlyph = (cx, cy, c) => (!c.present ? dash(cx, cy) : c.score != null ? disc(cx, cy, c.score) : check(cx, cy));

// two-tone colour swatch = two flat half-disc paths (no gradient), + ring
function swatch(cx, cy, r, c) {
  let s = "";
  if (c.hex_secondary) {
    s += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z" fill="${c.hex_primary}"/>`;
    s += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="${c.hex_secondary}"/>`;
  } else {
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.hex_primary}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${BORDER}" stroke-width="1"/>`;
  return s;
}

// ── layout ──────────────────────────────────────────────────────────────────
const PAD = 56, FNAME = 388, MCOL = 156, CPAD = 18;
const cardX = PAD, cardW = FNAME + 5 * MCOL, gridX = cardX + FNAME;
const rail = cardX + CPAD;
const mcx = (i) => gridX + i * MCOL + MCOL / 2;      // model column centre
const colL = (i) => gridX + i * MCOL + 16;            // model column left inset
const W = PAD * 2 + cardW;
const matrixTop = 196;

const MODELH = 178;
const HEADLINEH = 36 + 4 * 34;      // section label + 4 headline rows
const CATH = 40, ROWH = 30;

// common-band chips (laid out first so we know how tall the band is)
const CHIPS = [
  "Rechargeable Li-ion", "Portable charging case", "Bluetooth to iPhone + Android",
  "Hands-free calls", "Slim RIC form", `Fits ${LOSS} · ${RECEIVERS} receivers`, "Signia app + remote care",
];
const maxX = cardX + cardW - CPAD;
const chipLay = [];
{
  let px = rail, row = 0;
  for (const ch of CHIPS) {
    const w = Math.round(ch.length * 6.7) + 28;
    if (px + w > maxX && px > rail) { row++; px = rail; }
    chipLay.push({ ch, w, row, x: px });
    px += w + 8;
  }
}
const chipRows = Math.max(...chipLay.map((c) => c.row)) + 1;
const COMMONH = 44 + chipRows * 34 + 6;

const matrixSum = catList.reduce((a, c) => a + CATH + cats[c].length * ROWH, 0);
const cardH = MODELH + HEADLINEH + COMMONH + matrixSum;
const H = matrixTop + cardH + PAD;

// key y-origins (relative to card top = matrixTop)
const T = matrixTop;
const HB0 = T + MODELH;                 // headline band top
const CM0 = HB0 + HEADLINEH;            // common band top
const MX0 = CM0 + COMMONH;              // matrix top

// ── build ───────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

// title
g.push(text(PAD, 66, "Which Styletto IX should you buy?", 40, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="80" width="64" height="6" rx="3" fill="${YELLOW}"/>`);
g.push(text(PAD, 118, `The five models side by side. What matters most first, then all ${totalFeatures} features, graded 1 to 5. Nothing hidden.`, 18, UI, 400, MUTED));

// legend
let lx = PAD;
const legend = (drawGlyph, label) => {
  g.push(drawGlyph(lx + 11, 158));
  g.push(text(lx + 28, 163, label, 12.5, UI, 500, BODY));
  lx += 34 + Math.round(label.length * 6.7) + 26;
};
legend((x, y) => disc(x, y, 3), "1 to 5 performance level, higher is better");
legend((x, y) => check(x, y), "Included");
legend((x, y) => dash(x, y), "Not available");

// card fill
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="${WHITE}"/>`);
// flagship (7IX) column tint, full height
g.push(`<rect x="${gridX + 4 * MCOL}" y="${T + 1.5}" width="${MCOL}" height="${cardH - 3}" fill="${FLAG}"/>`);
// highlighted bands
g.push(`<rect x="${cardX + 1.5}" y="${HB0 + 34}" width="${cardW - 3}" height="${HEADLINEH - 34}" fill="${HEADBG}"/>`);
g.push(`<rect x="${cardX + 1.5}" y="${CM0}" width="${cardW - 3}" height="${COMMONH}" fill="${COMMONBG}"/>`);
// vertical separators
for (let i = 0; i <= 5; i++) g.push(`<line x1="${gridX + i * MCOL}" y1="${T}" x2="${gridX + i * MCOL}" y2="${T + cardH}" stroke="${BORDER}" stroke-width="1"/>`);

// ── model header zone ──
g.push(text(rail, T + 56, "The Styletto IX line", 15, DISP, 600, INK));
g.push(text(rail, T + 76, "Signia flagship, slim RIC", 12, UI, 400, SUBTLE));
g.push(text(rail, T + 94, "Price (MRP)", 12, UI, 600, BODY));
g.push(text(rail, T + 138, "Colours", 11, UI, 700, SUBTLE));
ORDER.forEach((id, i) => {
  const m = byId.get(id), x = colL(i);
  g.push(text(x, T + 28, "STYLETTO", 10, UI, 700, SUBTLE));
  g.push(text(x, T + 60, VAR[id], 26, DISP, 700, INK));
  g.push(`<rect x="${x}" y="${T + 68}" width="30" height="5" rx="2.5" fill="${YELLOW}"/>`);
  g.push(text(x, T + 96, m.mrp != null ? inr(m.mrp) : "On request", 17, DISP, 600, INK));
  g.push(text(x, T + 110, "MRP", 10, UI, 500, SUBTLE));
  const cols = modelColors[id] || [];
  cols.forEach((c, k) => g.push(swatch(x + 7 + k * 15, T + 134, 6, c)));
  g.push(text(x, T + 158, `${cols.length} finishes`, 10, UI, 500, SUBTLE));
});
g.push(`<line x1="${cardX}" y1="${HB0}" x2="${cardX + cardW}" y2="${HB0}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── headline differentiators band ──
g.push(`<rect x="${rail}" y="${HB0 + 12}" width="4" height="16" rx="2" fill="${YELLOW}"/>`);
g.push(text(rail + 14, HB0 + 25, "What changes as you go up the line", 13.5, DISP, 700, INK));
const HEAD_ROWS = [
  { label: "Channels", sub: "sound processing detail", kind: "num", get: (m) => m.channels },
  { label: "Clarity in noise", sub: "following speech in loud places", kind: "score", get: (m) => m.perf_speech_noise },
  { label: "Auto-adaptation", sub: "adjusts as you move around", kind: "score", get: (m) => m.perf_auto_adapt },
  { label: "Warranty", sub: "years covered by Synva", kind: "warranty", get: (m) => m.warranty_years },
];
HEAD_ROWS.forEach((r, ri) => {
  const cy = HB0 + 36 + ri * 34 + 17;
  g.push(text(rail, cy - 2, r.label, 13.5, UI, 600, INK));
  g.push(text(rail, cy + 13, r.sub, 11, UI, 400, SUBTLE));
  ORDER.forEach((id, i) => {
    const v = r.get(byId.get(id));
    if (r.kind === "num") g.push(htext(mcx(i), cy + 6, v != null ? String(v) : "—", 17, DISP, 700, INK));
    else if (r.kind === "score") g.push(v != null ? disc(mcx(i), cy, Number(v)) : dash(mcx(i), cy));
    else g.push(htext(mcx(i), cy + 5, (v ?? "—") + " yr", 13.5, UI, 600, Number(v) >= 4 ? YELLOW_DARK : BODY));
  });
  if (ri < HEAD_ROWS.length - 1) g.push(`<line x1="${cardX}" y1="${HB0 + 36 + (ri + 1) * 34}" x2="${cardX + cardW}" y2="${HB0 + 36 + (ri + 1) * 34}" stroke="${BORDER}" stroke-width="1"/>`);
});
g.push(`<line x1="${cardX}" y1="${CM0}" x2="${cardX + cardW}" y2="${CM0}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── common band ──
g.push(text(rail, CM0 + 26, "On every Styletto IX", 13.5, DISP, 700, INK));
g.push(text(rail + 172, CM0 + 26, "identical across all five, so shown once", 12, UI, 400, SUBTLE));
for (const c of chipLay) {
  const y = CM0 + 42 + c.row * 34;
  g.push(`<rect x="${c.x}" y="${y}" width="${c.w}" height="26" rx="13" fill="${WHITE}" stroke="${BORDER}" stroke-width="1"/>`);
  g.push(text(c.x + 14, y + 17, c.ch, 12.5, UI, 500, BODY));
}
g.push(`<line x1="${cardX}" y1="${MX0}" x2="${cardX + cardW}" y2="${MX0}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── category matrix ──
let y = MX0;
for (const cat of catList) {
  g.push(`<rect x="${cardX + 1.5}" y="${y}" width="${cardW - 3}" height="${CATH}" fill="${CATBG}"/>`);
  g.push(icon(CAT_ICON[cat], rail, y + CATH / 2 - 9, 18, INK));
  g.push(text(rail + 26, y + CATH / 2 + 5, cat, 14, DISP, 600, INK));
  g.push(text(rail + 26 + Math.round(cat.length * 8.4) + 12, y + CATH / 2 + 4, `${cats[cat].length}`, 12, UI, 600, SUBTLE));
  y += CATH;
  for (const f of cats[cat]) {
    g.push(text(rail, y + ROWH / 2 + 4.5, f.name, 14, UI, 500, INK));
    f.cells.forEach((c, i) => g.push(cellGlyph(mcx(i), y + ROWH / 2, c)));
    y += ROWH;
    g.push(`<line x1="${cardX}" y1="${y}" x2="${cardX + cardW}" y2="${y}" stroke="${BORDER}" stroke-width="1"/>`);
  }
}

// crisp card border on top
g.push(`<rect x="${cardX}" y="${T}" width="${cardW}" height="${cardH}" rx="22" fill="none" stroke="${BORDER}" stroke-width="1.5"/>`);

writeBoard(OUT, { w: W, h: H, body: g.join("\n"), log: false });
console.log(`wrote ${OUT} (${W}x${H}); ${totalFeatures} features in ${catList.length} categories; ${chipRows} chip rows`);
