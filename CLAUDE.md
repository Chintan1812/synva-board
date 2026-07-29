# Synva Boards — Claude Code Context

> **Version: 2.4 — 2026-07-28** · functional/architectural source of truth for the
> **Figma-board workflow**. Visual/design decisions live in [DESIGN.md](./DESIGN.md);
> the operational procedures live in the five skills under
> [`.claude/skills/`](./.claude/skills/) — `video-topic` → `video-research` →
> `video-hook` → `video-mindmap` → `figma-board-svg`.
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
├── Synva Webiste - 2.0/            the website (note the typo in the folder name)
├── Consultation PDF Generator/     the Admin app / product CMS
├── YouTube Script Generator Agent/ word-for-word scripts; we read its brand voice
└── Synva Boards/                   here
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

**The script-generator repo is read-only from here too.** `scriptRepo()` in
[`lib/paths.mjs`](./lib/paths.mjs) resolves `YouTube Script Generator Agent/`
(`SYNVA_SCRIPT_REPO` overrides) so the `video-research` skill can read Chintan's
brand-voice baseline live instead of forking a 5,000-line file. **Never write into it** —
new framings observed during a run are recorded in this repo's own `01-research.md`.
That repo still owns word-for-word scripting (hinglish, midsection); this repo owns the
boards. Chintan is **not writing word-for-word scripts for board videos** — the mind map
replaces the script (his call, 2026-07-27).

## Repo layout
| Path | What |
| --- | --- |
| `videos/<video-slug>/` | **the planning artifacts** per video: `00-topic` `01-research` `02-hook` `03-mindmap` `mindmap.json`. Markdown + JSON only |
| `boards/brand/` | reusable board assets, good on any video |
| `boards/<video-slug>/` | one folder per video (currently `styletto-ix/`) |
| `scripts/brand/`, `scripts/<video-slug>/` | the generator per board, mirroring `boards/` |
| `scripts/_all.mjs` `_verify.mjs` `_new-board.mjs` `_new-video.mjs` | tooling (see Commands) |
| `scripts/supabase-mcp.sh` | starts the Supabase MCP `--read-only`, wired in `.mcp.json` |
| `lib/` | `paths` · `tokens` · `icons` · `svg` · `brand` · `supabase` · `youtube` |
| `videos/TOPIC-SLATE.md` | the standing slate of researched video topics, evidence-backed |
| `videos/LEAD-CAPTURE.md` | the bonus/gate/nurture decision + DPDP consent rules — read before designing any lead magnet |
| `figma-plugin/` | the Figma desktop plugin (SVG → editable text + vector icons) |
| `.claude/skills/` | **the operational rulebooks** — five skills, see below |

## Commands
| Command | Does |
| --- | --- |
| `npm run new-video -- <slug> "Title"` | start a video: creates `videos/<slug>/00-topic.md` + the pipeline checklist |
| `npm run board:<name>` | regenerate one board (11 of them; see README) |
| `npm run boards:all [filter]` | regenerate every board, or just those matching a filter (this is how a video's boards get built **in phases** — the filter is a substring of the `board:*` name) |
| `npm run verify [filter]` | lint for import-breakers + render PNGs into `.tmp/` |
| `npm run new-board -- <group>/<name>` | scaffold a generator wired to `lib/`, register its command |

`boards:all` discovers boards from package.json's `board:*` scripts, so a scaffolded
board joins it automatically — there is no list to keep in sync.

## The video pipeline — topic → mind map → boards
A board video goes through **five skills, in order**. Each reads the file the previous
one wrote, all under `videos/<slug>/`:

| # | Skill | Reads | Writes |
| --- | --- | --- | --- |
| 0 | [`video-topic`](./.claude/skills/video-topic/SKILL.md) | YouTube Data API (facts) + vidIQ MCP (insight) | `00-topic.md` — the demand evidence + the chosen title |
| 1 | [`video-research`](./.claude/skills/video-research/SKILL.md) | topic + live Supabase + ClickUp + brand voice | `01-research.md` — catalogue facts + strategy brief (1SD pain, viewer moment, funnel stage) |
| 2 | [`video-hook`](./.claude/skills/video-hook/SKILL.md) | `01-research.md` | `02-hook.md` — the 30 seconds + what's on screen + loop anchors |
| 3 | [`video-mindmap`](./.claude/skills/video-mindmap/SKILL.md) | both, + Chintan's experiential answers | `03-mindmap.md` + `mindmap.json` — **the board manifest** |
| 4 | [`figma-board-svg`](./.claude/skills/figma-board-svg/SKILL.md) | `mindmap.json` | `boards/<slug>/*.svg` |

**The mind map replaces the script.** Chintan does not write or read a word-for-word
script for these videos — he lays the boards out in FigJam, connects them with
connectors, and talks over the map on camera (his decision, 2026-07-27). Three things
follow, and they are why `video-mindmap` exists rather than a flat board list:
- **A beat that isn't a node doesn't happen.** The retention structure carried over from
  the script repo's midsection framework (common-traits-before-deltas, additive framing,
  honest tier-delta, one limitation per model, the turn, loop close, consultation pivot)
  is expressed as **required nodes**, and re-hooks become **branch transitions**.
- **It's a graph, not a slide order.** Nodes have kinds (`root`/`branch`/`leaf`/`aside`/
  `exit`) and edges have meaning (`leads-to`/`supports`/`contrasts`/`closes-loop`). The
  plan states the traversal explicitly, because a mind map read in the wrong order is
  chaos on camera.
- **Each node carries a talk track** — 2-4 bullets Chintan speaks from, kept **in the
  plan, never printed on the board**. The board stays a clean visual prop.

Shape: **3-4 dense hub boards + 6-8 light leaves, 9-14 nodes** (Chintan's pick,
2026-07-27). Build them all with `npm run boards:all <slug>` or in phases with a
narrower filter; the plan lists the phases.

The experiential inputs (**meaningful vs marginal per tier, one honest limitation per
model, the tier map per persona, which features actually move the needle, the anchor
model**) come **only from Chintan** — never from specs, the catalogue, or the web. They
are asked as one batched message before the map is written, and anything unanswered
stays a visible `[ASK CHINTAN: …]` placeholder.

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
   **manufacturer-verifiable only** (Price per pair after discount, never the discount
   %; Channels; Bluetooth; Rechargeable; Warranty). Synva's own `perf_*` 1-5 ratings are
   **not vendor specs** and live in a separate labelled "Synva's assessment" panel
   (Chintan, 2026-07-28); common traits stated once in a highlighted band;
   per-feature `performance_score` shown as number/check/dash, not just presence.
7. **For a video, ship the full board AND a compact hook** (headline specs only,
   landscape, self-contained).
8. **Embed the REAL Phonak render, 1:1, black first then beige, and only where SHAPE is
   the argument** (Chintan, 2026-07-29). `renderDataUri()` in
   [`lib/phonak-renders.mjs`](./lib/phonak-renders.mjs) resolves a catalogue model to a
   real render from the Admin app's Phonak Target library (481 deduplicated 600×600
   PNGs, read live via `phonakImages()`), and `imageSlot({ uri, uriScale })` places it in
   a square. Images belong on `brand/form-factors`, `cheezein` and `band1l` — boards
   whose argument *is* the body. They do **not** belong on argument boards (`band50`,
   `dontbuy`, `entry`, `turn50`, `mrp-note`, …): three RICs that look alike would imply
   the difference is cosmetic, the opposite of the point. Consistency is **by board
   type**, so a mixed set reads as intentional.
   - **`uriScale` is load-bearing.** Phonak shoots each render at its own zoom, so at
     1:1 every device fills its frame and **a CIC comes out looking bigger than a RIC**.
     Scale by `FORM_FACTOR_SCALE` / `scaleFor()` or the picture contradicts the words.
   - Resolve on the **catalogue `model_name`**, never a card's display label, and trust
     `used_by_models` over the filename — Phonak reuses housings, so Terra+ RIC-R
     legitimately resolves to an `Audeo-Lumity-R` file.
   - PNG only (Figma's `createImage` rejects webp), and pass `xlink: true` to
     `writeBoard` on any board with an `<image>`.
9. **`mrp × 2` is not the pair price when a `unit = 'Pair'` row exists** — 86 models have
   both, and the Pair row is always a cheaper real bundle. Prefer it; never set a doubled
   price beside a bundle price. Full rule in the skill.

`npm run verify` mechanically enforces the parts of rules 4 and 5 that a machine can
check. It is a floor, not a substitute for reading the skill.

## Per-board procedure
(The four-skill video pipeline is above; this is the loop for building one board.)
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
- **`synva-form-factors.svg`** (`board:form-factors`) — **the four shapes, taught once**:
  BTE · RIC · ITC · CIC, biggest to smallest, with the power-vs-visibility trade as a
  scale running under all four. Built because the alternative — one "all products with
  images" board — fails: a viewer cannot hold twelve near-identical hearing aids in their
  head, and by the time a model is named that board is long off screen. What a viewer
  genuinely cannot follow is not *which model* but *what BTE and CIC mean*. Four items,
  actually distinct, and the vocabulary is reused in every hearing-aid video. Reserved
  1:1 slots; the representative model per shape is a real catalogue row matched through
  `model_images` → `images`. Adding a fifth shape (ITE/IIC/Slim-RIC all exist with
  images) is one more entry in `SHAPES`.
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

## ✅ Phonak catalogue synced to the June 2026 guide (2026-07-28) — one item still open
Applied from the Phonak *Price & Reference Guide, June 2026*, via the Admin app:
**58 rows repriced · 8 ChargerGo rows created · 14 warranty values corrected**
(10 Terra/Terra+ null → 2 yr, 4 Sphere 3 → 4 yr). Verified: 78/78 catalogue entries match
and **zero null warranty rows remain**.

Script + approved CSVs live in the Admin app —
`scripts/apply-phonak-catalog-diff.ts` (CSV-driven, dry by default, `--commit` to apply),
`data/phonak-2026-06-catalog-diff.csv`, `data/phonak-2026-06-warranty-diff.csv`, plus
dated `.APPROVED-*` copies. **The CSVs' `db_mrp` / `warranty_years` columns are the
rollback record.**

**⚠️ STILL OPEN — 24 DB rows have no price in the June 2026 guide**, left untouched:
16 **Sky L** (paediatric), 4 **Audéo L-312**, 2 **CROS**, 2 **Virto I-Titanium**.
→ **Written up for the Admin app** as `docs/discontinued-phonak-models.md`: the 22 to flag
`status = 'discontinued'` (the Titanium pair is correctly `coming_soon`, not ended), plus
the finding that **the `discontinued` vocabulary already exists end to end** in both apps —
the only gap is the browse-card badge in the website's `queries.ts`, which handles
`coming_soon` and lets discontinued fall through to a normal marketing badge.
**Sky needs a business check first** — 16 paediatric models would leave Synva with no
paediatric Phonak, and it invalidates the children's-hearing idea in
`videos/TOPIC-SLATE.md`, which assumed Synva stocks it.

*(Adjacent, probably fine: 4 Signia **CROS transmitters** carry 1 year. Different product
class; a shorter term is plausible there.)*

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
| 2.4 | 2026-07-28 | **The `perf_*` ratings are Synva's, not the manufacturer's — so they leave the comparison** (Chintan, 2026-07-28). `perf_speech_noise` / `perf_auto_adapt` / `perf_speech_quiet` are **Chintan's own 1-5 clinical assessments**; Phonak and Signia neither publish nor compare on them, so a viewer cannot check them and they cannot carry an argument. This **unfreezes the headline-spec row set on 2026-07-21**, two of whose five rows were those ratings. New rule: the headline band is **manufacturer-verifiable only** — Price (per pair, **after discount, and the discount % is never printed**) · Channels · Bluetooth · Rechargeable · Warranty, or whichever ~5 manufacturer specs actually *vary* (platform, technology level, fitting range, form factor all qualify). The ratings move to a **separate bordered "Synva's assessment" panel** (new rule 6d) subtitled *our own 1-5 read, not a manufacturer spec* — keeping the one thing no competitor channel has, an audiologist's verdict, without letting it read as vendor data. Propagated to `figma-board-svg` 6a+6d, `DESIGN.md`, `video-research`, `video-hook`, `video-mindmap`. **The shipped Styletto boards still use the old row and need regenerating.** Found while researching ₹50k vs ₹1L Phonak, where dropping the ratings surfaced three better manufacturer facts they had been masking: Terra has **no Bluetooth at all**, Terra/Terra+ are **disposable-battery** against the ₹1L rechargeable, and they sit on a **different platform (T vs Lumity)** rather than being tiers of one. |
| 2.3 | 2026-07-28 | **Facts from the YouTube Data API, insight from vidIQ** (Chintan's rule): new [`lib/youtube.mjs`](./lib/youtube.mjs) reads `YOUTUBE_API_KEY`/`YOUTUBE_CHANNEL_ID` **live from the website repo's `.env.local`** — the secret is never copied here, so rotating it there just works. Gives `channelVideos` / `longFormVideos` (Shorts filtered by duration), `viewsPerDay` and `ageDays`. It is free, complete, and **more current than vidIQ**, which was still serving a stale title for a video Chintan had renamed. vidIQ credits now go only to what the raw API cannot compute: breakout scores, keyword volume/competition, outlier discovery, title scoring. Two findings recorded in the skill because they are invisible in keyword data and decisive for topic choice: **rank by views/day, never raw views** (view curves are front-loaded, so a newer video with *lower* v/day is genuinely weak, not immature), and **Synva's price-band videos decline monotonically as the band rises** — ₹25k → 17.2 v/day, ₹50k → 12.6, ₹1L → 6.8, against 24.8-54.5 for the whole-ladder "Be SMART" Part 3 format. Also added `videos/TOPIC-SLATE.md`, the standing evidence-backed topic slate, built from the ClickUp buying-series scripts + the live catalogue (**303 models, Phonak and Signia only** — the brand-expansion play is dead, so the series scales *down* into families rather than sideways into brands). |
| 2.2 | 2026-07-28 | **Topic selection got a data source: `video-topic`, a new step 0 on the vidIQ MCP** (Chintan bought the subscription). Until now the pipeline assumed the topic was already chosen — the one step running on instinct while everything downstream ran on live data. Checked first: **there is no vidIQ skill to download** (the only marketplace installed is `claude-plugins-official`, which has none, and vidIQ ships an MCP server rather than a skill), so this one is written against the server. It is already configured as the `claude.ai vidIQ for Claude` connector at `https://mcp.vidiq.com/mcp` and needs **OAuth only** — read-only, ~34 tools, most calls 5 credits and `video_watch` 10. The skill **discovers tool names at run time via ToolSearch** rather than hardcoding them, since the names here came from vidIQ's public docs, not from inspecting the server. Method, in order: real competitive set (`similar_channels`, not assumption) → **outliers** (a video beating its own channel's baseline, which is the real signal, not raw views) → `keyword_research` on 2-3 framings → title candidates + scoring. Budget 8-12 calls. Three limits are written into the skill as rules, because they are where this tool misleads: it is a **lagging indicator** that pulls toward the middle of the distribution, it knows **nothing clinical** (the experiential batch is still Chintan-only), and **thin Indian search volume must be read as direction, not magnitude** — a topic he gets asked weekly in the clinic with no search volume is an opportunity, not a dead end. Standing rule: **the reframe beats the score**, and the disagreement gets recorded rather than resolved in the data's favour. |
| 2.1 | 2026-07-27 | **The repo grew a front end: topic → mind map → boards, as three new skills.** Chintan's ask — pull the *research* and *hook* skills out of `YouTube Script Generator Agent`, leave the word-for-word scripting behind, and add the planning layer that turns a researched topic into many boards. (1) **`video-research`** — ported from that repo's `topic-deep-dive` with its orchestrator's strategy half folded in, and **retargeted from the Google Sheet to live Supabase**: every tab the sheet held (`hearing_aid_models` · `feature_library` · `model_features` · `colors` · `images` · `lifestyle_profiles` · `brands`) was verified present in the DB this repo already reads, so the service-account JSON, the Python fetch script and the schema cache are all gone along with the second source of truth. (2) **`video-hook`** — the 4-layer philosophy ported intact, plus a new ON SCREEN section (the on-screen line, the hook board, and a **loop anchor per open loop**), because with no script the hook is a visual beat too. (3) **`video-mindmap`** — new, the centrepiece: **Chintan is not writing word-for-word scripts for board videos, so the FigJam connector map *is* the script.** It emits `03-mindmap.md` + `mindmap.json` — a node/edge graph, a talk track per node, the loop ledger, the reveal plan, the `col`/`row` canvas layout and the build phases. It carries over the retention structure and the "STOP — ask Chintan" experiential batch from that repo's `midsection` skill, and nothing else from it. (4) **Cross-repo coupling is live reference again, never a copy** — new `scriptRepo()`/`brandVoice()` in `lib/paths.mjs` read the 5,236-line brand-voice baseline in place; **this repo never writes into the script repo**. (5) New `videos/<slug>/` for planning artifacts (`videoDir`/`videoFile`), `npm run new-video`, and the note that `boards:all <filter>` is how a video's boards get built in phases. Board density agreed at **3-4 dense hubs + 6-8 leaves**. Six board types are catalogued as not-yet-built (`persona-card`, `myth-vs-truth`, `tier-delta-callout`, `stat-card`, `recap-loop-close`, `price-ladder`) — scaffold on first use. |
| 2.0 | 2026-07-27 | **Moved out of the website repo into its own standalone repo at `~/Dev/synva/Synva Boards` (Chintan's decision, planned since 1.1).** (1) **Coupling to the website is now live reference, not a copy** — new `lib/paths.mjs` resolves the repo root from `import.meta.url` and the website from the sibling folder (`SYNVA_WEB_REPO` overrides), so nothing hardcodes an absolute path and nothing writes back into the website. Two errors in the old migration checklist were found and fixed: the hardcoded website path was in **11 scripts, not 3** (missing 8 would have silently kept writing SVGs into the website repo), and **`sharp` was never a website dependency** — it only resolved transitively via `next`, so it is now an explicit pinned dep. Both `lucide-react` and `sharp` are pinned to exact versions because the generators deep-import Lucide's internal `__iconNode` shape. (2) **Shared `lib/`** — tokens, icon loader, SVG text/centring helpers, brand-asset inlining and the Supabase reader were extracted out of the 11 scripts, which each used to re-declare them. **Verified by regenerating all 14 boards and byte-diffing against the committed originals: all 14 identical.** (3) **Structure** — `brand/` (reusable) vs one folder per video, with `scripts/` mirroring `boards/`. (4) **Tooling** — a `board:*` command per board, `boards:all` (discovers boards from package.json, nothing to keep in sync), `verify` (renders a PNG **and** errors on the import-breakers: font fallback stacks, non-board fonts, gradients/filters/masks, non-PNG embeds, a missing xlink declaration; warns on non-token colours since a real device finish is legitimately off-palette), and `new-board` (scaffolds a generator wired to `lib/` and registers its command). (5) **New [WEBSITE.md](./WEBSITE.md)** — the map of what to read in the website repo and the rule that `lib/tokens.mjs` is the one mirror that must be re-synced by hand. (6) Its own `.env.local` (4 read-only keys) + `.mcp.json` for the read-only Supabase MCP. (7) The plugin moved to `figma-plugin/` — **Chintan re-imports it once in Figma desktop from the new manifest path**. |
| 1.2 | 2026-07-22 | **Two new boards + the plugin learned raster images.** (1) `synva-chapters.svg` (reusable agenda/chapters card) + `synva-framework.svg` (the homepage 3-step framework mirrored). (2) `synva-lifestyle-{quiet-cozy,social,dynamic}.svg` — "which Styletto IX for your lifestyle", three per-lifestyle boards, Essential/Good/Premium columns in the site's blue/yellow/purple `PICK_LEVEL_BADGE` colours + ₹/₹₹/₹₹₹ cue, with the real lifestyle illustration **embedded as PNG**. (3) To make that embed reliable, **the plugin now extracts `<image>` and builds a native image fill** (`figma.createImage`, PNG/JPEG only). (4) Recorded in DESIGN.md: boards are free-size; the soundwave footer is **opt-in, not a default** (Chintan). |
| 1.1 | 2026-07-21 | **Decided: board work is continuous/long-term and MOVES to its own sibling repo after the current recording batch** (Chintan). Replaced the "why it stays in-repo" framing (v1.0) with "Status: in-repo now, moving soon" + a step-by-step **Planned migration** checklist. Corrected the dependency read from v1.0: tokens are *hardcoded* (not a live import), `REPO` is a hardcoded absolute path, and only 2 public env vars + a one-time plugin re-import are needed. Interim: keep building boards in-repo while recording. |
| 1.0 | 2026-07-21 | **Split the Figma-board workflow into its own doc set** (this file + [DESIGN.md](./DESIGN.md)), separate from the website's root docs, so board notes never mix with website notes (Chintan's ask). Recorded: what the boards are, where the pieces live, the pointer to the authoritative skill, the boards built, and the paused Styletto `loss_range` DB fix. |
