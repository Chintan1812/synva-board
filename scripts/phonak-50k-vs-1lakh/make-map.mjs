// MAP board -> the connector map itself. NOT a board Chintan talks over.
//
// This is the layout guide: where every board goes on the FigJam canvas, in what
// order he walks them, and which connector joins which. Drop it on the canvas
// first, lay the real boards out against it, then delete it before recording.
//
// It is generated from mindmap.json — the same file the boards were built from —
// so it can never drift from the plan. Node positions come from `col`/`row`,
// which is exactly the grid the mind map specifies:
//   row  0  the spine, left to right, in talk order
//   row -1 asides ABOVE the spine (the turns, the honest limits)
//   row  1 supports BELOW the spine (the props that back a spine node)
//
// Edge kinds carry meaning and are drawn differently:
//   leads-to    solid       the walk itself
//   supports    dashed      a prop that backs the node it hangs off
//   closes-loop dashed+dot  back to `entry` — a hook promise being paid off
//
// rule 1b — English only. Run: npm run board:phonak-map
import { boardOut, videoFile } from "../../lib/paths.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";
import fs from "node:fs";

const OUT = boardOut("phonak-50k-vs-1lakh", "map.svg");
const MAP = JSON.parse(fs.readFileSync(videoFile("phonak-50k-vs-1lakh", "mindmap.json"), "utf8"));

// Human labels for the map. Everything else is read from mindmap.json.
const LABEL = {
  entry: "The hook",
  trust: "Who I am",
  plan: "What you get",
  common: "Same ears",
  framework: "The 3 steps",
  mrpnote: "Prices are MRP",
  band50: "₹50,000",
  turn50: "THE TURN",
  band1l: "₹1,00,000",
  delta: "What ₹40k buys",
  cheezein: "Two walls",
  bonus: "The tool",
  dontbuy: "Skip this one",
  lifestyle: "Your life",
  cta: "Come talk",
};

const nodes = MAP.nodes.filter((n) => LABEL[n.id]);
const byId = new Map(nodes.map((n) => [n.id, n]));

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const COLW = 210, ROWH = 196;
const NW = 178, NH = 116;

const cols = [...new Set(nodes.map((n) => n.col))].sort((a, b) => a - b);
const rows = [...new Set(nodes.map((n) => n.row))].sort((a, b) => a - b);
const colIx = new Map(cols.map((c, i) => [c, i]));
const rowIx = new Map(rows.map((r, i) => [r, i]));

// The loop-close arcs run in a lane ABOVE the grid, so T has to clear the
// subtitle or they draw straight through it.
const ARC_LANE = 258;
const T = 316;
const nx = (n) => PAD + colIx.get(n.col) * COLW + (COLW - NW) / 2;
const ny = (n) => T + rowIx.get(n.row) * ROWH;
const cx = (n) => nx(n) + NW / 2;
const cy = (n) => ny(n) + NH / 2;

const W = PAD * 2 + cols.length * COLW;
const gridH = rows.length * ROWH;
const LEGEND_T = T + gridH + 30;
const H = LEGEND_T + 150 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "CANVAS LAYOUT · NOT A BOARD TO TALK OVER";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "How the boards connect", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "Left to right is the walk. Above the line is an aside, below it is a prop that backs the node.", 18, UI, 400, MUTED));

// ── the spine, drawn behind everything as a quiet rule ──────────────────────
const spineY = T + rowIx.get(0) * ROWH + NH / 2;
g.push(`<line x1="${PAD + 20}" y1="${spineY}" x2="${W - PAD - 20}" y2="${spineY}" stroke="${BORDER}" stroke-width="1.5"/>`);

// ── edges ───────────────────────────────────────────────────────────────────
MAP.edges.forEach((e) => {
  const a = byId.get(e.from), b = byId.get(e.to);
  if (!a || !b) return;
  const loop = e.kind === "closes-loop" || e.to === "entry";
  const support = e.kind === "supports";

  const dash = loop ? ' stroke-dasharray="2 9" stroke-linecap="round"' : support ? ' stroke-dasharray="8 7"' : "";
  const col = loop ? SUBTLE : support ? BORDER : YELLOW;
  const wgt = loop ? 2 : support ? 2 : 3.5;

  if (loop) {
    // a loop close arcs back over the top of everything, so it reads as a
    // return rather than another step forward
    const top = ARC_LANE;
    g.push(
      `<path d="M ${cx(a)} ${ny(a)} L ${cx(a)} ${top} L ${cx(b)} ${top} L ${cx(b)} ${ny(b)}" fill="none" stroke="${col}" stroke-width="${wgt}"${dash}/>`,
    );
    return;
  }
  if (a.row === b.row) {
    g.push(`<line x1="${nx(a) + NW}" y1="${cy(a)}" x2="${nx(b)}" y2="${cy(b)}" stroke="${col}" stroke-width="${wgt}"${dash}/>`);
    const mx = (nx(a) + NW + nx(b)) / 2;
    g.push(`<path d="M ${mx - 5} ${cy(a) - 6} L ${mx + 5} ${cy(a)} L ${mx - 5} ${cy(a) + 6}" fill="none" stroke="${col}" stroke-width="${wgt}" stroke-linecap="round" stroke-linejoin="round"/>`);
  } else {
    // elbow: out of the side, then up or down into the other row
    const x1 = nx(a) + NW / 2, y1 = a.row < b.row ? ny(a) + NH : ny(a);
    const x2 = nx(b) + NW / 2, y2 = a.row < b.row ? ny(b) : ny(b) + NH;
    const midY = (y1 + y2) / 2;
    g.push(
      `<path d="M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${wgt}"${dash}/>`,
    );
  }
});

// ── nodes ───────────────────────────────────────────────────────────────────
const KIND_TONE = {
  root: { fill: YELLOW, stroke: YELLOW_DARK, ink: YELLOW_DARK },
  branch: { fill: YELLOW_LIGHT, stroke: YELLOW, ink: YELLOW_DARK },
  aside: { fill: WHITE, stroke: SUBTLE, ink: INK },
  leaf: { fill: WHITE, stroke: BORDER, ink: BODY },
  bonus: { fill: WHITE, stroke: YELLOW_DARK, ink: INK },
  exit: { fill: YELLOW_LIGHT, stroke: YELLOW_DARK, ink: YELLOW_DARK },
};

nodes
  .slice()
  .sort((a, b) => a.atPercent - b.atPercent)
  .forEach((n) => {
    const t = KIND_TONE[n.kind] || KIND_TONE.leaf;
    const x = nx(n), y = ny(n);
    g.push(`<rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="18" fill="${t.fill}" stroke="${t.stroke}" stroke-width="2"/>`);

    // the percentage is the thing he navigates by on the day
    g.push(htext(x + NW / 2, y + 30, `${n.atPercent}%`, 15, DISP, 700, t.ink));
    wrap(LABEL[n.id], NW - 24, 17, 0.55).forEach((ln, li) =>
      g.push(htext(x + NW / 2, y + 58 + li * 21, ln, 17, DISP, 700, t.ink)),
    );
    g.push(htext(x + NW / 2, y + NH - 16, n.id, 11, UI, 400, n.kind === "root" ? YELLOW_DARK : SUBTLE));

    // a veil marker: this board gets revealed piece by piece on camera
    if (n.veil) {
      g.push(`<circle cx="${x + NW - 18}" cy="${y + 18}" r="8" fill="${YELLOW_DARK}"/>`);
      g.push(mtext(x + NW - 18, y + 18, "V", 9, UI, 700, YELLOW_LIGHT));
    }
  });

// ── legend ──────────────────────────────────────────────────────────────────
g.push(`<rect x="${PAD}" y="${LEGEND_T}" width="${W - PAD * 2}" height="132" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(text(PAD + 28, LEGEND_T + 34, "HOW TO READ IT", 11.5, UI, 700, SUBTLE));

const LEG = [
  { kind: "line", col: YELLOW, w: 3.5, dash: "", label: "leads to", note: "the walk, in order" },
  { kind: "line", col: BORDER, w: 2, dash: ' stroke-dasharray="8 7"', label: "supports", note: "a prop backing that node" },
  { kind: "line", col: SUBTLE, w: 2, dash: ' stroke-dasharray="2 9" stroke-linecap="round"', label: "closes a loop", note: "arcs back to the hook" },
  { kind: "veil", label: "veiled", note: "revealed piece by piece" },
];
let lx = PAD + 28;
LEG.forEach((l) => {
  const ly = LEGEND_T + 78;
  if (l.kind === "line") {
    g.push(`<line x1="${lx}" y1="${ly}" x2="${lx + 46}" y2="${ly}" stroke="${l.col}" stroke-width="${l.w}"${l.dash}/>`);
  } else {
    g.push(`<circle cx="${lx + 12}" cy="${ly}" r="8" fill="${YELLOW_DARK}"/>`);
    g.push(mtext(lx + 12, ly, "V", 9, UI, 700, YELLOW_LIGHT));
  }
  g.push(ltext(lx + 60, ly - 8, l.label, 14.5, DISP, 700, INK));
  g.push(ltext(lx + 60, ly + 12, l.note, 12.5, UI, 400, SUBTLE));
  lx += 60 + Math.max(l.label.length, l.note.length) * 12.5 * 0.55 + 46;
});

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
