// SHELF boards -> every Phonak in this video, one board per budget. TWO FILES:
//   shelf-50k.svg   the ₹50,000 shelf
//   shelf-1l.svg    the ₹1,00,000 shelf
//
// WHAT THEY ARE FOR (Chintan, 2026-07-29): a cast list he walks briefly before
// the categories, and points back to while talking through each band. Not an
// argument board — a reference. So every device gets a picture, a body, and its
// MRP, and nothing gets a verdict except the two that carry one.
//
// ⚠️ PLACEMENT IS BY REAL PAIR MRP, NOT BY NAME. This matters for one device:
// **Terra+ RIC-R is ₹1,04,000 a pair**, so it sits on the ₹1,00,000 shelf, next
// to real ₹1,00,000 devices — on the entry Terra platform, with 10 channels,
// beside twelve-channel Infinio. That placement IS the `dontbuy` argument, made
// visible before he even makes it. Do not "tidy" it onto the Terra shelf.
//
// The rest of Terra+ (₹84,000) stays on the ₹50,000 shelf but is visibly the
// upper row, which is the honest picture: it has left the band without arriving
// anywhere.
//
// Renders are the real Phonak ones, black where offered, and SCALED by form
// factor (scaleFor) so a custom does not render bigger than a BTE.
//
// rule 1b — English only. Run: npm run board:phonak-shelf
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { renderDataUri, scaleFor } from "../../lib/phonak-renders.mjs";
import { imageSlot } from "../../lib/imageslot.mjs";
import { text, htext, mtext, ltext, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

// `body` is the plain-language shape; `note` only where a device carries a verdict.
const SHELVES = [
  {
    file: "shelf-50k.svg",
    band: "₹50,000",
    title: "Everything Phonak sells at this money",
    sub: "One platform, two generations, four bodies. Prices are MRP for a pair.",
    groups: [
      {
        name: "TERRA",
        note: "the entry platform · 8 channels · no Bluetooth · disposable battery",
        ids: ["HA-262", "HA-263", "HA-264", "HA-265"],
      },
      {
        name: "TERRA+",
        note: "same platform, 10 channels, and Bluetooth · already above the band",
        ids: ["HA-258", "HA-259", "HA-260", "HA-261"],
      },
    ],
  },
  {
    file: "shelf-1l.svg",
    band: "₹1,00,000",
    title: "Everything Phonak sells at this money",
    sub: "Two platforms, four bodies. Prices are MRP for a pair.",
    groups: [
      {
        name: "THE ODD ONE OUT",
        note: "entry platform, at this money",
        ids: ["HA-257"],
        warn: true,
      },
      {
        name: "LUMITY",
        note: "the previous platform · 12 channels · Universal Bluetooth",
        ids: ["HA-231", "HA-275", "HA-284"],
      },
      {
        name: "INFINIO",
        note: "the current platform · 12 channels · Universal Bluetooth",
        ids: ["HA-301", "HA-314", "HA-271", "HA-315"],
      },
    ],
  },
];

// Plain-language body per model, and the one-line reason where there is one.
const META = {
  "HA-262": { body: "RIC", short: "Terra RIC-312" },
  "HA-263": { body: "BTE, medium power", short: "Terra BTE M" },
  "HA-264": { body: "BTE, super power", short: "Terra BTE SP" },
  "HA-265": { body: "BTE, ultra power", short: "Terra BTE UP" },
  "HA-258": { body: "RIC", short: "Terra+ RIC-312" },
  "HA-259": { body: "BTE, medium power", short: "Terra+ BTE M" },
  "HA-260": { body: "BTE, super power", short: "Terra+ BTE SP" },
  "HA-261": { body: "BTE, ultra power", short: "Terra+ BTE UP" },
  "HA-257": { body: "RIC, rechargeable", short: "Terra+ RIC-R", note: "We talk people out of this one" },
  "HA-231": { body: "Super power BTE", short: "Naida L30-UP" },
  "HA-275": { body: "RIC", short: "Audeo L30-R", note: "The budget Phonak here" },
  "HA-284": { body: "Power BTE, rechargeable", short: "Naida L30-PR" },
  "HA-301": { body: "Custom CIC", short: "Virto I30-10" },
  "HA-314": { body: "Custom ITC, rechargeable", short: "Virto I30-R" },
  "HA-271": { body: "RIC", short: "Audeo I30-R" },
  "HA-315": { body: "RIC, pocket charger", short: "Audeo I30-R Go", note: "Best seller at this money" },
};

const ALL = SHELVES.flatMap((s) => s.groups.flatMap((gr) => gr.ids));
const rows = await rest(
  `hearing_aid_models?id=in.(${ALL.join(",")})&select=id,model_name,mrp,unit,channels,rechargeable`,
);
const byId = new Map(rows.map((r) => [r.id, r]));

// A real Pair row beats mrp*2 — see the skill's pricing rule. Terra+ RIC-R is the
// only one here that has one, and it is exactly the device the placement hinges on.
const pairRows = await rest("hearing_aid_models?unit=eq.Pair&select=model_name,brand_id,mrp");
const pairByName = new Map(pairRows.map((r) => [r.model_name, r.mrp]));
const pairMrp = (m) => pairByName.get(m.model_name) ?? (m.unit === "Pcs" ? m.mrp * 2 : m.mrp);
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// renders, resolved on the CATALOGUE name
const art = new Map();
for (const id of ALL) {
  const name = byId.get(id)?.model_name;
  const r = name ? await renderDataUri(name, { size: 400 }) : null;
  if (!r) console.warn(`shelf: no Phonak render for ${name || id}`);
  art.set(id, r);
}

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const COLS = 4, CARDW = 300, GAP = 20;
const gridW = COLS * CARDW + (COLS - 1) * GAP;
const W = PAD * 2 + gridW;

const SLOT = CARDW - 60;
const CARDH = SLOT + 168;
const GROUP_HEAD = 62, GROUP_GAP = 30;

for (const shelf of SHELVES) {
  const T = 240;
  let y = T;
  shelf.groups.forEach((gr) => {
    gr.top = y;
    gr.rows = Math.ceil(gr.ids.length / COLS);
    y += GROUP_HEAD + gr.rows * CARDH + (gr.rows - 1) * GAP + GROUP_GAP;
  });
  const FOOT_T = y - GROUP_GAP + 30;
  const H = FOOT_T + 26 + PAD;

  const g = [];
  g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

  const kicker = `THE ${shelf.band} SHELF`;
  const kw = kicker.length * 12 * 0.62 + 36;
  g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
  g.push(text(PAD, 158, shelf.title, 44, DISP, 700, INK));
  g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
  g.push(text(PAD, 208, shelf.sub, 17.5, UI, 400, MUTED));

  shelf.groups.forEach((gr) => {
    g.push(text(PAD, gr.top + 34, gr.name, 21, DISP, 700, gr.warn ? INK : INK));
    const nw = gr.name.length * 21 * 0.58 + 18;
    g.push(text(PAD + nw, gr.top + 34, gr.note, 14, UI, 400, SUBTLE));
    if (gr.warn) {
      g.push(`<rect x="${PAD}" y="${gr.top + 44}" width="${gridW}" height="2" rx="1" fill="${YELLOW}"/>`);
    }

    gr.ids.forEach((id, i) => {
      const m = byId.get(id), meta = META[id] || {};
      const col = i % COLS, row = Math.floor(i / COLS);
      const x = PAD + col * (CARDW + GAP);
      const top = gr.top + GROUP_HEAD + row * (CARDH + GAP);
      const hot = !!meta.note;

      g.push(
        `<rect x="${x}" y="${top}" width="${CARDW}" height="${CARDH}" rx="18" fill="${hot ? YELLOW_LIGHT : WHITE}" stroke="${hot ? YELLOW : BORDER}" stroke-width="${hot ? 2.5 : 1.5}"/>`,
      );

      g.push(
        imageSlot({
          x: x + 30,
          y: top + 18,
          size: SLOT,
          uri: art.get(id)?.uri,
          uriScale: scaleFor(art.get(id), { cic: /CIC/i.test(meta.body || "") }),
          tone: hot ? "hot" : "neutral",
        }),
      );

      const by = top + SLOT + 46;
      g.push(text(x + 22, by, meta.short || m.model_name, 21, DISP, 700, INK));
      g.push(text(x + 22, by + 22, meta.body || "", 13, UI, 400, hot ? YELLOW_DARK : MUTED));
      g.push(text(x + 22, by + 58, inr(pairMrp(m)), 22, DISP, 700, INK));
      g.push(text(x + 22 + inr(pairMrp(m)).length * 22 * 0.56 + 10, by + 58, "a pair", 12, UI, 400, SUBTLE));
      if (meta.note) g.push(text(x + 22, by + 82, meta.note, 12.5, UI, 700, YELLOW_DARK));
    });
  });

  g.push(text(PAD, FOOT_T, "Phonak's own renders, in black where the model offers it, sized to approximate real relative scale. MRP, a pair.", 12.5, UI, 400, SUBTLE));

  writeBoard(boardOut("phonak-50k-vs-1lakh", shelf.file), { w: W, h: H, body: g.join("\n"), xlink: true });
}
