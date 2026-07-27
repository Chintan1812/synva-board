# Synva Boards

Website-styled **SVG boards** for Figma / FigJam — the video props Chintan drops on a
canvas and narrates or scribbles over on camera.

Every board is editable text (single Figma fonts: Bricolage Grotesque / Inter) plus
vector Lucide icons and flat fills, so it imports cleanly and stays editable.

```
npm install                    # once
npm run boards:all             # regenerate every board
npm run verify                 # lint + render PNGs to .tmp/ for eyeballing
npm run new-board -- <group>/<name>
```

Design language and live product data come from the **website repo next door**, read
live and never copied — see [WEBSITE.md](./WEBSITE.md).

## Layout

| Path | What |
| --- | --- |
| `boards/brand/` | reusable assets, good on any video |
| `boards/<video-slug>/` | one folder per video |
| `scripts/` | the generator per board, mirroring `boards/` |
| `lib/` | shared building blocks: tokens, icons, brand assets, SVG helpers, Supabase |
| `figma-plugin/` | the Figma desktop plugin that imports a board |
| `CLAUDE.md` · `DESIGN.md` · `WEBSITE.md` | architecture · visual spec · the map to the website |
| `.claude/skills/figma-board-svg/` | the operational rulebook — read it before making a board |

## Commands

Every board has its own command. `npm run boards:all` runs them all, which is what you
want after a price change in Supabase or a brand-token edit.

| Command | Board |
| --- | --- |
| `npm run board:styletto-features` | the flagship 47-feature Styletto IX comparison |
| `npm run board:styletto-hook` | the compact trailer hook (5 headline specs) |
| `npm run board:styletto-compare` | the "what each tier adds" ladder |
| `npm run board:styletto-colors` | colour cards, one per finish, with real renders |
| `npm run board:lifestyle` | the three "which Styletto for your lifestyle" boards |
| `npm run board:chapters` | reusable "what we'll cover" agenda card |
| `npm run board:framework` | the homepage 3-step framework, mirrored |
| `npm run board:title-banner` | reusable video title banner |
| `npm run board:reveal-covers` | frosted-veil kit for on-camera reveals |
| `npm run board:cta` | reusable "go explore it yourself" pill |
| `npm run board:swatches` | brand colour swatch strip (eyedropper source) |

`npm run verify` checks every board for the things that silently break the Figma
import — a font fallback stack, a gradient or filter, a webp embed — and renders each
one to `.tmp/` so you can look at it. It exits non-zero on an error, so a broken board
can't be handed over quietly. Non-token colours are reported as warnings, because a
real device finish colour is legitimately off-palette.

`npm run new-board -- styletto-ix/hook` writes a starter generator already wired to
the tokens, icons and output path, and registers its command.

## Getting a board onto a canvas

- **Plugin** (keeps text editable and icons as vectors): Figma → Plugins →
  Development → **Synva SVG to board** → Choose SVG file → pick one from `boards/`.
- **Drag** the `.svg` straight onto a Figma / FigJam canvas.

First time on a machine, install the plugin: Figma desktop → Plugins → Development →
**Import plugin from manifest…** → `figma-plugin/manifest.json`. After that, editing
`code.js` or `ui.html` needs no reinstall — the plugin re-reads its files each run.

**Resize a board with the Scale tool (`K`)**, not a normal corner drag. A normal drag
does not scale font size, so auto-width labels break out of their pills.

## Setup

```
cp .env.example .env.local     # then fill in, or copy the four keys from the website repo
npm install
```

Only four environment values are needed, all read-only: the Supabase URL and anon key
for the generators, plus an access token and project ref for the Supabase MCP.
Details in [.env.example](./.env.example).
