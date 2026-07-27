// Swatch strip with EDITABLE live <text> (not outlined paths).
// Key rule for Figma SVG import: font-family must be a SINGLE clean name Figma
// has (no CSS fallback stack, no inner quotes). Bricolage Grotesque ships in
// Figma (Google Font), so it resolves on import as real editable text.
//
// The swatch list is built FROM lib/tokens.mjs, so this board is always the live
// palette — a token change flows here automatically instead of being retyped.
//
// Run: npm run board:swatches
import { boardOut } from "../../lib/paths.mjs";
import { esc, writeBoard } from "../../lib/svg.mjs";
import * as T from "../../lib/tokens.mjs";

const OUT = boardOut("brand", "synva-swatches-editable.svg");
const FONT = T.DISP; // single family, exactly as Figma names it

const FAMILIES = [
  { name: "Yellow", rows: [["Yellow", T.YELLOW], ["Yellow light", T.YELLOW_LIGHT], ["Yellow dark", T.YELLOW_DARK]] },
  { name: "Orange", rows: [["Orange", T.ORANGE], ["Orange light", T.ORANGE_LIGHT], ["Orange dark", T.ORANGE_DARK]] },
  { name: "Green",  rows: [["Green", T.GREEN],   ["Green light", T.GREEN_LIGHT],   ["Green dark", T.GREEN_DARK]] },
  { name: "Blue",   rows: [["Blue", T.BLUE],     ["Blue light", T.BLUE_LIGHT],     ["Blue dark", T.BLUE_DARK]] },
  { name: "Purple", rows: [["Purple", T.PURPLE], ["Purple light", T.PURPLE_LIGHT], ["Purple dark", T.PURPLE_DARK]] },
];
const NEUTRALS = [
  ["Ink", T.INK], ["Ink warm", T.INK_WARM], ["Black", T.BLACK],
  ["Body", T.BODY], ["Muted", T.MUTED], ["Subtle", T.SUBTLE],
  ["Border", T.BORDER], ["Paper", T.PAPER], ["White", T.WHITE],
];

const PAD = 44, W = 150, H = 78, LBL = 36, GAP = 16, COLS = 5;
const INK = T.INK, MUTED = T.MUTED, SUBTLE = T.SUBTLE;

// weight maps to a Figma style (400 Regular / 600 SemiBold / 700 Bold).
const text = (x, y, s, size, weight, fill) =>
  `  <text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;

function swatch(x, y, name, hex) {
  return [
    `  <rect x="${x}" y="${y}" width="${W}" height="${H}" rx="10" fill="${hex}" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>`,
    text(x + 2, y + H + 18, name, 13, 600, INK),
    text(x + 2, y + H + 32, hex.toUpperCase(), 11, 400, SUBTLE),
  ].join("\n");
}

const parts = [];
parts.push(text(PAD, 62, "Synva colours", 30, 700, INK));
parts.push(`  <rect x="${PAD}" y="74" width="52" height="6" rx="3" fill="${T.YELLOW}"/>`);
parts.push(text(PAD, 104, "Eyedropper any swatch onto the marker or highlighter.", 15, 400, MUTED));

const gy = 138, sy = gy + 24, rowH = H + LBL + GAP;
FAMILIES.forEach((fam, c) => {
  const x = PAD + c * (W + GAP);
  parts.push(text(x + 2, gy, fam.name.toUpperCase(), 12, 600, SUBTLE));
  fam.rows.forEach(([name, hex], r) => parts.push(swatch(x, sy + r * rowH, name, hex)));
});

const dividerY = sy + 3 * rowH - GAP + 22;
parts.push(`  <line x1="${PAD}" y1="${dividerY}" x2="${PAD + COLS * W + (COLS - 1) * GAP}" y2="${dividerY}" stroke="${T.BORDER}" stroke-width="1"/>`);
const nLabelY = dividerY + 30;
parts.push(text(PAD, nLabelY, "NEUTRALS", 12, 600, SUBTLE));
const ny = nLabelY + 18;
NEUTRALS.forEach(([name, hex], i) =>
  parts.push(swatch(PAD + (i % COLS) * (W + GAP), ny + Math.floor(i / COLS) * rowH, name, hex)));

const width = PAD * 2 + COLS * W + (COLS - 1) * GAP;
const height = ny + Math.ceil(NEUTRALS.length / COLS) * rowH - GAP + PAD;
const body = [
  `  <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="${T.PAPER}"/>`,
  `  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="20" fill="none" stroke="${T.BORDER}" stroke-width="1"/>`,
  parts.join("\n"),
].join("\n");
writeBoard(OUT, { w: width, h: height, body, log: false });
console.log(`wrote ${OUT} (${width}x${height}); editable <text> in "${FONT}"`);
