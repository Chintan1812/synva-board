# Synva Boards — Claude Code Context

> **Version: 2.0 — 2026-07-27** · functional/architectural source of truth for the
> **Figma-board workflow**. Visual/design decisions live in [DESIGN.md](./DESIGN.md);
> the operational procedure lives in the
> [`figma-board-svg` skill](./.claude/skills/figma-board-svg/SKILL.md).
>
> ⚠️ **This is NOT the website.** The website has its own repo one folder up, with its
> own `CLAUDE.md` and `DESIGN.md`. Board notes go **here**, website notes go **there**.
> What this repo reads from the website, and where: [WEBSITE.md](./WEBSITE.md).

## What this is
A standalone repo that produces **website-styled SVG boards** for Figma / FigJam. They
are **video props**: Chintan imports a board onto a canvas and talks or scribbles over
it on camera (comparison walk-throughs, brand assets, trailer hooks). Board-making is
continuous and long-term, one or more boards per YouTube video. It has nothing to do
with the live storefront.

## How this repo relates to the website
It lives beside the website and the Admin app:

```
~/Dev/synva/
├── Synva Webiste - 2.0/         the website (note the typo in the folder name)
├── Consultation PDF Generator/  the Admin app / product CMS
└── Synva Boards/                here
```

The coupling is **live reference, never a copy** — a board reads the real logo, the real
soundwave, the real lifestyle illustrations and the real catalogue data at generation
time, so it can never be built against a stale snapshot. The website path is resolved in
[`lib/paths.mjs`](./lib/paths.mjs) (sibling folder by default, `SYNVA_WEB_REPO` to
override); if it is missing, a generator fails immediately and says so.

**One deliberate exception:** [`lib/tokens.mjs`](./lib/tokens.mjs) mirrors the brand
palette as literal hex, because a generated SVG needs literal strings and `globals.css`
cannot be imported by Node. It is one file, not eleven. If the palette changes on the
site, update it here in the same pass, then `npm run boards:all`. See
[WEBSITE.md](./WEBSITE.md).

**The database is read-only from here.** Anon/publishable key only. That DB is shared
with the website *and* the Admin app, so any schema or data change is a two-app change
and belongs in the Admin app.

## Repo layout
| Path | What |
| --- | --- |
| `boards/brand/` | reusable board assets, good on any video |
| `boards/<video-slug>/` | one folder per video (currently `styletto-ix/`) |
| `scripts/brand/`, `scripts/<video-slug>/` | the generator per board, mirroring `boards/` |
| `scripts/_all.mjs` `_verify.mjs` `_new-board.mjs` | tooling (see Commands) |
| `scripts/supabase-mcp.sh` | starts the Supabase MCP `--read-only`, wired in `.mcp.json` |
| `lib/` | `paths` · `tokens` · `icons` · `svg` · `brand` · `supabase` |
| `figma-plugin/` | the Figma desktop plugin (SVG → editable text + vector icons) |
| `.claude/skills/figma-board-svg/SKILL.md` | **the operational rulebook** — read it for any board task |

## Commands
| Command | Does |
| --- | --- |
| `npm run board:<name>` | regenerate one board (11 of them; see README) |
| `npm run boards:all` | regenerate every board — run after a price change or a token edit |
| `npm run verify [filter]` | lint for import-breakers + render PNGs into `.tmp/` |
| `npm run new-board -- <group>/<name>` | scaffold a generator wired to `lib/`, register its command |

`boards:all` discovers boards from package.json's `board:*` scripts, so a scaffolded
board joins it automatically — there is no list to keep in sync.

## The rules live in the SKILL — read it before any board task
Do **not** re-derive the board rules from prose. The single source of truth for *how* to
build a board is
**[`.claude/skills/figma-board-svg/SKILL.md`](./.claude/skills/figma-board-svg/SKILL.md)**.
Invoke the `figma-board-svg` skill (or read the file) at the start of any board work.
Its hard rules in brief (the skill is authoritative):
1. **Ask first, every time** — confirm exactly what must be visible before generating.
2. **Never hide/cut info** — the board is static (no "+N more", no truncation); there's
   no size limit, manage volume by grouping.
3. **Real data, pulled live** from Supabase (`feature_library.feature_name`, real
   `mrp`/channels/warranty/colours) — never hand-transcribed.
4. **Strictly website tokens** (paper/ink/white/border/muted/subtle/body + yellow
   `#FBD34A` / yellow-light `#FFECBB` / yellow-dark `#4C3205`); the only non-token colour
   allowed is real product finish data. Encode level via the **value** (the digit), never
   an invented shade/heat-ramp. → visual detail in [DESIGN.md](./DESIGN.md).
5. **Figma-import-safe SVG** — single `font-family` (no fallback stacks), vector `<path>`
   icons, **flat fills only** (no gradients/filters), real SVG centring
   (`text-anchor`/`dominant-baseline`, never a hand-tuned x offset).
6. **Feature comparisons = headline specs first, then LEVELS** — frozen consumer order
   Price · Channels · Clarity in noise (`perf_speech_noise` 1-5) · Auto-adaptation
   (`perf_auto_adapt` 1-5) · Warranty; common traits stated once in a highlighted band;
   per-feature `performance_score` shown as number/check/dash, not just presence.
7. **For a video, ship the full board AND a compact hook** (headline specs only,
   landscape, self-contained).

`npm run verify` mechanically enforces the parts of rules 4 and 5 that a machine can
check. It is a floor, not a substitute for reading the skill.

## Pipeline
1. **Ask** what must be visible (skill rule 1).
2. **Query Supabase** live for the complete data (MCP `execute_sql`, or `rest()` from
   `lib/supabase.mjs` inside the generator).
3. **Generate** — `npm run new-board -- <group>/<name>` for a new one, then build it up.
   The generator is the artifact: it stays in `scripts/` so the board is reproducible.
   Note the data-pull date in the file header.
4. **Verify** — `npm run verify <name>`: lint must pass, then open the PNG in `.tmp/` and
   check nothing wraps or overflows, everything required is present, digits sit
   dead-centre in discs, and every colour is a brand token.
5. **Hand over** — import via `figma-plugin/` (Choose SVG file) for editable text +
   vector icons, or drag the `.svg` into Figma/FigJam.

## Boards built

### `boards/brand/` — reusable across videos
- **`synva-chapters.svg`** (`board:chapters`) — the "what we'll cover" agenda card.
  Icon-tile + big-yellow-number tiles, a per-tile chapter **progress track**, the **real
  Synva logo** top-right + the **soundwave signature** footer (both read live from the
  website's `public/brand/` and inlined flat). Copy-only; edit the `CHAPTERS` array
  (2–3 entries: `icon`/`title`/`sub`) and re-run.
- **`synva-framework.svg`** (`board:framework`) — the homepage **3-step framework**
  mirrored for the board (source: the website's `how-it-works.tsx` + its data file):
  three **colour-coded step panels** — 01 hearing (yellow) / 02 lifestyle (blue) / 03
  budget (green), the site's intentional three-lens coding, which is the valid reason to
  use non-yellow token families here — each with a text column + three white cards,
  chained by **carry-forward connector pills**. Step 01's device *photos* can't be
  raster-embedded, so those tiles lead with the device-type name + a unifying `ear` icon.
- **`synva-title-banner.svg`** (`board:title-banner`) — a video title banner to sit on
  top of a board: white rounded bar, bold yellow left accent, kicker + title, logo. Edit
  `KICKER`/`TITLE`, re-run.
- **`synva-reveal-covers.svg`** (`board:reveal-covers`) — a **frosted-veil kit**:
  translucent cover panels Chintan drops over board content and deletes one by one to
  reveal, on camera. A true blur is a `<filter>` (breaks import), so a veil is a
  **translucent white panel** (`fill-opacity`, a flat attribute — allowed); for real
  frosted glass, add Figma's **Effects → Background blur** to a veil after import. Sheet
  includes a live demo + grab-able veils at 4 sizes.
- **`synva-cta-pill.svg`** (`board:cta`) — a soft CTA pill for the "want to see for
  yourself?" beat: a hands-on cursor icon + an invite line + `synva.io` + an up-right
  arrow. Deliberately NOT "reach out / book now" — an open "go explore it yourself"
  invitation (Chintan 2026-07-23). The URL is its own text node; Chintan attaches the
  hyperlink in Figma. Edit `INVITE`/`URL_TEXT`/`ICON`.
- **`synva-swatches-editable.svg`** (`board:swatches`) — brand colour swatch strip
  (eyedropper source), built **from `lib/tokens.mjs`**, so it is always the live palette.
- **`synva-swatches.svg`** — the same strip with text outlined, as a
  guaranteed-render fallback. **It has no generator** (it predates the scripts); it is
  kept as an artifact. Regenerate it by hand if it is ever needed again.

### `boards/styletto-ix/` — the Styletto IX video
- **`styletto-ix-comparison.svg`** (`board:styletto-features`) — the flagship board:
  headline band (Price / Channels / Clarity-in-noise / Auto-adapt / Warranty) → "common
  to every IX" paper band → full **47-feature** matrix in 7 categories with 1-5 levels +
  colour swatches. FT-068/069 excluded (streaming is covered by the Bluetooth line).
  Strictly Synva-token palette, centred disc digits. Live Supabase.
- **`styletto-ix-hook.svg`** (`board:styletto-hook`) — the compact trailer HOOK: the 5
  headline specs across the 5 models, landscape 1282×550, self-contained for After
  Effects or a Figma/FigJam board. Live Supabase.
- **`styletto-ix-compare.svg`** (`board:styletto-compare`) — the compact "what each tier
  adds" ladder view. Data baked in (pulled 2026-07-21).
- **`synva-styletto-colours.svg`** (`board:styletto-colors`) — **colour cards**, one per
  finish: the **real device render** in that colour + a two-tone swatch dot + name + a
  row of **version chips** (1IX 2IX 3IX 5IX 7IX, available lit / unavailable dimmed).
  ALL live: colours + availability inverted to colour→versions, and the per-finish render
  pulled from Supabase Storage matched by `images.color_id` (DB-authoritative image↔finish
  mapping, no guessing), webp trimmed → embedded PNG. 7 finishes (2 on every version, 5
  only on 3IX/5IX/7IX). ~1.6 MB.
- **`synva-lifestyle-{quiet-cozy,social,dynamic}.svg`** (`board:lifestyle`) — **"which
  Styletto IX to buy for your lifestyle"**, one board per lifestyle. Three budget columns
  **Essential (blue) / Good to have (yellow) / Premium (purple)** with the `₹/₹₹/₹₹₹`
  relative-cost cue — colours + labels straight from the website's `browse.ts`
  `PICK_LEVEL_BADGE`/`PICK_LEVEL_LABEL` (Chintan asked to honour them). Each maps the
  Styletto IX line (1IX–7IX) to a level per Chintan's spec (with the 2IX **tinnitus**
  conditional as a tinted note); model cost is the ₹-cue, not MRP. The **real lifestyle
  illustration is embedded** (the website's `public/images/hearing-aids/lifestyle-*.webp`
  → PNG data-URI); YouTube slots are placeholders.

## Plugin: resizing
- **Individual shapes** (a grabbed veil/rect) resize freely — every created node gets
  `constrainProportions = false`.
- **The whole board** is grouped with `constrainProportions = true` (aspect locked) so a
  corner-drag scales it uniformly instead of stretching one axis and **breaking the pill
  labels** (the "1IX/2IX text breaks on resize" bug).
- **Real fix is the Scale tool:** Figma's normal drag-resize does NOT scale font sizes, so
  auto-width text (the chip labels) stays put while the pills stretch. Resize a board with
  the **Scale tool (`K`)**, which scales text too. The build notification + the plugin
  README say this. (Re-run the plugin — no reinstall.)

## Plugin: raster images
`figma-plugin/` extracts an embedded `<image>` and builds a native rectangle with an
**image fill** via `figma.createImage` (Figma's `createNodeFromSvg` won't reliably import
one): `ui.html` decodes the data-URI to bytes, `code.js` builds the node. **PNG/JPEG
bytes only** — embed illustrations as PNG, not webp; `createImage` won't take webp
(`npm run verify` errors on this). The fill uses **`scaleMode: "FIT"`** (contain — the
whole image shows, never cropped; `"FILL"` cover-crops and was the "images zoom in on
import" bug, fixed 2026-07-23). No reinstall needed — the plugin re-reads its files on
each run. Vector-first still holds: use this only for genuine photos/illustrations;
everything else stays flat vector + editable text.

The plugin also honours **`text-anchor`** (middle/end shift the node by its measured
width) and **`dominant-baseline`** (central/middle centre vertically), so a board's real
SVG centring survives the import. In **FigJam** the imported shapes are natively
connectable — hover shows the four connection dots and connectors snap to them (Chintan
builds the video flow in FigJam; working as-is). Optional: wrap the import in
`figma.createSection()` if the WHOLE board should be one connectable unit — not enabled.

## ⚠️ Open DB fix (PAUSED — needs Chintan's go-ahead)
Styletto IX `loss_range` in Supabase says **"Mild to Profound" but is WRONG — should be
`LR-0003` "Mild to Severe"** (Styletto only takes S/M/P receivers; HP incompatible → no
Profound; for Profound, Pure fits). This is **shared-DB data that also affects the live
website** — treat it under the website's rule 12 (one DB, two apps). Script written but
**NOT run**, and it lives in the Admin app, not here:
`../Consultation PDF Generator/scripts/fix-styletto-loss-streaming.mjs` (dry-run default,
`--commit` to apply, service key; PATCHes the 10 Styletto IX rows HA-005..001 + CROS
HA-084..080). The **streaming half is now moot** (Chintan removed streaming from the
board) — if running, do the `loss_range` PATCH only. Don't run without his explicit
go-ahead. The board itself already renders the correct "Mild to Severe" via a hardcoded
override in `scripts/styletto-ix/make-features.mjs`; **remove that override once the DB
is fixed.**

## Workflow rules that carry over from the website
- **Never commit unless Chintan explicitly asks.** Leave work uncommitted for him.
- **Any Supabase schema/data change is a two-app change** — this DB is shared with the
  website and the Admin app; verify both sides. The loss_range fix above is exactly this
  case, and it belongs in the Admin app.
- **Ask before substituting a blocked tool** — if the plugin, sharp or the Supabase MCP is
  down mid-task, ask rather than silently swapping a fallback.
- **No en/em dashes in user-facing copy** (board text included) — comma, colon, period, or
  "to" for ranges. The `·` middot separator is fine.

## Maintaining this file
This is a **living document** for the board workflow. When a board-workflow decision,
dependency, script, or convention changes: update the relevant section here **in the same
change**, bump the Version, add a Changelog row. Keep it out of the website's docs.
Visual/board-styling decisions go in [DESIGN.md](./DESIGN.md); the operational how-to
stays in the skill; what to read in the website repo goes in [WEBSITE.md](./WEBSITE.md).

## Changelog
| Version | Date | Change |
| --- | --- | --- |
| 2.0 | 2026-07-27 | **Moved out of the website repo into its own standalone repo at `~/Dev/synva/Synva Boards` (Chintan's decision, planned since 1.1).** (1) **Coupling to the website is now live reference, not a copy** — new `lib/paths.mjs` resolves the repo root from `import.meta.url` and the website from the sibling folder (`SYNVA_WEB_REPO` overrides), so nothing hardcodes an absolute path and nothing writes back into the website. Two errors in the old migration checklist were found and fixed: the hardcoded website path was in **11 scripts, not 3** (missing 8 would have silently kept writing SVGs into the website repo), and **`sharp` was never a website dependency** — it only resolved transitively via `next`, so it is now an explicit pinned dep. Both `lucide-react` and `sharp` are pinned to exact versions because the generators deep-import Lucide's internal `__iconNode` shape. (2) **Shared `lib/`** — tokens, icon loader, SVG text/centring helpers, brand-asset inlining and the Supabase reader were extracted out of the 11 scripts, which each used to re-declare them. **Verified by regenerating all 14 boards and byte-diffing against the committed originals: all 14 identical.** (3) **Structure** — `brand/` (reusable) vs one folder per video, with `scripts/` mirroring `boards/`. (4) **Tooling** — a `board:*` command per board, `boards:all` (discovers boards from package.json, nothing to keep in sync), `verify` (renders a PNG **and** errors on the import-breakers: font fallback stacks, non-board fonts, gradients/filters/masks, non-PNG embeds, a missing xlink declaration; warns on non-token colours since a real device finish is legitimately off-palette), and `new-board` (scaffolds a generator wired to `lib/` and registers its command). (5) **New [WEBSITE.md](./WEBSITE.md)** — the map of what to read in the website repo and the rule that `lib/tokens.mjs` is the one mirror that must be re-synced by hand. (6) Its own `.env.local` (4 read-only keys) + `.mcp.json` for the read-only Supabase MCP. (7) The plugin moved to `figma-plugin/` — **Chintan re-imports it once in Figma desktop from the new manifest path**. |
| 1.2 | 2026-07-22 | **Two new boards + the plugin learned raster images.** (1) `synva-chapters.svg` (reusable agenda/chapters card) + `synva-framework.svg` (the homepage 3-step framework mirrored). (2) `synva-lifestyle-{quiet-cozy,social,dynamic}.svg` — "which Styletto IX for your lifestyle", three per-lifestyle boards, Essential/Good/Premium columns in the site's blue/yellow/purple `PICK_LEVEL_BADGE` colours + ₹/₹₹/₹₹₹ cue, with the real lifestyle illustration **embedded as PNG**. (3) To make that embed reliable, **the plugin now extracts `<image>` and builds a native image fill** (`figma.createImage`, PNG/JPEG only). (4) Recorded in DESIGN.md: boards are free-size; the soundwave footer is **opt-in, not a default** (Chintan). |
| 1.1 | 2026-07-21 | **Decided: board work is continuous/long-term and MOVES to its own sibling repo after the current recording batch** (Chintan). Replaced the "why it stays in-repo" framing (v1.0) with "Status: in-repo now, moving soon" + a step-by-step **Planned migration** checklist. Corrected the dependency read from v1.0: tokens are *hardcoded* (not a live import), `REPO` is a hardcoded absolute path, and only 2 public env vars + a one-time plugin re-import are needed. Interim: keep building boards in-repo while recording. |
| 1.0 | 2026-07-21 | **Split the Figma-board workflow into its own doc set** (this file + [DESIGN.md](./DESIGN.md)), separate from the website's root docs, so board notes never mix with website notes (Chintan's ask). Recorded: what the boards are, where the pieces live, the pointer to the authoritative skill, the boards built, and the paused Styletto `loss_range` DB fix. |
