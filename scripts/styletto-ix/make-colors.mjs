// Styletto IX COLOUR CARDS -> a board of colour options + version availability.
//
// One card per finish: the real product render (device in that colour) + name +
// a row of version chips (1IX 2IX 3IX 5IX 7IX) with available versions lit. ALL
// data live from Supabase: colours (model_colors -> colors), availability inverted
// to colour->versions, and the per-colour device image (images.color_id, public
// product-images bucket) — the image↔finish match is DB-authoritative, no guessing.
//
// Board rules: strictly Synva tokens (the swatch dot + product render are real
// product data, the sanctioned rule-4 exception). Single font-family, flat fills,
// real SVG centring. The render is embedded PNG (webp -> PNG, trimmed).
//
// Run: npm run board:styletto-colors
import { boardOut } from "../../lib/paths.mjs";
import { rest, storageBuffer } from "../../lib/supabase.mjs";
import { logo, pngDataUri } from "../../lib/brand.mjs";
import { text, mtext, wrap, tw, image, swatchDot, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("styletto-ix", "synva-styletto-colours.svg");

const VAR = { "HA-005": "1IX", "HA-004": "2IX", "HA-003": "3IX", "HA-002": "5IX", "HA-001": "7IX" };
const VERSIONS = ["1IX", "2IX", "3IX", "5IX", "7IX"];

// ── data (live) ───────────────────────────────────────────────────────────────
const ids = Object.keys(VAR).join(",");
// colours + versions (keyed by colour id)
const modelRows = await rest(`hearing_aid_models?id=in.(${ids})&select=id,model_colors(colors(id,name,hex_primary,hex_secondary))`);
const byColour = new Map();
for (const m of modelRows) {
  const ver = VAR[m.id];
  for (const mc of m.model_colors || []) {
    const c = mc.colors; if (!c) continue;
    if (!byColour.has(c.id)) byColour.set(c.id, { id: c.id, name: c.name, p: c.hex_primary || "#ccc", s: c.hex_secondary || c.hex_primary || "#ccc", versions: new Set() });
    byColour.get(c.id).versions.add(ver);
  }
}
// per-colour device image (prefer hero, lowest sort)
const imgRows = await rest(`model_images?model_id=in.(${ids})&select=role,sort_order,images(color_id,bucket,path,kind)`);
const imgByColour = new Map();
for (const r of imgRows) {
  const im = r.images; if (!im || !im.color_id || im.kind === "cosmetic") continue;
  const rank = (r.role === "hero" ? 0 : 1) * 100 + (r.sort_order ?? 50);
  const cur = imgByColour.get(im.color_id);
  if (!cur || rank < cur.rank) imgByColour.set(im.color_id, { ...im, rank });
}
// fetch + trim + PNG-encode each render
async function loadPng(im) {
  const buf = await storageBuffer(im.bucket, im.path);
  if (!buf) return null;
  return pngDataUri(buf, (p) =>
    p.trim({ threshold: 12 }).resize(460, 460, { fit: "inside" }).flatten({ background: "#ffffff" }),
  );
}
for (const c of byColour.values()) {
  const im = imgByColour.get(c.id);
  c.imgUri = im ? await loadPng(im) : null;
}
const colours = [...byColour.values()].sort((a, b) => b.versions.size - a.versions.size || a.name.localeCompare(b.name));

// ── helpers ───────────────────────────────────────────────────────────────────
function chip(x, y, label, on) {
  const w = 46, h = 27;
  const box = on
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${YELLOW_LIGHT}" stroke="${YELLOW}" stroke-width="1.5"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`;
  return box + mtext(x + w / 2, y + h / 2, label, 12, UI, 700, on ? YELLOW_DARK : SUBTLE);
}

// ── layout ────────────────────────────────────────────────────────────────────
const PAD = 52, CARD_W = 320, CARD_H = 322, CARD_GAP = 22, COLS = 4;
const W = PAD * 2 + COLS * CARD_W + (COLS - 1) * CARD_GAP;
const HEAD_H = 224, IMG_H = 176;
const rowsN = Math.ceil(colours.length / COLS);
const H = HEAD_H + rowsN * CARD_H + (rowsN - 1) * CARD_GAP + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`);
// header
const eyeW = Math.round(tw("Styletto IX", 13, 0.56)) + 40;
g.push(`<rect x="${PAD}" y="${PAD}" width="${eyeW}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + eyeW / 2, PAD + 17, "Styletto IX", 13, UI, 700, YELLOW_DARK));
g.push(logo(W - PAD, PAD - 4, 46));
g.push(text(PAD, PAD + 96, "Colour options", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="${PAD + 112}" width="76" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, PAD + 150, "Every finish, and the versions it comes in. Two are on every model; the rest unlock at the 3IX.", 16, UI, 400, MUTED));

// cards
colours.forEach((c, i) => {
  const row = Math.floor(i / COLS), col = i % COLS;
  const inRow = Math.min(COLS, colours.length - row * COLS);
  const offset = (COLS - inRow) * (CARD_W + CARD_GAP) / 2;
  const x = PAD + offset + col * (CARD_W + CARD_GAP), y = HEAD_H + row * (CARD_H + CARD_GAP);
  g.push(`<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="18" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  // product render (the finish)
  if (c.imgUri) g.push(image(c.imgUri, x + 14, y + 12, CARD_W - 28, IMG_H));
  else g.push(mtext(x + CARD_W / 2, y + 12 + IMG_H / 2, "photo coming soon", 13, UI, 500, SUBTLE));
  // swatch dot + name
  g.push(swatchDot(x + 25, y + IMG_H + 34, 8, c.p, c.s));
  const nameLines = wrap(c.name, CARD_W - 58, 16.5, 0.56);
  nameLines.slice(0, 2).forEach((ln, k) => g.push(text(x + 42, y + IMG_H + 39 + k * 22, ln, 16.5, DISP, 700, INK)));
  // availability
  g.push(text(x + 22, y + IMG_H + 86, "Available in", 11, UI, 700, SUBTLE));
  VERSIONS.forEach((v, k) => g.push(chip(x + 22 + k * 55, y + IMG_H + 98, v, c.versions.has(v))));
});

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n"), log: false });
console.log(`wrote ${OUT} (${W}x${H}); ${colours.length} colours (${colours.filter(c => c.imgUri).length} with a render):`);
for (const c of colours) console.log(`   ${c.name}  ${c.imgUri ? "[img]" : "[no img]"}  -> ${[...c.versions].join(",")}`);
