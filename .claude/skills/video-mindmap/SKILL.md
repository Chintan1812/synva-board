---
name: video-mindmap
description: >
  Turn a researched video topic into the connector mind map Chintan records over — an
  ordered graph of SVG boards (nodes) and FigJam connectors (edges) that replaces a
  written script. Produces the board manifest that figma-board-svg then generates, with
  a talk track per node, the branch structure, the reveal plan and the canvas layout.
  Use after video-research and video-hook, or whenever Chintan says to plan the boards
  for a video, lay out the flow, decide what boards to make, or "how should this video
  be structured". Triggers: "plan the boards", "board plan", "mind map", "map out the
  video", "what boards do we need", "structure this video", "lay out the flow".
---

# Video mind map — the board plan

**Step 3 of 4.** Reads `videos/<slug>/01-research.md` and `02-hook.md`, writes
`videos/<slug>/03-mindmap.md` plus `videos/<slug>/mindmap.json`. That manifest is what
`figma-board-svg` executes.

## The one thing to understand first

**Chintan does not write or read a script.** He builds this map in FigJam, connects the
boards with connectors, and talks over it on camera. So the map is not an illustration
of the video — **the map is the video's spine.** If a beat isn't a node, it doesn't
happen. If a loop has no node to close on, it never closes. If the branch order is
confusing on the canvas, the delivery is confusing on camera.

Two consequences that drive every rule below:

1. **Each node carries a talk track** — 2-4 bullets Chintan speaks from. They live in
   the plan, **never printed on the board**. The board stays a clean visual prop; the
   plan is his structure.
2. **The graph, not a slide order.** Boards branch. A hub board (the comparison matrix)
   has leaves hanging off it. Connectors carry meaning, and the plan states the
   traversal explicitly, because a mind map read in the wrong order is chaos on camera.

## Before you plan: ask Chintan the experiential batch

Specs say what a device should do on paper. They do not say how it performs in a real
fitting. On paper a model can look like a major upgrade and sound nearly identical in
the chair. **You cannot derive any of the following from the catalogue, the website, or
the web.** Ask, in **one batched message**, and wait:

| # | Ask | Why it can't be inferred |
|---|---|---|
| 1 | For each tier jump — **meaningful or marginal** in your real-world experience? One word each. | A spec jump may be inaudible; a small one may be transformative |
| 2 | **One honest limitation per model** — what have you actually seen disappoint users? | Spec sheets never carry the frustrations |
| 3 | **Tier map per persona** — Essential / Good to have / Premium for each lifestyle | Comes from fitting hundreds of people |
| 4 | **Which features actually move the needle**, and which are marketing fluff? | Marketing-described ≠ clinical result |
| 5 | **Which model actually sells most** at Synva, and do you want to anchor on it? | Internal sales data |
| 6 | Anything you want on a board that I wouldn't think of? | figma-board-svg rule 1 — ask first, every time |

Where an answer is still missing, put `[ASK CHINTAN: …]` **on the node in the plan** and
leave it visible. A map with five open placeholders he fills in thirty seconds beats a
map with one confident lie rendered in vector.

## The graph model

### Node kinds

| kind | What it is | Density |
|---|---|---|
| `root` | the topic hub — title banner, the thing every branch hangs off | light |
| `branch` | a section hub: the framework, the common-traits band, the comparison matrix | **dense** |
| `leaf` | one model, one persona, one fact, one card | light |
| `aside` | a caveat, a myth, an honest limitation, a "not for you" note | light |
| `bonus` | **the promised payoff** — the cheatsheet / guide reveal. See Retention below | medium |
| `exit` | the loop-close / recommendation and the CTA | medium |

### Edge kinds

| kind | Meaning | Draw it in FigJam as |
|---|---|---|
| `leads-to` | the narrative spine — this is the order he moves in | solid, arrow |
| `supports` | hub → its detail (matrix → a model card) | thin, arrow |
| `contrasts` | the turn: myth → truth, "but actually", the honest caveat | solid, elbow |
| `closes-loop` | payoff, curving back to the node that opened the loop | **dashed**, arrow |

### Density — the hybrid shape

**3-4 dense hubs + 6-8 light leaves, 9-14 nodes total.** That's the shape that works:
the hubs are where he spends real minutes (the matrix, the lifestyle tier map), the
leaves are quick beats he lands and moves on from.

Two tests:
- A leaf needing more than ~6 lines of content is not a leaf. Promote it to a branch or
  split it.
- A hub you'd narrate in under 30 seconds is not a hub. Fold it into its parent.

## Beats that must exist as nodes

Carried over from the script pipeline's midsection framework. These are what hold
retention when there's no script to fall back on. Not every video needs all of them —
state the pattern you're using and which apply.

**Patterns:** product showcase · series breakdown · lifestyle framework · unboxing /
tutorial · concept explainer.

1. **Entry** — the hook board from `02-hook.md`. Root's first `leads-to`.
2. **Plan of attack** — the chapters / agenda node. What we'll cover. Buys permission
   to go long.
3. **Framework** — the Synva 3-step (Loss → type · Lifestyle → features · Budget → last)
   for any buying guide. Usually also the loop-close later.
4. **Common traits, once** — a prominent band of everything identical across the lineup,
   placed **before** any per-model node. It stops the repetition and primes the viewer
   for what actually changes. Never repeat these per model.
5. **Per-model / per-concept leaves** — **additive framing only**: "everything the 3IX
   has, plus X". Never re-list an earlier tier's features.
6. **Tier-delta callout** — meaningful vs marginal, per jump. `[ASK CHINTAN]`. Never
   label every tier a big jump; that destroys the cue.
7. **One limitation per model** — an `aside` node or a note on the leaf. Never let a
   product look perfect. `[ASK CHINTAN]`.
8. **The turn** — the contrarian reveal and the honest "you don't need to spend more"
   beat. This is the trust moment; it earns its own node and a `contrasts` edge.
9. **The bonus** — the promised cheatsheet / guide, teased in the hook and delivered
   around 70%. A `bonus` node. See Retention architecture below. **Required.**
10. **Loop close** — the recommendation / tier map, where every loop from `02-hook.md`
    visibly closes. Draw a `closes-loop` edge back to the entry node for each.
11. **CTA** — the consultation pivot (online pathway first, national reach; Hyderabad
    Experience Center second) and the CTA pill.

**Re-hooks:** in this pipeline a re-hook is a **branch transition** — the moment he
moves from one hub to the next. Mark at least 2 (3 if the video runs past 8 minutes) on
the edges where they happen, with the technique: contrarian flip, PAR pivot, character
callback, or a new loop plant.

---

## Retention architecture — the map is built on a clock

The brief is not just *what* is on the boards, it is *when*. Retention is the primary
algorithmic signal, so the map carries a position for every beat, expressed as a
percentage of runtime. Research-backed placements (sources in the notes at the bottom):

| Beat | Position | Why |
|---|---|---|
| **Open on stakes** | 0% | Never a logo sting, never "hey guys". The hook board is already the entry node |
| **Bonus teased** | **within the hook** | The open loop that carries past the hook. Loops are worth up to **+32% watch time** |
| **Re-engagement beat 1** | ~33% | A branch transition with a fresh promise |
| **Re-engagement beat 2** | ~66% | Contrarian flip or character callback |
| **Bonus delivered** | **~70%** | Peak-payoff position. Put the strongest reveal here, not at the very end |
| **Loop close** | ~85% | Every hook loop resolved on a visible node |
| **CTA** | ~95% | Consultation pivot: online first, Hyderabad second |

**Board-change cadence:** a visual change roughly every **40 seconds** is worth about
+11% retention. In this workflow that is the node-change rate — if a hub board holds the
screen for three minutes with no movement, plan the reveal veils to break it up, or split
the node. Note the intended cadence per hub in the plan.

### The bonus is a required node, and it is the lead mechanism

Chintan's standing instruction (2026-07-28): **every video brief includes a bonus**,
teased early and delivered around the 70% mark. This is the beat that converts a viewer
into a lead, and leads — not views — are the metric this channel is judged on.

Rules for it:
- **Specific to this video, never generic.** "Subscribe to our newsletter" loses every
  time to a resource that extends what the viewer just learned. If the video compares two
  price bands, the bonus is *that* comparison as a takeaway sheet.
- **Partial gate, never a full gate.** The opening of the post is public so it stays
  indexable; the rest unlocks on email. One field, email only — single-field forms convert
  at ~23.4%, roughly triple a four-field form.
- **Delivered as a Knowledge Hub post on synva.io**, not a PDF (Chintan's preference,
  2026-07-28 — the website is now in-house). The route already exists:
  `/(marketing)/knowledge-hub/[slug]`, content in the website repo's
  `src/components/sections/knowledge-hub/data/knowledge-hub-data.ts`. The gate itself is
  website-repo work; Chintan is building it before the next video ships.
- **The WhatsApp ask never appears in the video.** It is offered after unlock, with its
  own separate unticked consent. Full reasoning, the DPDP consent rules and the nurture
  sequence: **[videos/LEAD-CAPTURE.md](../../../videos/LEAD-CAPTURE.md)** — read it before
  designing any bonus.
- **Link goes at the very top of the description**, and the URL appears on the bonus board
  so it is readable on screen.
- Synva has **already promised three cheatsheets on camera** across the buying series and
  appears never to have shipped them (see `videos/TOPIC-SLATE.md`). Do not add a fourth
  unpaid promise — if the bonus cannot actually be produced, do not tease it.

### Storytelling beats to place on the map

Pick the ones that fit; do not use all of them:
- **Open loop** — a question only the payoff answers. At least one, planted in the hook.
- **Story lock** — a named person introduced early, resolved at the loop close. The
  personas do this work: introduce them at the framework node, pay them off at the tier map.
- **Thought narration** — voice the viewer's objection *before* answering it. Place it
  immediately before the turn.
- **Contrarian flip** — "that was good, but without this it still won't work."
- **The turn** — the honest reveal that costs Synva money to say. This is the trust beat
  and it earns the 70% slot if there is no bonus competing for it.

## Board type catalogue

Map every node to a type. Reuse before you build.

| Type | Generator | Notes |
|---|---|---|
| `title-banner` | [scripts/brand/make-title-banner.mjs](../../../scripts/brand/make-title-banner.mjs) | reusable, edit `KICKER`/`TITLE` |
| `chapters` | [scripts/brand/make-chapters.mjs](../../../scripts/brand/make-chapters.mjs) | reusable, edit `CHAPTERS` (2-3) |
| `framework` | [scripts/brand/make-framework.mjs](../../../scripts/brand/make-framework.mjs) | the 3-step, colour-coded per step |
| `cta-pill` | [scripts/brand/make-cta.mjs](../../../scripts/brand/make-cta.mjs) | "go explore it yourself", never "book now" |
| `hook-specs` | pattern: [scripts/styletto-ix/make-hook.mjs](../../../scripts/styletto-ix/make-hook.mjs) | landscape, headline specs only |
| `comparison-matrix` | pattern: [scripts/styletto-ix/make-features.mjs](../../../scripts/styletto-ix/make-features.mjs) | the dense hub; headline specs → common band → full matrix |
| `ladder` | pattern: [scripts/styletto-ix/make-compare.mjs](../../../scripts/styletto-ix/make-compare.mjs) | "what each tier adds" |
| `lifestyle-tiers` | [scripts/styletto-ix/make-lifestyle.mjs](../../../scripts/styletto-ix/make-lifestyle.mjs) | Essential/Good/Premium columns, one board per lifestyle |
| `colour-cards` | [scripts/styletto-ix/make-colors.mjs](../../../scripts/styletto-ix/make-colors.mjs) | real renders from Supabase Storage |
| `reveal-covers` | [scripts/brand/make-reveal-covers.mjs](../../../scripts/brand/make-reveal-covers.mjs) | **overlay, not a node** |

**Not built yet — scaffold with `npm run new-board` when a map first needs one:**
`persona-card` (Ramesh / Mohan / Vikas) · `myth-vs-truth` · `tier-delta-callout`
(meaningful vs marginal) · `stat-card` (one number, big) · `recap-loop-close` ·
`price-ladder`.

## Canvas layout

FigJam is the canvas; connectors are drawn there by hand and snap natively to the
imported boards. Give him a layout that doesn't need untangling:

- **Left to right.** Root at the far left, vertically centred. Depth increases rightward.
- **`col`** = depth from root (root = 0). **`row`** = vertical order within a column,
  centre-out (0, then -1, +1, -2, +2 …). These are authoritative.
- **`x` / `y`** are derived pixel hints: `x = col * 1600`, `y = row * 900`. Boards are
  free-size, so treat them as a starting grid he nudges, not a guarantee.
- **A branch and its leaves stay adjacent** — never interleave two hubs' leaves in one
  column, or the connectors cross and the map stops reading.
- **`closes-loop` edges are allowed to cross.** They're dashed and they're supposed to
  travel; that visible arc back to the hook is the payoff made visual.

## Reveals

A veil hides a branch until he gets to it. Translucent white panel, `fill-opacity` — a
real blur is an SVG `<filter>` and breaks the import (figma-board-svg rule 5); for true
frosted glass he adds Figma's **Effects → Background blur** after import. The kit is
`boards/brand/synva-reveal-covers.svg`.

Set `veil: true` on any node whose content is a **payoff** — the turn, the tier map, the
recommendation. Don't veil setup nodes; covering the framework just makes the canvas
look busy.

## Output 1 — `videos/<slug>/03-mindmap.md`

```markdown
MIND MAP — <topic>
==================

SLUG: <slug>
PATTERN: <product showcase / series breakdown / lifestyle framework / unboxing / concept>
GENERATED: YYYY-MM-DD
NODES: <n> (<h> hubs, <l> leaves)

ONE THING THE VIEWER LEAVES BELIEVING:
<from 01-research.md CORE TAKEAWAY>

---

THE MAP

<ASCII sketch of the graph — root, branches, leaves — so the shape is readable
before anyone opens FigJam>

---

TALK ORDER (the traversal — this is the running order on camera)

| # | Node | Board | Beat | At ~% | Re-hook |
|---|---|---|---|---|---|
| 1 | entry | hook-specs | Hook + bonus tease | 0 | — |
| 2 | ... | | | | |

---

RETENTION SPINE

| Beat | Node | Position | Technique |
|---|---|---|---|
| Open on stakes | entry | 0% | <pattern interrupt from 02-hook.md> |
| Bonus teased | entry | 0% | <the exact line that plants it> |
| Re-engagement 1 | <node> | ~33% | <contrarian flip / PAR pivot / new loop> |
| Re-engagement 2 | <node> | ~66% | <technique> |
| **Bonus delivered** | <node> | **~70%** | <what they get, and where> |
| Loop close | <node> | ~85% | <how> |
| CTA | <node> | ~95% | online first, then Hyderabad |

Board-change cadence: <hub> holds ~<n>s — <veil plan or split> to keep movement near 40s.

---

THE BONUS

- **What:** <the specific resource — must extend THIS video, never generic>
- **Teased:** <verbatim line, in the hook>
- **Delivered:** <node>, ~70%
- **Where it lives:** synva.io/knowledge-hub/<slug>
- **Gated:** <yes, email only / NO — gate not built yet, see the skill's Retention section>
- **Can it actually be produced before publish?** <yes/no — if no, cut the tease>

---

NODES

### <id> — <name>   [<kind>] [<board type>]
**Beat:** <which of the required beats this is>
**Must show:** <every field/section that has to be visibly rendered — no truncation>
**Data:** <none | supabase: table(s) | website: asset>
**Talk:**
- <bullet he speaks from>
- <bullet>
**Veil:** <yes/no>
**Open questions:** <[ASK CHINTAN: …] if any>

<repeat per node>

---

EDGES

| From | To | Kind | Label / technique |
|---|---|---|---|
| root | entry | leads-to | |
| hub-matrix | leaf-1ix | supports | |
| leaf-7ix | turn | contrasts | "PAR — yeh zaroorat nahi, luxury hai" |
| tier-map | entry | closes-loop | closes loop 1 |

---

LOOP LEDGER

| Loop (from 02-hook.md) | Opens on | Closes on | Closed? |
|---|---|---|---|
| <loop 1> | entry | tier-map | yes |

Every row must read "yes" before the map is final.

---

BUILD PHASES

**Phase 1 — <what and why first>**
- `npm run board:<name>` — <node>

**Phase 2 — <...>**
- ...

All at once: `npm run boards:all <slug>`
Then: `npm run verify <slug>` and read every PNG in `.tmp/`.

---

OPEN QUESTIONS FOR CHINTAN
1. <batched, numbered>
```

## Output 2 — `videos/<slug>/mindmap.json`

Machine-readable, drives generation and the FigJam layout.

```json
{
  "slug": "styletto-ix-which-version",
  "title": "Which Styletto IX version should you choose?",
  "pattern": "series breakdown",
  "generated": "2026-07-27",
  "nodes": [
    {
      "id": "entry",
      "name": "01-hook",
      "kind": "root",
      "board": "hook-specs",
      "beat": "Hook",
      "generator": "scripts/styletto-ix/make-hook.mjs",
      "command": "npm run board:styletto-hook",
      "must_show": ["Price (pair, after discount)", "Channels", "Bluetooth", "Rechargeable", "Warranty"],
      "data": "supabase:hearing_aid_models",
      "talk": ["…", "…"],
      "veil": false,
      "phase": 1,
      "atPercent": 0,
      "col": 0,
      "row": 0,
      "x": 0,
      "y": 0
    }
  ],
  "edges": [
    { "from": "entry", "to": "plan", "kind": "leads-to", "label": "", "rehook": null }
  ],
  "bonus": {
    "what": "Your ₹50k vs ₹1L lifestyle cheatsheet",
    "teasedOn": "entry",
    "deliveredOn": "bonus-sheet",
    "atPercent": 70,
    "url": "synva.io/knowledge-hub/<slug>",
    "gated": false,
    "gateNote": "email gate not built in the website repo as of 2026-07-28",
    "producible": true
  }
}
```

`kind` ∈ `root` `branch` `leaf` `aside` `bonus` `exit`. Edge `kind` ∈ `leads-to`
`supports` `contrasts` `closes-loop`. `atPercent` places the node on the retention clock.

## Hard rules

1. **Ask the experiential batch before planning** — one message, then wait. Unanswered
   items become visible `[ASK CHINTAN: …]` placeholders, never guesses.
2. **Every hook loop closes on a real node.** The loop ledger has no open rows.
2b. **Every brief carries a bonus** — specific to the video, teased in the hook, delivered
   at ~70%, on a `bonus` node (Chintan, 2026-07-28). It is the lead mechanism, and leads
   are the metric. **Never tease a bonus that cannot be produced before publish** — Synva
   already has three cheatsheets promised on camera and unshipped.
2c. **Place every node on the retention clock** (`atPercent`) and fill the RETENTION SPINE
   table. A brief without timing is half a brief.
3. **Common traits come before per-model detail**, stated once, prominently.
4. **Additive framing only** on per-model nodes. Never re-list an earlier tier.
5. **Every model gets one honest limitation.** Nothing looks perfect.
6. **Talk tracks live in the plan, never on the board.** The board is a visual prop, not
   a teleprompter.
7. **Nothing is hidden or truncated on any node** — figma-board-svg rule 2. Volume is
   managed by splitting into more nodes or grouping within one, never by dropping content.
8. **Every fact traces to `01-research.md`.** This skill plans; it does not discover new
   data. If a node needs a fact the research doesn't have, go back and pull it live.
9. **Reuse a board type before building one.** Check the catalogue first.
10. **No en/em dashes in anything that reaches the screen** — comma, colon, period, or
    "to" for ranges. The `·` middot is fine.

## Handoff

→ `figma-board-svg` builds each node. Scaffold new ones with
`npm run new-board -- <slug>/<name>`, generate with `npm run board:<name>`, verify with
`npm run verify <slug>`, then **read the PNGs** — the lint can't see layout.

→ Import into FigJam with `figma-plugin/` (Choose SVG file), lay the boards out on the
`col`/`row` grid, and draw the connectors per the EDGES table.

→ If the brief promises a gated bonus, the Knowledge Hub post and its email gate are
**website-repo work**, not board work. Flag it as a dependency; never ship the video
tease before the page exists.

---

## Sources for the retention placements

Refreshed 2026-07-28. Re-check if these numbers start driving big decisions:
[YouTube Retention Loops](https://www.overseeros.com/blog/youtube-retention-loops) ·
[Retention Architecture 2026](https://www.overseeros.com/blog/youtube-retention-architecture-2026) ·
[Audience Retention Tips for Long-Form](https://longstories.ai/blog/audience-retention-tips-long-form-videos) ·
[Lead Magnets on YouTube (tubics)](https://www.tubics.com/blog/lead-magnets-on-youtube) ·
[Gated Content Guide](https://www.useinstant.com/gated-content/)
