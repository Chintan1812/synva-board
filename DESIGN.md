# Synva Boards — Design Spec

> **Version: 2.0 — 2026-07-27** · visual source of truth for the **SVG boards
> ONLY**. Functional/architectural context is in [CLAUDE.md](./CLAUDE.md); the
> operational procedure is the
> [`figma-board-svg` skill](./.claude/skills/figma-board-svg/SKILL.md).
>
> ⚠️ **Separate from the website's own `DESIGN.md`.** This is *not* the website
> visual spec — it borrows the website's tokens and encodes only the rules
> specific to making a Figma-importable board. Board-styling notes go **here**.
> Where to find the website's design system: [WEBSITE.md](./WEBSITE.md).

## Canvas & size — boards are FREE-SIZE
There is **no fixed video-frame constraint** on a board (Chintan, 2026-07-21).
Do **not** lock a board to 1920×1080 / 16:9 / any aspect. Size the SVG to its
**content** — as wide/tall as it needs to be to show everything (this is also the
skill's Rule 2). Chintan drops the board onto a Figma/FigJam canvas and
**scales/places it there**, so the board's job is to look right at its own
natural proportions, not to match a timeline resolution. For a video, ship the
full board plus a compact landscape hook (skill Rule 7). The outer canvas is the
paper token (`#FAF8F4`), optionally rounded (rx ≈28) so it reads as a
self-contained card object on the board.

## Tokens come from the website — don't invent, don't duplicate
Boards use **only** the Synva brand tokens. In code they come from
[`lib/tokens.mjs`](./lib/tokens.mjs); the authority behind that file is the
website's `src/app/globals.css`, and its human-readable spec is the website's
`DESIGN.md` (see [WEBSITE.md](./WEBSITE.md) for both paths, and for the rule about
keeping `lib/tokens.mjs` in sync). This is deliberate: the boards should look like
the site. **Strict rule (Chintan, 2026-07-21): no invented tints, heat-ramps, or
off-brand shades.** `npm run verify` reports any hex that is not a token. The
palette actually used on boards:

| Token | Hex | Board use |
| --- | --- | --- |
| paper | `#FAF8F4` | board background; subtle supporting band / flagship-column tint |
| ink | `#1A1A1A` | primary text |
| white | `#FFFFFF` | cards |
| border | `#E8E4DC` | hairlines, category bands, dividers |
| muted / subtle / body | `#4F4F4F` / `#6B6B6B` / `#3A3A3A` | secondary/label/body text |
| yellow (signature) | `#FBD34A` | rating discs, accents |
| yellow-light | `#FFECBB` | highlight band, "included" discs |
| yellow-dark | `#4C3205` | text/glyphs on yellow |

Boards are **yellow-forward** — the site's other hue families (purple/green/blue/
orange, each with light/dark) exist but reach for one only with a clear reason.

**The ONE non-token colour allowed is real product data** — a device's actual
finish colour on a swatch (`colors.hex_primary/secondary`), never a decorative
invented colour.

## Type
- **Bricolage Grotesque** — display / headings / big numbers.
- **Inter** — body / labels / cell values.
- Both fonts ship in Figma, so editable text renders without an install.
- **Single `font-family` per `<text>`, exact name** (`"Bricolage Grotesque"` or
  `"Inter"`). **Never a CSS fallback stack** — Figma's importer mis-sizes and
  wraps stacked-font text. (This is a hard import-safety rule; see the skill.)

## Import-safe visual constraints (break these → the board breaks)
The board is only good if it imports cleanly through `figma-plugin/`:
- **Flat fills and strokes ONLY.** No `<filter>`, no linear/radial gradients —
  they break `figma.createNodeFromSvg` and the plugin. A two-tone swatch = **two
  flat half-disc `<path>`s**, never a gradient. Need depth? Use a **border**, not
  a drop-shadow.
- **Icons = vector `<path>`** from Lucide (editable vectors), not font glyphs or
  raster.
- **Centre with real SVG centring, never a hand-computed offset.** The plugin
  honors `text-anchor` and `dominant-baseline`:
  - centred column value → `text-anchor="middle"`, `x = centre`;
  - glyph centred inside a disc (a score digit) → **also** `dominant-baseline="central"`, `y = centre`;
  - left-aligned text → default `text-anchor="start"`, plain x.
  Do **not** approximate with `cx - halfGlyphWidth` — it drifts per digit/font
  (a real bug Chintan flagged).

## Board layout language (mirrors the website compare-matrix idiom)
- White rounded cards on a paper background; yellow accents; category headers;
  chip strips.
- **Highlight band = yellow-light** (`#FFECBB`) — the "common to every model"
  strip and other emphasis.
- **Subtle supporting band / flagship-column tint = paper** (`#FAF8F4`).
- **Hairlines + category bands = border** (`#E8E4DC`).

### Comparison board anatomy (headline-specs-first)
Ordered top to bottom (frozen with Chintan 2026-07-21):
1. **Headline specs band, pinned at top** — Price · Channels · Clarity in noise
   (`perf_speech_noise` 1-5) · Auto-adaptation (`perf_auto_adapt` 1-5) · Warranty.
   These are what a buyer decides on and what differs across a line, so they lead.
2. **Common-traits band** — anything identical across every model (rechargeable,
   Bluetooth to iPhone + Android, form factor, fitting range + receivers, app +
   remote care) stated **once** in a prominent filled yellow-light strip, never
   repeated per column. Don't list direct-streaming separately when the Bluetooth
   line covers it.
3. **Full categorised feature matrix** — every feature, real catalogue names,
   grouped by category. Nothing hidden or truncated.

### Rating discs — value, not shade
Show the **performance LEVEL, not just presence**. A feature can be present at
different levels per tier (`model_features.performance_score`, 1-5) — that
gradient is the whole point. Three cell states:
- **number 1-5** in a **single Synva-yellow disc** (`#FBD34A`) when graded — the
  *digit* carries the level, **never a heat-tinted ramp of golds** (that violates
  the strict-token rule);
- **check** in a **yellow-light disc** (`#FFECBB`) when included but ungraded
  (`performance_score` null);
- **dash** (subtle) when the model lacks the feature entirely.
Sort each category **varies-first** (tier-differentiating rows on top). Always
include a **legend** (number = level, check = included, dash = not available) and
**colour swatches** per model.

### Budget-level colours (Essential / Good to have / Premium)
When a board uses the site's **three budget levels**, honour the website's own
colour code (from the website's `src/lib/catalog/browse.ts` `PICK_LEVEL_BADGE`/`PICK_LEVEL_LABEL`,
Chintan's ask) — do NOT invent per-tier colours:
- **Essential → blue** (light `#EBF9FF` / dark `#1D5180`)
- **Good to have → yellow** (light `#FFECBB` / dark `#4C3205`)
- **Premium → purple** (light `#F6E1FF` / dark `#604C68`)
Pair with the site's `₹ / ₹₹ / ₹₹₹` ascending relative-cost cue (never a fake
number). *(Note: this is the **budget-level** vocabulary. The homepage 3-step
FRAMEWORK uses a different, step-based coding — 01 hearing = yellow / 02 lifestyle
= blue / 03 budget = green — see `synva-framework.svg`. Don't conflate them.)*

### Raster illustrations may be embedded (via the updated plugin)
A board **may** carry a genuine photo/illustration as an embedded `<image>`
(**PNG** data-URI — convert webp→PNG at generation time; `figma.createImage` won't
take webp). The updated plugin builds a native image fill from it. Use this only
for real imagery (e.g. the lifestyle illustrations from the website's `public/images/hearing-aids/
lifestyle-*.webp`); everything structural stays flat vector + editable text.

### Lifestyle / recommendation board (reusable — `make-lifestyle.mjs`)
The "which model for your lifestyle" board: a header (embedded lifestyle
illustration + eyebrow pill + big lifestyle name + who-it's-for) over **three
budget-level columns** (blue/yellow/purple tinted panels, per the level colours
above), each holding white **model cards** (a category-tint **icon tile** for the
model's standout feature + name + one-line "why" + a **5-dot tech-level indicator**
showing the model's rank in the line) or a **video-thumbnail placeholder** (a 16:9
framed play-button slot Chintan fills in Figma).
A conditional (e.g. the tinnitus 2IX shift) is a small tinted note-box inside the
model card. Column contents are **vertically centred** in the shared (max) height
so a short column (one card / a thumbnail) doesn't leave an empty bottom.

### Colour cards (`make-colors.mjs`)
One card per finish: the **real device render** in that colour (the hero — embedded
PNG, pulled from Supabase Storage by `images.color_id`, trimmed so the device fills
the frame) + a small **two-tone swatch dot** (real product hex, the sanctioned
non-token exception) beside the name + a row of **version chips** (available =
filled yellow-light + yellow border + yellow-dark; unavailable = white outline +
subtle text). Cards sorted most-available-first; a short last row is centred. The
swatch dot stays flat (two half-disc paths, no gloss gradients — rule 5).

### CTA pill (`make-cta.mjs`)
A soft, on-board call to the site: a white capsule with a **yellow-light icon tile**
(a hands-on cursor / explore Lucide glyph), an **invite line in Bricolage** (ink),
a hairline divider, then **`synva.io`** (yellow-dark) + an up-right arrow. Tone is
**"go explore it yourself"**, never "reach out / book now" (Chintan). The URL is a
separate editable text node so the hyperlink is attached in Figma by hand. Single
row, vertically centred via `dominant-baseline`, transparent background.

### Title banner (reusable — `make-title-banner.mjs`)
A **video title bar** to sit on top of a board: a white rounded bar with a bold
**yellow left accent bar**, a small kicker (yellow-dark), the title (Bricolage
ink), and the logo right. Free-size (W matches the boards so it aligns; resize in
Figma). Edit `KICKER`/`TITLE`.

### Frosted veils / reveal covers — translucency, NOT blur (`make-reveal-covers.mjs`)
A **true blur is an SVG `<filter>`, which breaks the plugin import** (rule 5). So a
"reveal cover" is a **translucent white panel** — `fill="#FFFFFF"` +
`fill-opacity` ≈ 0.82 + a faint border (`fill-opacity`/`stroke-opacity` are flat
attributes, allowed; a `<filter>` is not). Content underneath reads as a faded
hint. For **real frosted glass**, the panel is designed to take Figma's native
**Effects → Background blur** after import (that's Figma's effect, never baked into
the SVG). Reuse this veil for any "reveal one by one on camera" moment. To *show*
the effect on a board, put a **colour band** (not white content) under the veil so
the frosting is visible.

### Decorative brand marks are NOT a default (Chintan, 2026-07-21)
Do **not** reflexively add the **soundwave signature footer** (or other decorative
brand patterns) to a board. Add it **only when Chintan asks or when it clearly
fits**. The **logo** is welcome as a brand mark; the soundwave is opt-in. (It's on
`synva-chapters.svg` + `synva-framework.svg` and stays there — fine in place — but
new boards start without it.)

### Hook board
For a video, ship a compact **"at a glance" hook** alongside the full board: the
frozen headline specs only, **landscape**, self-contained (drops into After
Effects or a Figma/FigJam board). Reference: `styletto-ix-hook.svg`.

### Chapters / agenda board (reusable across videos)
The "what we'll cover" card shown near the start of a video. **Built as a reusable
generator** (`make-chapters.mjs`) — edit a `CHAPTERS` array (each: `icon`, `title`,
`sub`) and it lays out cleanly for 2 or 3 chapters; the tile row and canvas grow
with the count, tile heights stay uniform. Anatomy: a header block (a yellow-light
eyebrow pill + a Bricolage headline + the short yellow underline bar) with a quiet
`synva` signature, then one white rounded **chapter tile** per chapter. Each tile =
top row of a **yellow-light icon tile** (Lucide `<path>`, yellow-dark glyph, left)
+ a **big yellow chapter number** (Bricolage, right), a hairline divider, then the
title (Bricolage ink) + sub (Inter muted), and a small yellow accent bar at the
bottom. Copy-only by default (no live data) — an agenda card doesn't need real
numbers; bake a live "pairs from ₹X" only if asked. Reference:
`synva-chapters.svg`.

## Maintaining this file
Board-styling decisions (palette use, layout patterns, disc/legend treatment,
import-safety constraints) live **here**, bumped with a Version + Changelog row in
the same change — never in the website's own `DESIGN.md`. Architecture/pipeline →
[CLAUDE.md](./CLAUDE.md); the step-by-step how-to → the skill.

## Changelog
| Version | Date | Change |
| --- | --- | --- |
| 1.2 | 2026-07-22 | **Recorded the budget-level colour code** (Essential = blue / Good to have = yellow / Premium = purple, from the site's `PICK_LEVEL_BADGE`, with the ₹/₹₹/₹₹₹ cue — distinct from the framework's step coding), that **raster illustrations may be embedded** as PNG `<image>` (via the updated plugin), and the **lifestyle / recommendation board** pattern (three budget-level columns, model cards or video-thumbnail placeholders, conditional note-boxes, vertically-centred content). |
| 1.1 | 2026-07-21 | **Recorded that boards are FREE-SIZE** (Chintan: no fixed video-frame constraint — size to content, scale/place in Figma) as a new "Canvas & size" section, and added the **Chapters / agenda board** pattern (reusable `make-chapters.mjs` generator: icon-tile + big-number tiles, adaptive for 2–3 chapters). |
| 1.0 | 2026-07-21 | **Created the board visual spec** as part of splitting the Figma-board workflow off from the website docs (Chintan's ask). Records the board palette (strictly website tokens, yellow-forward, one non-token exception for real finish colours), type (Bricolage/Inter, single font-family), import-safe constraints (flat fills only, vector icons, real SVG centring), the headline-specs-first comparison anatomy, the value-not-shade rating discs, and the hook-board format. References the website tokens rather than duplicating them. Uncommitted (root rule 8). |
