// CTA board -> the consultation pivot, at 95%. The last thing on screen.
//
// WHAT THIS BOARD SHOWS: the two ways to actually get the answer — an online
// consultation anywhere in India first, the Hyderabad Experience Center second —
// plus the browse pill, so someone who is not ready to talk to anyone still has
// somewhere to go.
//
// ⚠️ REGISTER: THIS IS AN INVITATION, NOT A CLOSE. The brand rule is "go explore
// it yourself", never "reach out" or "book now" (Chintan, 2026-07-23). The board
// opens by telling the viewer that confusion at this point is NORMAL, which is
// the honest read after twelve boards of trade-offs, and it earns the offer that
// follows. If a later edit turns this into "Book your free consultation today",
// it has broken the one thing that made the previous ninety-five percent land.
//
// ORDER MATTERS. Online is first because it is available to the whole country and
// most of the audience is not in Hyderabad; leading with the Experience Center
// would tell most viewers this is not for them. Hyderabad is second, and framed
// as the option if you want to physically try them on.
//
// The offer is the video's own method, not a sales call: the audiologists run
// this same framework on their audiogram. That is what makes it worth taking.
//
// The pill is composed in from lib/ctapill.mjs — same asset as the brand board,
// and synva.io stays its own text node so Chintan links it in Figma.
//
// rule 1b — English only. Copy-only, no data.
// Run: npm run board:phonak-cta
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import { ctaPill } from "../../lib/ctapill.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "cta.svg");

// Online first — see the ORDER note above.
const WAYS = [
  {
    n: "01",
    icon: "video",
    kicker: "ANYWHERE IN INDIA",
    title: "Online consultation",
    lines: [
      "Send your audiogram, talk to an audiologist.",
      "They run this same framework on your numbers,",
      "your lifestyle and your budget.",
    ],
    primary: true,
  },
  {
    n: "02",
    icon: "map-pin",
    kicker: "IF YOU CAN COME TO US",
    title: "Hyderabad Experience Center",
    lines: [
      "Wear them. Walk around in them.",
      "Hear the difference between the bands",
      "before you decide anything.",
    ],
  },
];

const icon = await loadIcons(WAYS.map((w) => w.icon));

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 28;
const CARDW = 560;
const W = PAD * 2 + WAYS.length * CARDW + (WAYS.length - 1) * GAP;

const T = 250;
const lineSets = WAYS.map((w) => w.lines);
const maxLines = Math.max(...lineSets.map((l) => l.length));
const CARDH = 150 + maxLines * 26 + 44;

const PILL_T = T + CARDH + 40;
const pill = await ctaPill({
  invite: "Or just browse at your own pace",
  urlText: "synva.io",
  icon: "mouse-pointer-click",
  x: PAD,
  y: PILL_T,
});
const H = PILL_T + pill.h + 66 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "STILL NOT SURE WHICH ONE IS YOURS?";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "That is completely normal", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "Nobody picks a hearing aid off a comparison table. The last step is somebody looking", 18, UI, 400, MUTED));
g.push(text(PAD, 232, "at your audiogram and your life together.", 18, UI, 400, MUTED));

WAYS.forEach((w, i) => {
  const x = PAD + i * (CARDW + GAP);
  const hot = !!w.primary;

  g.push(
    `<rect x="${x}" y="${T}" width="${CARDW}" height="${CARDH}" rx="22" fill="${hot ? YELLOW_LIGHT : WHITE}" stroke="${hot ? YELLOW : BORDER}" stroke-width="${hot ? 2.5 : 1.5}"/>`,
  );

  // icon tile + step number
  g.push(`<rect x="${x + 30}" y="${T + 30}" width="52" height="52" rx="16" fill="${hot ? WHITE : YELLOW_LIGHT}"/>`);
  g.push(icon(w.icon, x + 30 + 14, T + 30 + 14, 24, YELLOW_DARK, 2));
  g.push(text(x + CARDW - 30, T + 72, w.n, 40, DISP, 700, hot ? YELLOW : YELLOW_LIGHT, "end"));

  g.push(text(x + 30, T + 112, w.kicker, 11, UI, 700, hot ? YELLOW_DARK : SUBTLE));
  g.push(text(x + 30, T + 146, w.title, 27, DISP, 700, INK));

  w.lines.forEach((ln, li) =>
    g.push(text(x + 30, T + 182 + li * 26, ln, 15.5, UI, 400, hot ? YELLOW_DARK : BODY)),
  );
});

// the browse pill, for anyone not ready to talk to a person yet
g.push(pill.body);

g.push(text(PAD, PILL_T + pill.h + 46, "No pressure either way. The catalogue and the prices are open to everyone.", 15, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, xlink: true, body: g.join("\n") });
