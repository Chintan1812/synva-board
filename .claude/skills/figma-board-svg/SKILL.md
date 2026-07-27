---
name: figma-board-svg
description: >
  Create website-styled SVG boards for Figma/FigJam — comparison tables, brand
  assets, and video-explainer boards that Chintan imports via the
  Figma plugin in this repo (Choose SVG file) or by dragging into Figma Design. The
  boards use the Synva website's design language with editable text + vector
  icons. Use whenever Chintan asks to create/generate an SVG, a comparison
  table, a swatch/brand asset, a "board" for a video, or to "make it look like
  the website" for Figma. Triggers: "create an SVG", "comparison table",
  "figma board", "board for the video", "export to figma", "SVG that looks like
  the website".
---

# Figma board SVG

Author on-brand SVG boards that import into Figma/FigJam with **editable text and
editable vector icons**. These are video props Chintan talks over, and the
comparison board especially is where he spends most of the video — so
**completeness and legibility beat brevity**.

## Rule 1 — ASK FIRST, every time (non-negotiable)

Before generating anything, ask Chintan and wait for the answer:

1. **What information must be visible on this board?** Name every field / section.
2. **Is there anything specific you need included** that I might not think of?
3. Confirm the full scope — nothing gets decided by assumption.

The board is a static prop he narrates over. Missing or hidden info is a real
failure, so this question is mandatory even when the request seems obvious.

## Rule 2 — NEVER hide or cut information

- The board is **static**. There is **no "+N more", no lightbox, no accordion,
  no "see all", no truncation** — nobody can click to reveal anything. Whatever
  belongs on the board must be **rendered visibly**.
- **There is no size constraint on a Figma board.** Make the SVG as tall/wide as
  it needs to be to show everything. Big is fine; incomplete is not.
- Manage volume with **grouping/categorisation** (e.g. features by
  `feature_category`, section headers, a shared-traits strip), never by dropping
  content.

## Rule 3 — Real data, pulled live

- Pull from **Supabase at author time** — catalogue feature names
  (`feature_library.feature_name`, NOT plain-English), live `mrp`/channels/
  warranty, colours. Query live (MCP `execute_sql`, or `rest()` from
  `lib/supabase.mjs` inside the generator); **do not hand-transcribe** — that is
  how features get missed.
- Bake the pulled result into the generator output and note the pull date.
- The DB is **read-only** from this repo and is shared with the website and the
  Admin app. Never write to it; raise a needed change instead.

## Rule 4 — Website design language, STRICTLY brand tokens

- Use **ONLY** the Synva tokens, imported from `lib/tokens.mjs` (never retyped as
  literals in a generator) — no invented tints, heat-ramps, or off-brand shades
  (Chintan's hard rule, 2026-07-21):
  paper `#FAF8F4`, ink `#1A1A1A`, white `#FFFFFF`, border `#E8E4DC`,
  muted `#4F4F4F`, subtle `#6B6B6B`, body `#3A3A3A`,
  yellow `#FBD34A`, yellow-light `#FFECBB`, yellow-dark `#4C3205`.
  (Other brand hues exist — purple/green/blue/orange + light/dark — but boards are
  yellow-forward; reach for another only with a reason.)
- **The ONLY non-token colour allowed is real product data** — e.g. a device's
  actual finish colour on a swatch (`colors.hex_primary/secondary`). Never invent
  a decorative colour outside the palette.
- **Encode level/intensity through the VALUE shown, not an invented shade** — a
  1-5 rating is the *digit*; every rating disc is the single Synva yellow, not a
  gradient of golds (see rule 6).
- **Bricolage Grotesque** for display/headings, **Inter** for body/labels.
- White rounded cards, yellow accents, category headers, chip strips — mirror the
  website's compare-matrix idiom. Highlight band = yellow-light; subtle supporting
  band / flagship-column tint = paper; hairlines + category bands = border.

## Rule 5 — Figma-import-safe SVG (or it breaks)

- **Text:** live `<text>` with a **single** `font-family` — exactly `"Bricolage
  Grotesque"` or `"Inter"`. **NEVER a CSS fallback stack** (`"Inter, Arial,
  sans-serif"`) — Figma's importer mis-sizes stacked-font text and wraps it.
- **Icons:** vector `<path>` from Lucide, via `loadIcons()` in `lib/icons.mjs`
  (it reads `__iconNode` out of this repo's own pinned `lucide-react`). Editable
  vectors.
- **Flat fills / strokes ONLY. No `<filter>`, no gradients** (linear/radial) —
  they break `figma.createNodeFromSvg` and the plugin. Two-tone swatches = two
  half-disc flat paths, never a gradient. No drop-shadows; use a border instead.
- **Centre text with real SVG centring, never a hand-tuned offset.** The plugin
  honors `text-anchor` and `dominant-baseline`: for a centred column value use
  `text-anchor="middle"` with `x = centre`; for a glyph centred inside a disc (a
  score digit) ALSO add `dominant-baseline="central"` with `y = centre`.
  Left-aligned text keeps the default `text-anchor="start"` / plain x. Do NOT
  approximate centring with `cx - halfGlyphWidth` — it drifts per digit/font
  (this was a real bug Chintan flagged, 2026-07-21).

## Rule 6 — Feature comparisons: headline specs first, then LEVELS

For any hearing-aid model comparison, the board has three tiers of content, in
this order:

**a) Consumer headline specs, pinned at the top (FROZEN with Chintan 2026-07-21).**
These are what a buyer actually decides on, and they are what differs across a
line, so they lead — before the deep feature matrix:

1. **Price (MRP)**
2. **Channels**
3. **Clarity in noise** (speech-in-noise, the single biggest real-world reason
   people buy) — from `hearing_aid_models.perf_speech_noise`, shown as a 1-5 level
4. **Auto-adaptation** (how effortlessly it adjusts as you move) —
   `perf_auto_adapt`, 1-5 level
5. **Warranty**

**b) Common traits, stated ONCE in a highlighted band** ("the comment section").
Anything identical across every model (rechargeable, Bluetooth / phone streaming
to iPhone + Android, form factor, fitting range + receivers, app + remote care)
is stated a single time in a highlighted strip, NOT repeated per column. It must
still be **prominent** (a filled light-yellow band), not buried. Do not list
direct-streaming as separate features when a "Bluetooth to iPhone + Android" line
already covers it.

**c) The full categorised feature matrix** — every feature, real catalogue names,
grouped by category (rules 2 + 3).

**SHOW THE PERFORMANCE LEVEL, not just presence.** A feature can be *present at a
different level* on different tiers (`model_features.performance_score`, 1-5) —
e.g. RealTime Conversation Enhancement, SoundSmoothing™ scale 1→5 up the line.
That gradient is the entire point of the comparison, so a plain checkmark
everywhere hides the difference between two models. Render **three cell states**:
- a **number 1-5** in a **single Synva-yellow disc** when the row has a
  `performance_score` — the *digit* shows the level, never a heat-tinted ramp of
  golds (that breaks the strict-token rule, 4),
- a **check** in a **yellow-light disc** when included but ungraded (`performance_score` null),
- a **dash** (subtle) when the model does not have the feature at all.
Sort each category **varies-first** so the tier-differentiating rows sit on top,
and always include a **legend** (number = level, check = included, dash = not
available). Also show **colour swatches** per model (two flat half-disc paths for
two-tone finishes — no gradients, rule 5).

## Rule 7 — For a video, ship the full board AND a compact hook

The full comparison board is what Chintan talks over. For the hook / trailer he
also wants a **small "at a glance" version**: the frozen headline specs only
(rule 6a) across the models, landscape, self-contained (drops into After Effects
or a Figma/FigJam board). Reference pair: `boards/styletto-ix/styletto-ix-comparison.svg`
(full) + `styletto-ix-hook.svg` (hook), from `scripts/styletto-ix/`.

## Pipeline

1. **Ask** (rule 1).
2. **Query Supabase** for the real, complete data.
3. **Generate** — `npm run new-board -- <group>/<name>` scaffolds a generator
   already wired to `lib/` (tokens, icons, brand assets, output path) and
   registers its `board:*` command. Use `brand` as the group for a reusable
   asset, otherwise the video's slug. The script stays in `scripts/` so the board
   is reproducible; note the data-pull date in its header. Run it with
   `npm run board:<name>`.
4. **Verify** — `npm run verify <name>`. It errors on the import-breakers (font
   fallback stacks, non-board fonts, gradients/filters/masks, non-PNG embeds) and
   warns on any non-token colour, then renders a PNG into `.tmp/`. **Then Read the
   PNG** — the lint cannot see layout. Check: nothing wraps/overflows, every
   required item is present, columns align, and **digits sit dead-centre in their
   discs**.
5. **Hand over** — import via `figma-plugin/` (Choose SVG file) for editable
   text + vector icons, or drag the `.svg` into Figma/FigJam.

## Plugin notes

- `figma-plugin/` rebuilds `<text>` as native editable **auto-width** text
  and graphics via `createNodeFromSvg`, then flattens to one group (double-click
  to edit any element). Text baseline offset ≈ `fontSize * 0.82`.
- **The plugin honors `text-anchor` (`middle`/`end` shift the node by its measured
  width) and `dominant-baseline` (`central`/`middle` centre vertically)** — so the
  board matches the SVG's centring exactly. Re-running the plugin re-reads its
  files, so **no reinstall after editing `code.js`/`ui.html`** — just run it again.
- Editable text needs the font present in Figma — Bricolage Grotesque and Inter
  both ship in Figma, so no install.
- **FigJam connectors:** the imported shapes are natively connectable — hover
  shows the four connection dots and connectors snap to them, no extra work
  (Chintan builds the video flow in FigJam). If the WHOLE board should be one
  connectable unit (one section you wire to, not an inner rectangle), wrap the
  import in a `figma.createSection()` — optional, NOT enabled by default; grouping
  is loose/skipped in FigJam. Working as-is per Chintan (2026-07-21).
