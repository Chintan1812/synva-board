// DELTA board -> "what the extra money actually buys", at 58%.
//
// WHAT THIS BOARD SHOWS: the full ladder Terra -> Terra+ -> Lumity L30 ->
// Infinio I30, framed ADDITIVELY. Each rung says "everything on the left, plus
// these" — never "the cheap one is worse". A viewer who already owns the entry
// device has to stay watching, not feel insulted.
//
// ⚠️ IT STARTS AT TERRA, NOT TERRA+. An earlier version began at Terra+ and
// Chintan caught it: **Terra is the ₹50,000 band device** (₹66,000 MRP a pair).
// Terra+ is ₹84,000 and has already moved above the band (01-research.md line
// 150). Starting the ladder at Terra+ skips the rung the viewer is actually
// standing on. The Terra -> Terra+ step also carries its own honest beat, which
// is that it is MARGINAL — you are buying Bluetooth, not better sound.
//
// THE ARGUMENT, which is Chintan's and no competitor channel makes it, is that
// the ceiling is not what the device does out of the box — it is **how much the
// audiologist can adjust afterwards**. The catalogue says it in Phonak's own
// words: Terra carries "AutoSense OS™ 5.0 (Limited)" and "NoiseBlock (Limited
// settings)". Those two names ARE the argument, so they are on the board verbatim.
//
// ⚠️ THREE DATA TRAPS, all live:
//
// 1. Feature diffs are reliable within the Terra family and Terra+ -> L30, and
//    are pulled live. But the same query reports the LOWER model having features
//    the higher one "lacks" (Auto Acclimatization, QuickSync, SoundRecover...).
//    Those are naming artifacts — Limited variants replaced by full ones, and
//    SoundRecover vs SoundRecover2. **Only ADDITIONS are ever shown.** Never
//    render that diff symmetrically or the board claims a downgrade.
//
// 2. Bluetooth and channel count are COLUMNS, not feature rows, so the Terra ->
//    Terra+ diff misses the biggest change of all (Terra has no Bluetooth). They
//    are read from hearing_aid_models and merged into that rung by hand.
//
// 3. The L30 -> I30 delta must NOT come from the DB. The join falsely claims I30
//    lost myPhonak and SmartSpeech. It comes from Chintan's own ClickUp script
//    "Why Buy Phonak Audeo Infinio Over Lumity | 5 Major Upgrades" (2025-11-18),
//    transcribed in 01-research.md §4b — deliberately, since that framing is
//    already on camera in his words.
//
//    ⚠️ ONE ITEM IN THAT SCRIPT IS WRONG AND IS CORRECTED HERE. Upgrade 4 was
//    "IP68 as standard, was Lumity Life only". **Standard Lumity models are
//    already IP68**, all four tiers; Audeo Life went further (submersion) but was
//    not the only IP68 Lumity. Chintan flagged it 2026-07-29 and the sources
//    agree (hearingtracker.com, soundly.com). The upgrade is now EasyGuard alone,
//    which IS new to Infinio. Do not reinstate the IP68 line.
//
// NOT ON THIS BOARD: Naida and Virto. This ladder is about PLATFORM, which is a
// separate axis from BODY — and the body question is answered by cheezein and
// brand/form-factors. Naida is Lumity-only and Virto is Infinio/P-only, which is
// exactly cheezein's wall; saying it here as well would blunt that beat.
//
// NO IMAGES: a capability ladder, not a shape argument (rule 8).
// rule 1b — English only. Run: npm run board:phonak-delta
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "delta.svg");

const TERRA = "HA-262";      // Terra RIC-312 — the actual ₹50,000 band device
const TERRA_PLUS = "HA-258"; // Terra+ RIC-312 — already above the band
const LUMITY = "HA-275";     // Audeo L30-R
const INFINIO = "HA-315";    // Audeo I30-R Go
const IDS = [TERRA, TERRA_PLUS, LUMITY, INFINIO];

const models = await rest(
  `hearing_aid_models?id=in.(${IDS.join(",")})&select=id,model_name,channels,rechargeable,bluetooth_type_id`,
);
const bt = await rest("bluetooth_types?select=id,name");
const btName = new Map(bt.map((b) => [b.id, b.name]));
const byId = new Map(models.map((m) => [m.id, m]));
const hasBt = (id) => {
  const n = btName.get(byId.get(id)?.bluetooth_type_id);
  return n && !/^none$/i.test(n) ? n : null;
};

const feats = await rest(
  `model_features?model_id=in.(${IDS.join(",")})&select=model_id,feature_library(feature_name)`,
);
const setOf = (id) =>
  new Set(feats.filter((f) => f.model_id === id).map((f) => f.feature_library?.feature_name).filter(Boolean));
const F = Object.fromEntries(IDS.map((id) => [id, setOf(id)]));

/** ADDITIONS ONLY — see trap 1. Never the reverse direction. */
const addsFrom = (lo, hi) => [...F[hi]].filter((f) => !F[lo].has(f)).sort();

// The "(Limited)" names on Terra are the whole argument, quoted from the catalogue.
const limited = [...F[TERRA]].filter((f) => /limited/i.test(f)).sort();
if (!limited.length) {
  throw new Error(
    "delta: expected Terra to carry a '(Limited)' feature name — that name IS the " +
      "board's argument. The catalogue changed; re-check before shipping.",
  );
}

// Trap 2: Bluetooth and channels are columns, so merge them into the Terra+ rung.
const terraPlusAdds = [
  ...(hasBt(TERRA_PLUS) && !hasBt(TERRA) ? [`Bluetooth (${hasBt(TERRA_PLUS)})`] : []),
  ...(byId.get(TERRA_PLUS).channels !== byId.get(TERRA).channels
    ? [`${byId.get(TERRA).channels} to ${byId.get(TERRA_PLUS).channels} channels`]
    : []),
  ...addsFrom(TERRA, TERRA_PLUS),
];

// Trap 3: curated, from Chintan's own comparison video.
const INFINIO_UPGRADES = [
  { n: "1", head: "ERA chip", was: "was PRISM", detail: "Better sound, faster pairing, less battery drain while streaming." },
  { n: "2", head: "AutoSense OS 6.0", was: "was 5.0", detail: "Twice the environments, scans 700 times a second, 24% more accurate." },
  { n: "3", head: "Bluetooth 5.3 dual-mode", was: "was 4.2", detail: "Two devices at once, hands-free calling on Android and iOS." },
  { n: "4", head: "EasyGuard wax management", was: "new", detail: "The dome blocks wax before the receiver. No fiddly wax-guard changes." },
  { n: "5", head: "APD 3.0 fitting formula", was: "was 2.0", detail: "From 8.91 lakh fittings: one fewer follow-up visit on average." },
];

// ── the four rungs ───────────────────────────────────────────────────────────
const RUNGS = [
  {
    id: TERRA,
    kicker: "WHERE ₹50,000 STARTS",
    platform: "Terra platform",
    listHead: "WHERE IT STOPS",
    items: limited.map((f) => ({ text: f })),
    bullet: "dot",
    note: "Those two words are the whole difference. In the fitting software your audiologist cannot change anything beyond basic settings.",
    noteTone: "warn",
  },
  {
    id: TERRA_PLUS,
    kicker: "EVERYTHING LEFT, PLUS",
    platform: "Terra platform",
    listHead: "WHAT IT ADDS",
    items: terraPlusAdds.map((f) => ({ text: f })),
    bullet: "plus",
    note: "Marginal. You are buying Bluetooth here, not better sound. And it has already left the ₹50,000 band.",
    noteTone: "quiet",
  },
  {
    id: LUMITY,
    kicker: "EVERYTHING LEFT, PLUS",
    platform: "Lumity platform",
    listHead: "WHAT IT ADDS",
    items: addsFrom(TERRA_PLUS, LUMITY).map((f) => ({ text: f })),
    bullet: "plus",
    note: "Its only honest limitation: it is the previous platform.",
    noteTone: "quiet",
  },
  {
    id: INFINIO,
    kicker: "EVERYTHING LEFT, PLUS",
    platform: "Infinio platform, the current one",
    listHead: "THE FIVE UPGRADES",
    items: INFINIO_UPGRADES.map((u) => ({ text: u.head, n: u.n, was: u.was, detail: u.detail })),
    bullet: "number",
    note: null,
    anchor: true,
  },
];

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 24;
const COLW = 392;
const W = PAD * 2 + RUNGS.length * COLW + (RUNGS.length - 1) * GAP;
const T = 236;
const HEAD_H = 120;

// measure everything; never guess a card height
RUNGS.forEach((r) => {
  r.lines = r.items.map((it) => wrap(it.text, COLW - 92, 15, 0.55));
  r.detailLines = r.items.map((it) => (it.detail ? wrap(it.detail, COLW - 92, 12.5, 0.55) : []));
  r.itemH = r.items.map((_, i) => r.lines[i].length * 21 + r.detailLines[i].length * 17 + 16);
  r.noteLines = r.note ? wrap(r.note, COLW - 76, 13, 0.55) : [];
  r.listH = r.itemH.reduce((a, b) => a + b, 0);
  r.noteH = r.noteLines.length ? r.noteLines.length * 18 + 32 : 0;
  r.contentH = HEAD_H + 56 + r.listH + (r.noteH ? r.noteH + 22 : 0);
});
const CARDH = Math.max(...RUNGS.map((r) => r.contentH)) + 20;
const CLOSE_T = T + CARDH + 44;
const H = CLOSE_T + 130 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "WHAT THE EXTRA MONEY ACTUALLY BUYS";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "Every step keeps everything below it", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "Nothing here is a downgrade. The question is only how far up you actually need to go.", 18, UI, 400, MUTED));

const colX = (i) => PAD + i * (COLW + GAP);

RUNGS.forEach((r, ri) => {
  const x = colX(ri), m = byId.get(r.id);
  const hot = !!r.anchor;

  g.push(
    `<rect x="${x}" y="${T}" width="${COLW}" height="${CARDH}" rx="22" fill="${hot ? YELLOW_LIGHT : WHITE}" stroke="${hot ? YELLOW : BORDER}" stroke-width="${hot ? 2.5 : 1.5}"/>`,
  );
  g.push(text(x + 26, T + 42, r.kicker, 11, UI, 700, hot ? YELLOW_DARK : SUBTLE));
  g.push(text(x + 26, T + 78, m.model_name, 25, DISP, 700, INK));
  g.push(text(x + 26, T + 102, `${r.platform} · ${m.channels} ch`, 13.5, UI, 400, hot ? YELLOW_DARK : MUTED));
  g.push(`<line x1="${x + 26}" y1="${T + HEAD_H}" x2="${x + COLW - 26}" y2="${T + HEAD_H}" stroke="${hot ? YELLOW : BORDER}" stroke-width="1"/>`);
  g.push(text(x + 26, T + HEAD_H + 34, r.listHead, 11, UI, 700, YELLOW_DARK));

  let y = T + HEAD_H + 62;
  r.items.forEach((it, i) => {
    if (r.bullet === "number") {
      g.push(`<circle cx="${x + 36}" cy="${y - 5}" r="12.5" fill="${YELLOW}"/>`);
      g.push(mtext(x + 36, y - 5, it.n, 12.5, UI, 700, YELLOW_DARK));
    } else if (r.bullet === "plus") {
      g.push(mtext(x + 36, y - 5, "+", 18, DISP, 700, YELLOW_DARK));
    } else {
      g.push(`<circle cx="${x + 36}" cy="${y - 5}" r="4" fill="${SUBTLE}"/>`);
    }
    r.lines[i].forEach((ln, li) => g.push(ltext(x + 56, y - 5 + li * 21, ln, 15, UI, 600, BODY)));
    if (it.was) {
      // width estimate must run wide, not tight — at 0.56 the tag overlapped
      // the longest head ("EasyGuard wax management").
      const w0 = r.lines[i][0].length * 15 * 0.6;
      g.push(ltext(x + 56 + w0 + 14, y - 4, it.was, 11.5, UI, 400, SUBTLE));
    }
    r.detailLines[i].forEach((ln, li) =>
      g.push(ltext(x + 56, y + 15 + r.lines[i].length * 21 - 21 + li * 17, ln, 12.5, UI, 400, hot ? YELLOW_DARK : SUBTLE)),
    );
    y += r.itemH[i];
  });

  if (r.noteLines.length) {
    const nt = T + CARDH - r.noteH - 18;
    g.push(
      `<rect x="${x + 18}" y="${nt}" width="${COLW - 36}" height="${r.noteH}" rx="14" fill="${r.noteTone === "warn" ? YELLOW_LIGHT : PAPER}"/>`,
    );
    r.noteLines.forEach((ln, li) =>
      g.push(ltext(x + 34, nt + 25 + li * 18, ln, 13, UI, 600, r.noteTone === "warn" ? YELLOW_DARK : SUBTLE)),
    );
  }
});

// the + connectors in the gutters
RUNGS.slice(0, -1).forEach((_, i) => {
  const gx = colX(i) + COLW + GAP / 2;
  g.push(`<circle cx="${gx}" cy="${T + 78}" r="17" fill="${YELLOW}"/>`);
  g.push(mtext(gx, T + 78, "+", 20, DISP, 700, YELLOW_DARK));
});

// ── the close ────────────────────────────────────────────────────────────────
g.push(text(PAD, CLOSE_T + 30, "The extra money is not buying you louder, or clearer out of the box.", 22, DISP, 700, INK));
g.push(text(PAD, CLOSE_T + 62, "It is buying headroom: how much your audiologist can shape it for you afterwards, and how well it", 17, UI, 400, MUTED));
g.push(text(PAD, CLOSE_T + 86, "keeps up when the room changes without you touching it.", 17, UI, 400, MUTED));
g.push(text(PAD, CLOSE_T + 118, "This is the platform ladder. Which body you need, behind the ear or in it, is a separate question.", 13, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
