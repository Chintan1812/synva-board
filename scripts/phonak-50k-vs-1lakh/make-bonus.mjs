// BONUS board -> the 6-question self-check, at 70%. The promise from the hook,
// delivered.
//
// WHAT THIS BOARD SHOWS: the six questions going in, and the two answers coming
// back. Copy only — the tool itself is a website job, not a board job.
//
// ⚠️ THE HONEST "NO" IS THE WHOLE POINT, so it gets the largest type on the
// board. The tool's first output is *"is Phonak right for you at all?"* and that
// answer **can be no**. Chintan changed the output to this on 2026-07-29 and it
// is structurally load-bearing: the two `cheezein` (no BTE on the latest
// platform; invisible plus rechargeable) are precisely the cases where the tool
// must say no. So the tool reproduces the video's honesty mechanically instead of
// Synva asserting it. No competitor ships a tool that talks people out of their
// own brand. If a later edit softens this into "find your perfect Phonak", the
// bonus has lost the only thing that makes it worth a phone number.
//
// Q4 (rechargeable) and Q5 (invisible) are flagged on the board because those
// are exactly the two axes where Phonak loses. Showing which questions can
// produce a "no" is what makes the promise credible rather than a funnel.
//
// ⚠️⚠️ BLOCKED BEFORE RECORDING. The Knowledge Hub page and its gate must be
// LIVE before Chintan says any of this on camera — the bonus is also teased
// inside the hook, so the whole shoot waits on it. Three cheatsheets are already
// promised on camera and unshipped (videos/TOPIC-SLATE.md); this must not become
// the fourth. THE SLUG BELOW IS A PLACEHOLDER and must be confirmed against the
// real page before the board is used.
//
// The URL is its own text node so Figma can hyperlink it — same reason as the
// CTA pill. Figma cannot attach a link to part of a string.
//
// rule 1b — the board is ENGLISH even though Chintan asks these in Hindi.
// Run: npm run board:phonak-bonus
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { text, htext, mtext, ltext, wrap, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";

const OUT = boardOut("phonak-50k-vs-1lakh", "bonus.svg");

// ⚠️ PLACEHOLDER SLUG — confirm against the live page before recording.
const URL_TEXT = "synva.io/knowledge-hub/phonak-check";

// The six, in Chintan's order. `axis` marks the two that can produce a "no".
const QUESTIONS = [
  { q: "Are your days mostly at home, or mostly out?" },
  { q: "Do you lose the thread in a restaurant or at a function?" },
  { q: "Is the phone a big part of your day?" },
  { q: "Changing batteries, or rechargeable?", axis: true },
  { q: "Does it have to be invisible?", axis: true },
  { q: "Is this for you, or for someone else?" },
];

const icon = await loadIcons(["arrow-up-right", "list-checks"]);

// ── layout ───────────────────────────────────────────────────────────────────
const PAD = 56;
const GAP = 30;
const LEFTW = 700, RIGHTW = 620;
const W = PAD * 2 + LEFTW + GAP + RIGHTW;
const T = 232;

const qLines = QUESTIONS.map((x) => wrap(x.q, LEFTW - 130, 17, 0.55));
const qH = qLines.map((l) => Math.max(58, l.length * 24 + 30));
const leftH = 108 + qH.reduce((a, b) => a + b, 0) + 74;

const rightH = 108 + 400;
const CARDH = Math.max(leftH, rightH);

const URL_T = T + CARDH + 34;
const URL_H = 96;
const H = URL_T + URL_H + 68 + PAD;

// ── build ────────────────────────────────────────────────────────────────────
const g = [];
g.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`);

const kicker = "THE BONUS, AS PROMISED";
const kw = kicker.length * 12 * 0.62 + 36;
g.push(`<rect x="${PAD}" y="60" width="${kw}" height="34" rx="17" fill="${YELLOW_LIGHT}"/>`);
g.push(mtext(PAD + kw / 2, 77, kicker, 12, UI, 700, YELLOW_DARK));
g.push(text(PAD, 158, "Six questions. An honest answer.", 46, DISP, 700, INK));
g.push(`<rect x="${PAD}" y="174" width="72" height="7" rx="3.5" fill="${YELLOW}"/>`);
g.push(text(PAD, 206, "About your hearing and your life. No jargon, nothing to look up.", 18, UI, 400, MUTED));

// ── left: the six questions ─────────────────────────────────────────────────
{
  const x = PAD;
  g.push(`<rect x="${x}" y="${T}" width="${LEFTW}" height="${CARDH}" rx="22" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
  g.push(text(x + 30, T + 48, "WHAT IT ASKS", 11.5, UI, 700, SUBTLE));
  g.push(`<line x1="${x + 30}" y1="${T + 76}" x2="${x + LEFTW - 30}" y2="${T + 76}" stroke="${BORDER}" stroke-width="1"/>`);

  let y = T + 108;
  QUESTIONS.forEach((item, i) => {
    const cy = y + 18;
    g.push(`<circle cx="${x + 52}" cy="${cy}" r="17" fill="${item.axis ? YELLOW : PAPER}"/>`);
    g.push(mtext(x + 52, cy, String(i + 1), 15, UI, 700, item.axis ? YELLOW_DARK : SUBTLE));
    qLines[i].forEach((ln, li) =>
      g.push(ltext(x + 84, cy - ((qLines[i].length - 1) * 24) / 2 + li * 24, ln, 17, UI, 500, INK)),
    );
    y += qH[i];
  });

  // why two of them are lit
  const note = "Four and five are the two where Phonak can lose. That is on purpose.";
  g.push(`<rect x="${x + 24}" y="${T + CARDH - 66}" width="${LEFTW - 48}" height="44" rx="14" fill="${YELLOW_LIGHT}"/>`);
  g.push(ltext(x + 44, T + CARDH - 44, note, 14, UI, 600, YELLOW_DARK));
}

// ── right: what comes back ──────────────────────────────────────────────────
{
  const x = PAD + LEFTW + GAP;
  g.push(`<rect x="${x}" y="${T}" width="${RIGHTW}" height="${CARDH}" rx="22" fill="${YELLOW_LIGHT}" stroke="${YELLOW}" stroke-width="2.5"/>`);
  g.push(text(x + 30, T + 48, "WHAT COMES BACK", 11.5, UI, 700, YELLOW_DARK));
  g.push(`<line x1="${x + 30}" y1="${T + 76}" x2="${x + RIGHTW - 30}" y2="${T + 76}" stroke="${YELLOW}" stroke-width="1"/>`);

  // output 1 — the honest no, given the most weight on the board
  g.push(mtext(x + 52, T + 128, "1", 15, UI, 700, YELLOW_DARK));
  g.push(`<circle cx="${x + 52}" cy="${T + 128}" r="17" fill="none" stroke="${YELLOW_DARK}" stroke-width="2"/>`);
  g.push(ltext(x + 84, T + 128, "Is a Phonak right for you at all?", 22, DISP, 700, INK));

  // "NO" gets its own line and the biggest type in the panel. Inline it ran
  // straight into the preceding word, and it is the point of the whole tool.
  g.push(`<rect x="${x + 30}" y="${T + 158}" width="${RIGHTW - 60}" height="118" rx="16" fill="${WHITE}" stroke="${YELLOW_DARK}" stroke-width="2"/>`);
  g.push(ltext(x + 52, T + 184, "And the answer can be", 15, UI, 500, BODY));
  g.push(ltext(x + 52, T + 222, "NO", 42, DISP, 700, INK));
  g.push(ltext(x + 52, T + 256, "Two of these questions have no Phonak answer.", 13.5, UI, 400, SUBTLE));

  // output 2
  g.push(mtext(x + 52, T + 326, "2", 15, UI, 700, YELLOW_DARK));
  g.push(`<circle cx="${x + 52}" cy="${T + 326}" r="17" fill="none" stroke="${YELLOW_DARK}" stroke-width="2"/>`);
  g.push(ltext(x + 84, T + 326, "If it is, which ones are yours", 22, DISP, 700, INK));
  g.push(ltext(x + 84, T + 356, "Named models, at your budget, for your life.", 14.5, UI, 400, YELLOW_DARK));

  // A worked "no", so the promise is demonstrated rather than asserted. This is
  // one of the two cheezein, which is why the tool can produce it at all.
  const exH = 96;
  const exT = T + CARDH - exH - 22;
  g.push(`<rect x="${x + 30}" y="${exT}" width="${RIGHTW - 60}" height="${exH}" rx="16" fill="${WHITE}"/>`);
  g.push(ltext(x + 52, exT + 26, "WHAT A NO LOOKS LIKE", 10.5, UI, 700, SUBTLE));
  g.push(ltext(x + 52, exT + 52, "Profound loss, and you want rechargeable?", 14.5, UI, 600, INK));
  g.push(ltext(x + 52, exT + 74, "Phonak has no answer. We say so, and say what does.", 13.5, UI, 400, SUBTLE));
}

// ── the link, as its own text node so Figma can hyperlink it ────────────────
g.push(`<rect x="${PAD}" y="${URL_T}" width="${W - PAD * 2}" height="${URL_H}" rx="20" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>`);
g.push(icon("list-checks", PAD + 32, URL_T + 32, 30, YELLOW_DARK, 2));
g.push(ltext(PAD + 78, URL_T + 40, "Take it here", 20, DISP, 700, INK));
g.push(ltext(PAD + 78, URL_T + 66, "Link in the description, right at the top.", 14, UI, 400, MUTED));

// the URL stands alone — Chintan attaches the hyperlink in Figma
const urlW = URL_TEXT.length * 20 * 0.56 + 76;
g.push(`<rect x="${W - PAD - urlW - 24}" y="${URL_T + 22}" width="${urlW}" height="52" rx="26" fill="${YELLOW}"/>`);
g.push(ltext(W - PAD - urlW - 24 + 28, URL_T + 48, URL_TEXT, 20, DISP, 700, YELLOW_DARK));
g.push(icon("arrow-up-right", W - PAD - 24 - 44, URL_T + 36, 24, YELLOW_DARK, 2.4));

g.push(text(PAD, URL_T + URL_H + 44, "The questions are open to everyone. The answer is the part worth asking for.", 15, UI, 400, SUBTLE));

writeBoard(OUT, { w: W, h: H, body: g.join("\n") });
