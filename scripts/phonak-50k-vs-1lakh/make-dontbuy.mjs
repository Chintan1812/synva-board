// DON'T BUY board -> the one device in this video we talk people out of, at 78%.
//
// ⚠️ REPOSITIONED 2026-07-29 (Chintan). The earlier version compared Terra+ 312
// against Terra+ RIC-R to show "+₹20,000 for a battery". That is true but it is
// an internal comparison, and it leaves the viewer with no answer. The board now
// starts from what they actually want and routes them somewhere better:
//
//   Terra+ RIC-R, ₹1,04,000 a pair, on the ENTRY platform.
//     Want rechargeable?  -> the whole Orion ladder, 50/75/100/200, all cheaper
//     Want Bluetooth?     -> Sirion Connect 75, cheaper, one compromise: battery
//     Want all of it?     -> push up to Lumity L30 or Infinio I30, a real platform
//
// ⚠️ THE BLUETOOTH ONE IS SIRION, NOT ORION. Chintan said "Orion 75" on the call,
// but the entire Orion C&G line is rechargeable with NO Bluetooth. The device
// that has Bluetooth at that money is Sirion Connect 75 (12 ch, ASHA + MFi, and a
// battery — which matches his own "one compromise of battery"). Verified live.
// Do not swap this back to Orion without re-checking the catalogue.
//
// VISUAL, NOT WORDY (his instruction). The prices carry the argument: the thing
// we say to skip costs MORE than three of the four alternatives. Every number is
// pulled live and every delta is computed, never typed.
//
// Renders: Phonak from the local Target library, Signia from Supabase Storage
// (webp -> PNG, because Figma's createImage rejects webp).
//
// rule 1b — English only. Run: npm run board:phonak-dontbuy
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

const OUT = boardOut("phonak-50k-vs-1lakh", "dontbuy.svg");

const SKIP = "HA-283";                       // Terra+ RIC-R, the Pair row (₹1,04,000)
const ORION = ["HA-140", "HA-139", "HA-138", "HA-137"]; // C&G 50 / 75 / 100 / 200
const SIRION = "HA-141";                     // Sirion Connect 75
const UP = ["HA-275", "HA-271"];             // Audeo L30-R, Audeo I30-R

const ids = [SKIP, ...ORION, SIRION, ...UP];
const rows = await rest(
  `hearing_aid_models?id=in.(${ids.join(",")})&select=id,model_name,mrp,unit,channels,rechargeable`,
);
const byId = new Map(rows.map((r) => [r.id, r]));
const pair = (id) => {
  const m = byId.get(id);
  return m.unit === "Pcs" ? m.mrp * 2 : m.mrp;
};
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const SKIP_PRICE = pair(SKIP);

// Deltas are computed, never typed — they are the whole argument.
const orionLow = Math.min(...ORION.map(pair));
const orionHigh = Math.max(...ORION.map(pair));
const saveMax = SKIP_PRICE - orionLow;
const saveMin = SKIP_PRICE - orionHigh;
const sirionSave = SKIP_PRICE - pair(SIRION);
const upLow = Math.min(...UP.map(pair));

// GUARD — the board's premise is that the skip device costs MORE than the
// alternatives. If a repricing ever breaks that, fail rather than mislead.
if (saveMin <= 0 || sirionSave <= 0) {
  throw new Error(
    `dontbuy: the board claims the Orion/Sirion routes are cheaper than ${inr(SKIP_PRICE)}, ` +
      `but the catalogue now says Orion tops out at ${inr(orionHigh)} and Sirion is ${inr(pair(SIRION))}.`,
  );
}

// ── art ──────────────────────────────────────────────────────────────────────
const phonakArt = async (id) => renderDataUri(byId.get(id).model_name, { size: 420 });
const signiaArt = async (id) => {
  const hero = await rest(`model_images?model_id=eq.${id}&role=eq.hero&select=images(bucket,path)`);
  const im = hero[0]?.images;
  if (!im) return null;
  const buf = await storageBuffer(im.bucket, im.path);
  if (!buf) return null;
  // webp -> PNG: the plugin's createImage will not take webp
  return { uri: await pngDataUri(buf, (s) => s.trim({ threshold: 12 }).resize(420, 420, { fit: "inside" })) };
};

const artSkip = await phonakArt(SKIP);
const artOrion = await signiaArt(ORION[0]);
const artSirion = await signiaArt(SIRION);
const artUp = await phonakArt(UP[1]);

// ── the three routes ─────────────────────────────────────────────────────────
const ROUTES = [
  {
    want: "Rechargeable",
    brand: "SIGNIA",
    name: "Orion C&G",
    chips: ["50", "75", "100", "200"],
    price: `${inr(orionLow)} to ${inr(orionHigh)}`,
    delta: `${inr(saveMin)} to ${inr(saveMax)} less`,
    good: true,
    trade: "No Bluetooth",
    art: artOrion,
    scale: 0.84,
  },
  {
    want: "Bluetooth",
    brand: "SIGNIA",
    name: "Sirion Connect 75",
    chips: [`${byId.get(SIRION).channels} channels`],
    price: inr(pair(SIRION)),
    delta: `${inr(sirionSave)} less`,
    good: true,
    trade: "Battery, not rechargeable",
    art: artSirion,
    scale: 0.84,
  },
  {
    want: "All of it",
    brand: "PHONAK",
    name: "Audeo L30-R or I30-R",
    chips: ["Lumity", "Infinio"],
    price: `from ${inr(upLow)}`,
    delta: "Pay more, move a whole platform",
    good: false,
    trade: "Sound, rechargeable and Bluetooth, together",
    art: artUp,
    scale: 0.84,
    hot: true,
  },
];

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 26;
const CARDW = 412;
const W = PAD * 2 + 3 * CARDW + 2 * GAP;

const T = 250;
const SKIP_H = 208;
const ASK_T = T + SKIP_H + 42;
const CARD_T = ASK_T + 66;
const SLOT = CARDW - 120;

// Card height is MEASURED from the stack below the image — header, chips, price,
// delta, then the trade strip. Guessing it put the strip on top of the price.
//   image bottom -> brand 42 · name +26 · chips +40..66 · price +104 · delta +130
const tradeLines = ROUTES.map((r) => wrap(r.trade, CARDW - 76, 13.5, 0.55));
const maxTrade = Math.max(...tradeLines.map((l) => l.length));
const TRADE_H = maxTrade * 18 + 26;
const CARDH = SLOT + 130 + 150 + 22 + TRADE_H + 20;
const H = CARD_T + CARDH + 76 + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "THE ONE WE TALK YOU OUT OF";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, `${inr(SKIP_PRICE)} for a rechargeable?`, 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "There are three better ways to spend it.", 18, UI, 400, MUTED));

// ── the device we skip ──────────────────────────────────────────────────────
{
  const m = byId.get(SKIP);
  g.push(`<rect x="${PAD}" y="${T}" width="${W - PAD * 2}" height="${SKIP_H}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(imageSlot({ x: PAD + 24, y: T + 24, size: SKIP_H - 48, uri: artSkip?.uri, uriScale: scaleFor(artSkip) }));

  const tx = PAD + 24 + (SKIP_H - 48) + 34;
  g.push(text(tx, T + 62, "PHONAK", 11, UI, 700, SUBTLE));
  g.push(text(tx, T + 100, m.model_name, 32, DISP, 700, INK));
  g.push(text(tx, T + 128, `Rechargeable · Bluetooth · ${m.channels} channels · entry Terra platform`, 15, UI, 400, MUTED));

  // the price, big and on the right — it is the problem
  g.push(text(W - PAD - 34, T + 104, inr(SKIP_PRICE), 44, DISP, 700, INK, "end"));
  g.push(text(W - PAD - 34, T + 132, "a pair, MRP", 14, UI, 400, SUBTLE, "end"));

  const bw = 268;
  g.push(`<rect x="${tx}" y="${T + 150}" width="${bw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
  g.push(mtext(tx + bw / 2, T + 167, "ENTRY PLATFORM, AT THIS MONEY", 11.5, UI, 700, YELLOW_DARK));
}

// ── the question ────────────────────────────────────────────────────────────
g.push(htext(W / 2, ASK_T + 22, "So what do you actually want?", 24, DISP, 700, INK));
g.push(`<path d="M ${W / 2 - 11} ${ASK_T + 38} L ${W / 2} ${ASK_T + 50} L ${W / 2 + 11} ${ASK_T + 38}" fill="none" stroke="${YELLOW}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);

// ── the three routes ────────────────────────────────────────────────────────
ROUTES.forEach((r, i) => {
  const x = PAD + i * (CARDW + GAP);
  g.push(
    `<rect x="${x}" y="${CARD_T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${r.hot ? YELLOW_LIGHT : WHITE}" stroke="${r.hot ? YELLOW : BORDER}" stroke-width="${r.hot ? 2.5 : 1.5}"/>`,
  );

  // what you want — the header, biggest label on the card
  g.push(htext(x + CARDW / 2, CARD_T + 50, r.want.toUpperCase(), 20, DISP, 700, r.hot ? YELLOW_DARK : INK));
  g.push(`<line x1="${x + 34}" y1="${CARD_T + 70}" x2="${x + CARDW - 34}" y2="${CARD_T + 70}" stroke="${r.hot ? YELLOW : BORDER}" stroke-width="1"/>`);

  g.push(imageSlot({ x: x + (CARDW - SLOT) / 2, y: CARD_T + 88, size: SLOT, uri: r.art?.uri, uriScale: r.scale, tone: r.hot ? "hot" : "neutral" }));

  let ty = CARD_T + 88 + SLOT + 42;
  g.push(htext(x + CARDW / 2, ty, r.brand, 10.5, UI, 700, SUBTLE));
  g.push(htext(x + CARDW / 2, ty + 26, r.name, 21, DISP, 700, INK));

  // tier chips
  const cw = 52, cg = 8;
  const totalW = r.chips.length * cw + (r.chips.length - 1) * cg;
  let cxp = x + CARDW / 2 - totalW / 2;
  r.chips.forEach((c) => {
    const w = Math.max(cw, c.length * 12 * 0.6 + 22);
    g.push(`<rect x="${cxp}" y="${ty + 40}" width="${w}" height="26" rx="13" fill="none" stroke="${r.hot ? YELLOW : BORDER}" stroke-width="1.5"/>`);
    g.push(mtext(cxp + w / 2, ty + 53, c, 12, UI, 700, r.hot ? YELLOW_DARK : SUBTLE));
    cxp += w + cg;
  });

  // the number that makes the argument
  g.push(htext(x + CARDW / 2, ty + 104, r.price, 24, DISP, 700, INK));
  g.push(htext(x + CARDW / 2, ty + 130, r.delta, 14.5, UI, 700, r.good ? YELLOW_DARK : SUBTLE));

  // the one honest trade, in a strip so it cannot be missed
  const tl = tradeLines[i];
  const tt = CARD_T + CARDH - TRADE_H - 20;
  g.push(`<rect x="${x + 24}" y="${tt}" width="${CARDW - 48}" height="${TRADE_H}" rx="12" fill="${r.hot ? WHITE : PAPER}"/>`);
  tl.forEach((ln, li) =>
    g.push(htext(x + CARDW / 2, tt + 22 + li * 18, ln, 13.5, UI, 600, r.hot ? YELLOW_DARK : SUBTLE)),
  );
});

g.push(text(PAD, CARD_T + CARDH + 48, "Three of these four cost less than the one we are telling you to skip. MRP, a pair.", 15, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
