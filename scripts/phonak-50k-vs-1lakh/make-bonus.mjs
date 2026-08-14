// BONUS board -> the tool, promised at 70%. A POINTER, NOT A SPEC.
//
// ⚠️ REBUILT 2026-08-13 (Chintan: "now that the website has the live Phonak tool
// ready, create the board according to that only. Keep it brief and point it out
// to the website so I can show it there directly").
//
// THE BLOCKER IS GONE. Every earlier version of this board was written around a
// page that did not exist yet, which forced two compromises:
//   • the URL had to stay a generic "synva.io", because naming a slug that would
//     404 on camera is worse than naming nothing;
//   • the questions could not be shown, because unbuilt copy would have become a
//     promise nobody agreed to.
// The page is now LIVE at /phonak-hearing-aid-recommendation, so both are lifted
// and every line below is copied from the real page, not invented here.
//
// SOURCE OF TRUTH: the website's
//   src/components/sections/recommend/data/recommend-data.ts  (RECOMMEND_HERO + steps)
//   src/app/(marketing)/phonak-hearing-aid-recommendation/page.tsx  (the route)
// The headline is the page's real H1 and the honesty line is its real promise.
// If the page copy changes, change it HERE too, or the board starts lying.
//
// THE BROWSER FRAME WAS DROPPED ON PURPOSE. It existed so Chintan could cover it
// with a screen recording of a page that did not exist. He now cuts to the live
// site instead, so the board's only job is to make the viewer want to go and to
// show the address clearly. That is why it is short.
//
// ⚠️ THE URL IS THE REAL ONE AND IT IS LONG. There is no shorter alias and no
// redirect (checked next.config.ts). Do not shorten it to something prettier
// that 404s. If a short alias is ever added, update URL_TEXT here.
//
// ⚠️ THE HONEST "NO" STAYS. It is the only reason this tool is worth a click,
// and softening it into "find your perfect Phonak" throws that away.
//
// rule 1b — English only. Run: npm run board:phonak-bonus
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, ltext, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "bonus.svg");

// The live page. No alias exists — see the warning above.
const URL_TEXT = "synva.io/phonak-hearing-aid-recommendation";

// The three real steps, in the page's own order and words.
const STEPS = [
  { n: "1", head: "Your hearing", sub: "Plot your audiogram, or just tell us honestly." },
  { n: "2", head: "Your week", sub: "How you actually spend your days." },
  { n: "3", head: "Who it is for", sub: "You, or someone you love." },
];

const icon = await loadIcons(["arrow-up-right"]);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const W = 1300;
const inner = W - PAD * 2;

const STEP_T = 250;
const STEP_H = 148;
const GAP = 24;
const STEPW = (inner - GAP * 2) / 3;

const ANS_T = STEP_T + STEP_H + 34;
const ANS_H = 132;

const LINK_T = ANS_T + ANS_H + 34;
const LINK_H = 96;
const H = LINK_T + LINK_H + PAD;

const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

// ── header — the page's own eyebrow and H1 ──────────────────────────────────
const kicker = "THE TOOL FROM THE VIDEO";
const kw = tw(kicker, 12, 0.62) + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "Is a Phonak hearing aid right for you?", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 208, "Three questions. Then a straight answer, in under a minute.", 18, UI, 400, MUTED));

// ── the three questions it asks ─────────────────────────────────────────────
STEPS.forEach((s, i) => {
  const x = PAD + i * (STEPW + GAP);
  g.push(`<rect x="${x}" y="${STEP_T}" width="${STEPW}" height="${STEP_H}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(`<circle cx="${x + 46}" cy="${STEP_T + 50}" r="20" fill="${YELLOW}"/>`);
  g.push(mtext(x + 46, STEP_T + 50, s.n, 19, UI, 700, YELLOW_DARK));
  g.push(ltext(x + 80, STEP_T + 50, s.head, 25, DISP, 700, INK));
  g.push(text(x + 30, STEP_T + 104, s.sub, 15, UI, 400, MUTED));
});

// ── what comes back — the honest NO is the differentiator ───────────────────
g.push(`<rect x="${PAD}" y="${ANS_T}" width="${inner}" height="${ANS_H}" rx="20" fill="${YELLOW_LIGHT}" stroke="${YELLOW}" stroke-width="2"/>`);
g.push(text(PAD + 34, ANS_T + 46, "You get named models, at your budget, for your life.", 24, DISP, 700, INK));
g.push(text(PAD + 34, ANS_T + 84, "And if another brand fits you better, we say that too.", 19, UI, 600, YELLOW_DARK));
g.push(text(PAD + 34, ANS_T + 110, "That is the whole point of it.", 14, UI, 400, BODY));

// ── the address, big enough to read off a phone ─────────────────────────────
g.push(`<rect x="${PAD}" y="${LINK_T}" width="${inner}" height="${LINK_H}" rx="20" fill="${WHITE}" stroke="${INK}" stroke-width="2.5"/>`);
g.push(ltext(PAD + 34, LINK_T + LINK_H / 2, URL_TEXT, 27, DISP, 700, INK));
g.push(icon("arrow-up-right", W - PAD - 62, LINK_T + LINK_H / 2 - 16, 32, YELLOW_DARK, 2.6));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
