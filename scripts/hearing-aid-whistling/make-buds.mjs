// BUDS board -> the RIC dome / click-sleeve reference for the whistling video.
//
// WHAT THIS BOARD SHOWS, top to bottom:
//   1. WHERE the bud sits, on two real Signia RIC devices, so a viewer who has
//      never named this part can find it on their own hearing aid.
//   2. THE LADDER: Phonak's four domes, real renders, ordered by how much sound
//      is allowed to escape.
//   3. What Signia calls the same part, with the only published vent figures.
//   4. The reversal this beat exists for: your audiologist already chose yours.
//
// It lands at ~65% of "Your Ear Machine Keeps Whistling?" and is the ONLY board
// in that video (Chintan, 2026-08-13).
//
// ── IMAGE SOURCES, both real, both local ─────────────────────────────────────
// PHONAK DOMES: the RAW Target 11.2.3 extraction, `phonak_images/_work/renders/`
// (2,783 files), under `ff0` with type codes in the 800s — the acoustic-coupling
// family. They are NOT in the deduplicated 481-render library, which keeps only
// device form factors; that is why a first pass wrongly reported none existed.
//
// SIGNIA DEVICES: Chintan's own Connexx 2026 image set on OneDrive. Two RIC
// renders, each shot with a different sleeve already fitted, which is exactly the
// "where is this part" picture the Phonak dome renders cannot give.
//
// ── THE MAPPING, AND WHY THIS ONE ────────────────────────────────────────────
// The type codes carry NO names — `ProductCatalog.Resources.Blobs` stores
// BlobType as a bare integer with no lookup table anywhere in the export. So the
// four were chosen by eye, against Phonak's published dome descriptions, from the
// candidates Chintan shortlisted. He confirmed 845 = Open, which anchors the set.
//
//   845  flat and wide, openings all round the rim   -> OPEN
//   802  bell with large openings around the base    -> VENTED
//   844  smooth bell, no openings visible            -> CLOSED
//   846  double flange, sealed, largest              -> POWER
//
// Two alternatives Chintan offered were rejected **because the picture would
// contradict the word**, which is the one thing this board cannot afford:
//   • 844 as "vented" — 844 shows no openings at all.
//   • 846 as "fully open" — 846 is the sealed double-flange dome.
// 801/802/803 is a coherent family too, but 801 has visible side slots, so it
// does not read as "closed" next to a genuinely smooth one.
// The chosen set is the only one where every step visibly loses openings.
//
// SIZES ARE NORMALISED ON PURPOSE. Phonak shoots each render at its own zoom (the
// `uriScale` lesson in CLAUDE.md rule 8), so relative size across these files is
// not trustworthy. Every dome is trimmed and fitted to the same square, and the
// board never claims one is physically bigger than another. The openings carry
// the argument.
//
// ── NO BRAND NAMES ON THE BOARD (Chintan, 2026-08-13) ────────────────────────
// The renders stay exactly as sourced, but nothing on the face says Phonak,
// Signia, Target or Connexx. The board teaches the four types generically, which
// is what the viewer needs, and it keeps the asset usable whichever device is in
// shot. The provenance lives in this header for reproducibility only.
// The Signia click-sleeve strip went with it: its mm figures were a Signia
// product spec, so printing them unattributed beside representative shapes would
// state a specific vendor number as a general fact.
//
// Vent figures, kept here for reference only, no longer printed:
//   https://japebo.com/signia-click-sleeve-closed/
//   https://hearwellservices.com/hearing-aid-accessories/domes/phonak/open-closed-power/
//
// Board rules (see .claude/skills/figma-board-svg/SKILL.md, it is authoritative):
//   • strictly Synva tokens — the only non-token colour allowed is real product data
//   • one font-family per <text>, never a fallback stack
//   • flat fills only: no gradients, no filters
//   • real SVG centring (mtext / htext), never a hand-tuned x offset
//   • English copy only, never Hindi (rule 1b) — Chintan speaks Hindi over it
//   • any <image> means writeBoard needs xlink: true
//
// Run: npm run board:hearing-aid-whistling-buds
import { boardOut, phonakFile } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { logo, pngDataUri } from "../../lib/brand.mjs";
import { boardHeader } from "../../lib/callout.mjs";
import { text, htext, mtext, ltext, wrap, tw, image, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("hearing-aid-whistling", "buds.svg");

const CONNEXX =
  "/Users/chintanbhayani/Library/CloudStorage/OneDrive-Personal/WORK/Bhayani Healthcare/" +
  "Synva/Marketing/Synva Social Media/03_Global Assets/Hearing Aid Assets/Signia/" +
  "Signia Images/2026_Hearing Aid Images (Connexx)";

// ── CONTENT ───────────────────────────────────────────────────────────────────
const HEADER = {
  kicker: "RIC · THE PART THAT SITS IN YOUR EAR",
  title: "The bud is not a comfort choice",
  sub: "It is an acoustic prescription. Every opening you see is deliberate.",
};

const DEVICES = {
  heading: "First, find it on your own hearing aid",
  note: "The bud is the soft tip at the end of the wire. It is the only part that touches your ear canal.",
  shots: [
    { file: "D12Plus_RIC_Li_T_M_N.png", cap: "Fitted with an open bud" },
    { file: "D12Plus_RIC_Li_T_P_N.png", cap: "Fitted with a closed bud" },
  ],
};

const RAIL = { left: "MORE AIRFLOW", right: "MORE SEAL" };

const LADDER = {
  heading: "The four types",
  sub: "named for how much sound they let out",
  buds: [
    { name: "Open",   render: "t845", vents: "Openings all round",   note: "Most airflow. Your own voice stays natural." },
    { name: "Vented", render: "t802", vents: "Openings at the base", note: "The middle ground. Some sound escapes on purpose." },
    { name: "Closed", render: "t844", vents: "No openings",          note: "Holds more amplification in the ear." },
    { name: "Power",  render: "t846", vents: "Sealed, double flange", note: "Fully sealed. For the highest power fittings." },
  ],
};

// Reference only, deliberately NOT printed: the vented click sleeve is an
// equivalent vent of over 4 mm, the closed one 1.6 mm. Those are one vendor's
// published figures, so they cannot sit unattributed next to representative
// shapes as if they were general.

const WARNING = {
  title: "Your audiologist already chose yours",
  rows: [
    { icon: "hand",           text: "Do not swap your bud to stop a whistle.",
      note: "It was matched to your hearing loss, not to your comfort." },
    { icon: "wind",           text: "On a sloping loss the vent is the point.",
      note: "The opening is what lets you keep natural sound. It cannot be sealed." },
    { icon: "triangle-alert", text: "Seal a vented bud and your own voice booms.",
      note: "That is occlusion. You traded one problem for a worse one." },
  ],
  foot: "If a correct re-fit does not stop it, the answer is a Critical Gain Measurement. It takes 10 seconds.",
};

// Blob-type -> raw render filename in the Target extraction.
const RENDER_FILES = {
  t845: "id98_type845_ff0_bte0_fp0_shell0_side-1_x.png",
  t802: "id83_type802_ff0_bte0_fp0_shell0_side-1_x.png",
  t844: "id97_type844_ff0_bte0_fp0_shell0_side-1_x.png",
  t846: "id99_type846_ff0_bte0_fp0_shell0_side-1_x.png",
};
// ──────────────────────────────────────────────────────────────────────────────

const icon = await loadIcons(["hand", "wind", "triangle-alert"]);

/**
 * Trim to content, then fit a fixed box — normalises each render's own zoom.
 * `h` defaults to `w` (a square, right for the domes); a RIC is tall and thin, so
 * it gets a portrait box instead of floating in a square of white.
 */
const fitted = (file, w, h = w) =>
  pngDataUri(file, (p) =>
    p
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 24 })
      .resize(w, h, { fit: "contain", background: "#ffffff" }),
  );

// ── layout ────────────────────────────────────────────────────────────────────
const PAD = 56;
const W = 1400;
const INNER = W - PAD * 2;
const PANEL_PAD = 24;
const RAIL_H = 46;
const WARN_ROW_H = 74;

const g = [];
const head = boardHeader({ ...HEADER, inner: INNER });
let y = head.contentT + 10;

// ── 1. where the bud sits, on a real device ───────────────────────────────────
const DEV_W = 208, DEV_IMG = 272;
const DEV_H = PANEL_PAD * 2 + 34 + DEV_IMG + 36;
g.push(`<rect x="${PAD}" y="${y}" width="${INNER}" height="${DEV_H}" rx="22" fill="${WHITE}" stroke="${BORDER}"/>`);
g.push(ltext(PAD + PANEL_PAD, y + PANEL_PAD + 12, DEVICES.heading, 21, DISP, 700, INK));

for (let i = 0; i < DEVICES.shots.length; i++) {
  const sh = DEVICES.shots[i];
  const cx = PAD + PANEL_PAD + 122 + i * 286;
  const it = y + PANEL_PAD + 34;
  g.push(image(await fitted(`${CONNEXX}/${sh.file}`, DEV_W * 2, DEV_IMG * 2), cx - DEV_W / 2, it, DEV_W, DEV_IMG));
  g.push(htext(cx, it + DEV_IMG + 26, sh.cap, 15, UI, 600, MUTED));
}
// the explanatory line sits to the right of the two shots, vertically centred
const noteX = PAD + PANEL_PAD + 600;
wrap(DEVICES.note, INNER - PANEL_PAD - 600 - 30, 20, 0.55).forEach((ln, li) =>
  g.push(ltext(noteX, y + DEV_H / 2 - 14 + li * 29, ln, 20, UI, 400, BODY)),
);
y += DEV_H + 20;

// ── 2. airflow-to-seal rail ───────────────────────────────────────────────────
const railY = y + RAIL_H / 2;
g.push(`<rect x="${PAD}" y="${y}" width="${INNER}" height="${RAIL_H}" rx="${RAIL_H / 2}" fill="${WHITE}" stroke="${BORDER}"/>`);
const lw = tw(RAIL.left, 13, 0.56), rw = tw(RAIL.right, 13, 0.56);
g.push(ltext(PAD + 26, railY, RAIL.left, 13, UI, 700, SUBTLE));
g.push(text(PAD + INNER - 26, railY, RAIL.right, 13, UI, 700, SUBTLE, "end"));
const aL = PAD + 26 + lw + 22, aR = PAD + INNER - 26 - rw - 22;
g.push(`<rect x="${aL}" y="${railY - 2}" width="${aR - aL - 10}" height="4" rx="2" fill="${YELLOW}"/>`);
g.push(`<path d="M ${aR - 14} ${railY - 9} L ${aR} ${railY} L ${aR - 14} ${railY + 9} Z" fill="${YELLOW}"/>`);
// white plate clears the bar behind the caption; flat fill, no mask (rule 5)
const capT = "fewer openings, more sound held in";
const capW = tw(capT, 13, 0.56) + 28;
g.push(`<rect x="${(aL + aR) / 2 - capW / 2}" y="${railY - 12}" width="${capW}" height="24" fill="${WHITE}"/>`);
g.push(mtext((aL + aR) / 2, railY, capT, 13, UI, 500, MUTED));
y += RAIL_H + 18;

// ── 3. the ladder ──────────────────────────────────────────────────────
const IMG = 234;
const LAD_H = PANEL_PAD * 2 + 40 + IMG + 120;
g.push(`<rect x="${PAD}" y="${y}" width="${INNER}" height="${LAD_H}" rx="22" fill="${WHITE}" stroke="${BORDER}"/>`);
const hy = y + PANEL_PAD + 12;
g.push(ltext(PAD + PANEL_PAD, hy, LADDER.heading, 21, DISP, 700, INK));
g.push(ltext(PAD + PANEL_PAD + tw(LADDER.heading, 21, 0.58) + 14, hy + 1, LADDER.sub, 14, UI, 500, SUBTLE));
g.push(`<rect x="${PAD + PANEL_PAD}" y="${y + PANEL_PAD + 28}" width="${INNER - PANEL_PAD * 2}" height="1" fill="${BORDER}"/>`);

const CELL_W = Math.floor((INNER - PANEL_PAD * 2) / LADDER.buds.length);
for (let i = 0; i < LADDER.buds.length; i++) {
  const bd = LADDER.buds[i];
  const cx = PAD + PANEL_PAD + i * CELL_W + CELL_W / 2;
  const it = y + PANEL_PAD + 40;
  g.push(image(await fitted(phonakFile("_work", "renders", RENDER_FILES[bd.render]), IMG * 2), cx - IMG / 2, it, IMG, IMG));
  g.push(htext(cx, it + IMG + 34, bd.name, 24, DISP, 700, INK));
  g.push(htext(cx, it + IMG + 59, bd.vents, 13, UI, 700, YELLOW_DARK));
  wrap(bd.note, CELL_W - 34, 14, 0.56).forEach((ln, li) =>
    g.push(htext(cx, it + IMG + 86 + li * 20, ln, 14, UI, 400, BODY)),
  );
}
y += LAD_H + 18;

// ── 4. the reversal ───────────────────────────────────────────────────────────
const warnH = 62 + WARNING.rows.length * WARN_ROW_H + 44;
g.push(`<rect x="${PAD}" y="${y}" width="${INNER}" height="${warnH}" rx="22" fill="${YELLOW_LIGHT}"/>`);
g.push(ltext(PAD + 28, y + 40, WARNING.title, 26, DISP, 700, YELLOW_DARK));
WARNING.rows.forEach((r, i) => {
  const rt = y + 62 + i * WARN_ROW_H;
  const cy = rt + WARN_ROW_H / 2;
  g.push(`<rect x="${PAD + 20}" y="${rt + 6}" width="${INNER - 40}" height="${WARN_ROW_H - 12}" rx="14" fill="${WHITE}"/>`);
  g.push(`<circle cx="${PAD + 54}" cy="${cy}" r="19" fill="${YELLOW}"/>`);
  g.push(icon(r.icon, PAD + 43, cy - 11, 22, YELLOW_DARK, 2.2));
  // two-line block straddles cy, never hung off the row top
  g.push(ltext(PAD + 88, cy - 12, r.text, 17, UI, 700, INK));
  g.push(ltext(PAD + 88, cy + 13, r.note, 14, UI, 400, MUTED));
});
g.push(ltext(PAD + 28, y + warnH - 24, WARNING.foot, 14, UI, 500, YELLOW_DARK));
y += warnH;

const H = y + PAD;
const body = [
  `<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="${PAPER}"/>`,
  ...head.nodes,
  logo(W - PAD, PAD - 4, 46),
  ...g,
].join("\n");

writeBoard(OUT, { w: W, h: H, body, xlink: true });
