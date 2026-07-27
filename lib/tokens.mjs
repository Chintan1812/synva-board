// The Synva brand tokens, and the ONLY colours a board may use.
//
// ⚠️ This file is the one deliberate duplication of website content in this repo.
// It has to be: a generated SVG needs literal hex strings, and the website's
// globals.css cannot be imported by Node. The authoritative source is
// `src/app/globals.css` in the website repo (the @theme block) — if the brand
// palette ever changes there, mirror it here in the same pass. See WEBSITE.md.
//
// Boards are yellow-forward. The other hue families exist for a reason (the
// framework board's three-lens coding, the budget-level colours from the site's
// browse.ts) — reach for them deliberately, not decoratively.

// ── neutrals ──────────────────────────────────────────────────────────────────
export const BLACK = "#111111";
export const INK = "#1A1A1A";
export const INK_WARM = "#14100A";
export const BODY = "#3A3A3A";
export const MUTED = "#4F4F4F";
export const SUBTLE = "#6B6B6B";
export const BORDER = "#E8E4DC";
export const PAPER = "#FAF8F4";
export const WHITE = "#FFFFFF";

// ── yellow (the brand's primary; boards lead with it) ─────────────────────────
export const YELLOW = "#FBD34A";
export const YELLOW_LIGHT = "#FFECBB";
export const YELLOW_DARK = "#4C3205";

// ── the supporting hue families ───────────────────────────────────────────────
export const ORANGE = "#EF6D50";
export const ORANGE_LIGHT = "#FBCEC8";
export const ORANGE_DARK = "#994334";

export const GREEN = "#4CC1A1";
export const GREEN_LIGHT = "#D2FFF1";
export const GREEN_DARK = "#265949";

export const BLUE = "#BEE1F4";
export const BLUE_LIGHT = "#EBF9FF";
export const BLUE_DARK = "#1D5180";

export const PURPLE = "#D5A4E6";
export const PURPLE_LIGHT = "#F6E1FF";
export const PURPLE_DARK = "#604C68";

// ── type ──────────────────────────────────────────────────────────────────────
// A <text> must carry exactly ONE of these as its font-family. Never a fallback
// stack — Figma's importer mis-sizes stacked-font text and wraps it.
export const DISP = "Bricolage Grotesque"; // display / headings
export const UI = "Inter"; // body / labels

/** Every token hex, uppercased — the allowlist `npm run verify` checks against. */
export const TOKEN_HEXES = new Set(
  [
    BLACK, INK, INK_WARM, BODY, MUTED, SUBTLE, BORDER, PAPER, WHITE,
    YELLOW, YELLOW_LIGHT, YELLOW_DARK,
    ORANGE, ORANGE_LIGHT, ORANGE_DARK,
    GREEN, GREEN_LIGHT, GREEN_DARK,
    BLUE, BLUE_LIGHT, BLUE_DARK,
    PURPLE, PURPLE_LIGHT, PURPLE_DARK,
  ].map((h) => h.toUpperCase()),
);

/** The only font families a board may name. */
export const FONTS = new Set([DISP, UI]);
