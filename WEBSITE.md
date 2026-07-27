# The website repo — what to read, and where

> Boards are styled like the Synva website, so this repo needs the website's design
> language and its live product data. **None of it is copied here.** It is read
> **live** from the website repo, so a board is never built against a stale copy.

## Where it is

```
~/Dev/synva/
├── Synva Webiste - 2.0/         ← the website (note the typo in the folder name)
├── Consultation PDF Generator/  ← the Admin app / product CMS
└── Synva Boards/                ← you are here
```

Resolved by [`lib/paths.mjs`](./lib/paths.mjs) as the sibling folder `Synva Webiste - 2.0`.
Override with `SYNVA_WEB_REPO` in `.env.local` if it ever moves. If it cannot be
found, every generator fails immediately with a message saying so, rather than
producing a half-built board.

In code:

```js
import { websiteFile, brandAsset, websiteImage } from "./lib/paths.mjs";

brandAsset("synva-logo-horizontal-darkyellow.svg")   // public/brand/...
websiteImage("hearing-aids", "lifestyle-calm-2.webp") // public/images/...
websiteFile("docs", "catalog-schema.md")              // anything else
```

## What to read for what

| You need | Read, in the website repo |
| --- | --- |
| **Brand tokens** (authoritative) | `src/app/globals.css` — the `@theme` block |
| Type scale, spacing grid, AA contrast pairings, voice | `DESIGN.md` |
| **Catalogue DB schema**, table by table, and what anon can read | `docs/catalog-schema.md` |
| Budget-level colours + labels (Essential / Good to have / Premium) | `src/lib/catalog/browse.ts` → `PICK_LEVEL_BADGE`, `PICK_LEVEL_LABEL` |
| Price and unit rules (`mrp`, Pcs vs Pair, the ×2 both-ears render rule) | `src/lib/catalog/pricing.ts` |
| Product status rules (active / coming_soon / discontinued) | `src/lib/catalog/status.ts` |
| Product image URLs and renditions | `src/lib/catalog/images.ts` |
| The homepage 3-step framework copy (source of the framework board) | `src/components/sections/home/how-it-works.tsx` + `data/how-it-works-data.ts` |
| Logo, soundwave signature, brand patterns | `public/brand/` |
| Lifestyle illustrations | `public/images/hearing-aids/` |
| **The shared-database rule** (one DB, two apps) | `CLAUDE.md` rule 12 |

## The rules for using it

**Read live, never copy.** If a board needs an asset or a fact from the website,
reach for it through `lib/paths.mjs` at generation time. Do not stage a copy in this
repo — a copy goes stale silently and nobody notices until a board ships with last
season's logo.

**`lib/tokens.mjs` is the one exception, and it is a real duplication.** A generated
SVG needs literal hex strings, and `globals.css` cannot be imported by Node, so the
palette is mirrored there. It is one file instead of the eleven copies this used to
be. **If the brand palette ever changes on the site, update `lib/tokens.mjs` in the
same pass**, then `npm run boards:all` to push it through every board.

**The database is read-only from here.** This repo holds the anon/publishable key
only. That database is shared with the website *and* the Admin app, so any schema or
data change is a two-app change and belongs in the Admin app, never in a board
script. If a board seems to need a schema change, raise it rather than doing it.
(There is one such change open right now — see the DB fix note in [CLAUDE.md](./CLAUDE.md).)

**Never write into the website repo.** Every output path in this repo comes from
`boardOut()`, which resolves under `boards/`. If you ever find yourself building a
path from `webRepo()` for a *write*, that is a bug.
