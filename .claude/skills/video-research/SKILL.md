---
name: video-research
description: >
  Research a Synva YouTube video topic before any board is planned or drawn. Pulls the
  real catalogue facts live from Supabase, re-learns Chintan's current framing language
  from ClickUp + the brand-voice baseline, does a small gap-fill web pass, and writes a
  strategy brief (1SD pain, viewer moment, funnel stage) plus the fact base that the
  hook and the mind map are built on. Use whenever Chintan picks a video topic or title
  and says to research it, or asks for "product facts for X", "deep dive on Y", "what
  does the catalogue say about Z", or "let's start a new video". Triggers: "research
  this topic", "new video", "let's do a video on", "topic research", "deep dive".
---

# Video research — the fact base and the strategy brief

This is **step 1 of 4** in the board pipeline. It produces the file everything else
reads. Nothing downstream is allowed to invent a fact this file didn't establish.

```
1. video-research  →  2. video-hook  →  3. video-mindmap  →  4. figma-board-svg
```

Ported from the script-generator repo's `topic-deep-dive` skill, with the strategy
half of its orchestrator agent folded in. Two deliberate changes from the original:
data comes from **Supabase, not the Google Sheet**, and this skill **never writes into
the script-generator repo**.

## Inputs

Required:
- **Topic / working title** — one line. E.g. "Which Styletto IX version should you choose?"
- **Video slug** — kebab-case. E.g. `styletto-ix-which-version`. If `videos/<slug>/`
  doesn't exist, run `npm run new-video -- <slug>` first.

If Chintan gave only a title and you genuinely cannot infer the scope, ask **one**
question — not five. The four worth asking, in priority order:

1. **What's the core takeaway?** The one thing a viewer should leave believing.
2. **What's specifically in scope?** Which models / options / scenarios — and what's out.
3. **Is there a reframe?** A common belief this video challenges.
4. **Who is this NOT for?** The honest caveat.

If the topic plus what you already know covers these, proceed without asking.

## Process

### Step 1 — Read the brand-voice baseline

Read the brand voice live from the script-generator repo:

```
../YouTube Script Generator Agent/context/synva-brand-voice.md
```

Resolve it in code with `brandVoice()` from [lib/paths.mjs](../../../lib/paths.mjs) —
never hardcode the path. It is **read-only from here**. If you learn something new
about Chintan's framing this run, record it in this skill's own output file under
NEW FRAMING OBSERVED; do **not** append to that repo's file. One repo, one owner.

You are reading it to know what framings, tier vocabulary, analogies and reframes are
**already** documented — that's the diff base for Step 3.

### Step 2 — Pull the catalogue live from Supabase

The catalogue is the same shared Postgres the website and the Admin app use, read-only
from here. Query it live — **never hand-transcribe, never work from memory of a past run.**

Two ways in, both fine:
- `rest()` from [lib/supabase.mjs](../../../lib/supabase.mjs) (works from Node and from a
  one-off `node -e`), or
- the read-only Supabase MCP `execute_sql` (wired in `.mcp.json`).

Tables that matter:

| Table | Holds |
|---|---|
| `hearing_aid_models` | one row per model — brand, channels, `mrp` + `unit` (**normalise `Pcs` → pair**), `warranty_years`, `rechargeable`, `bluetooth_type_id`, `platform_id`, `loss_range_id`, form factor. ⚠️ `perf_speech_noise` / `perf_auto_adapt` / `perf_speech_quiet` are **Synva's own clinical ratings, not manufacturer specs** — never use them as the basis of a comparison (Chintan, 2026-07-28) |
| `feature_library` | the real catalogue feature names + `feature_category`. **Always use `feature_name` verbatim** — never a plain-English paraphrase |
| `model_features` | the model↔feature join, with `performance_score` 1-5 (null = present but ungraded) |
| `colors` | finishes, `hex_primary` / `hex_secondary` |
| `images` | product renders; `color_id` is the DB-authoritative image↔finish mapping |
| `lifestyle_profiles` | the lifestyle mapping |
| `brands` | brand metadata |

Pull **everything relevant to the topic**, not a sample. A board can't truncate
(figma-board-svg rule 2), so the research can't either. Record the pull date.

**If a query fails:** write `ERROR: <message>` into the PRODUCT FACTS section and
carry on with the remaining steps. Never fabricate a spec or a price.

### Step 3 — Mine ClickUp for current framing

Chintan's script library lives in ClickUp doc `197p90-3416` (Social Media Handbook →
Scripts - Synva → Long Format Scripts → Hindi Scripts). Default selection: the two most
recent month pages plus the standalone Hooks page.

| Page | ID |
|---|---|
| May 2026 | `197p90-8376` |
| April 2026 | `197p90-8276` |
| March 2026 | `197p90-7616` |
| February 2026 | `197p90-7496` |
| January 2026 | `197p90-7136` |
| November 2025 | `197p90-6736` |
| Hooks (standalone) | `197p90-5996` |
| Repurposed Scripts | `197p90-7556` |

`clickup_get_document_pages(doc_id="197p90-3416", page_ids=[...])` — batch up to 5 IDs
per call. To find newly-added months, `clickup_list_document_pages` on the doc and look
under parent page `197p90-6956`.

Skim each page for: **tier vocabulary**, **recurring analogies**, **reframes /
contrarian angles**, and **signature phrases worth re-using verbatim**. Cite the page
ID for every claim.

**Never push to ClickUp.** All ClickUp writes are Chintan's manual work.

### Step 4 — Gap-fill web pass (2-3 queries, hard cap)

Look at what you have. What would the audience care about that the catalogue and
ClickUp don't cover — a regulation change, a public statistic, a competitor launch, an
online-vs-offline price fact? At most **3** narrow `WebSearch` queries. Record the
source URL for every fact.

Do **not** re-look-up anything the catalogue already gave you. If nothing is genuinely
missing, say so and skip.

### Step 5 — Build the strategy brief

This is the half that makes the boards specific instead of generic. Work through it in
order:

**Surface topic** — what the video is obviously about, one sentence.

**1SD pain** — the real fear, confusion, shame or frustration one standard deviation
beneath the stated question. Not the product, not the price.

| Surface pain | 1SD pain |
|---|---|
| "Should I buy online?" | Fear of a ₹50,000 mistake that can't be undone |
| "Which brand is best?" | Fear of being misled by someone with an agenda |
| "My parent refuses to wear it" | Guilt of watching a parent decline while feeling powerless |

**Target viewer moment** — the specific moment in life this person is in, 2-3 sentences,
precise. Not a demographic; a scene.

**Funnel stage** — Awareness (doesn't accept the problem yet) / Consideration
(researching, comparing, confused) / Decision (ready, needs permission).

**Recommended hook template** — one of the five (Hidden Variable / Costly Assumption /
Delayed Story / What They Don't Tell You / Internal FOMO) with a one-line why.
The `video-hook` skill owns the actual writing.

**Open loops** — 1-2 questions, reveals or story continuations that can be planted early
and paid off later. In this pipeline every loop must eventually close **on a visible node
of the mind map**, so prefer loops that have a picture.

## Output

Write `videos/<slug>/01-research.md` in exactly this shape:

```markdown
VIDEO RESEARCH
==============

TOPIC: <topic / working title>
SLUG: <slug>
GENERATED: YYYY-MM-DD
CATALOGUE PULLED: YYYY-MM-DD (Supabase, read-only)

---

STRATEGY BRIEF

SURFACE PAIN: <what the viewer thinks they want to know>
REAL PAIN (1SD): <what's actually underneath>
TARGET VIEWER MOMENT:
<2-3 sentences — a scene, not a demographic>
FUNNEL STAGE: <Awareness / Consideration / Decision>
CORE TAKEAWAY: <the one thing they leave believing>
NOT FOR: <the honest caveat — who this advice doesn't apply to>

RECOMMENDED HOOK TEMPLATE: <A-E, name>
WHY: <1-2 sentences>

OPEN LOOPS TO PLANT:
1. <loop — and what visible node could close it>
2. <loop>

---

PRODUCT FACTS (Supabase, tables used: <...>)

| Model | Brand | Tier | MRP (₹) | Channels | Clarity | Auto-adapt | Warranty |
|---|---|---|---|---|---|---|---|
| ... | | | | | | | |

Feature coverage: <n features across n categories — the full list belongs on the
board, not here; note the categories and any exclusions + why>

Notes on selection:
- <how you filtered; rows excluded and why>

---

CHINTAN'S FRAMING

- **Tier vocabulary:** <the exact words he uses>
- **Analogies for this topic:** <bullets>
- **Reframes / contrarian angles used before:** <bullets, cite ClickUp page IDs>
- **Signature phrases to re-use verbatim:** <bullets>

---

NEW FRAMING OBSERVED THIS RUN

- <anything in ClickUp not yet in the brand-voice baseline, with page ID>
  (Chintan can port these into the script repo's voice file if he wants — this
  skill does not write there.)

(or: "None — the voice baseline already covers what ClickUp shows.")

---

WEB FACTS (gap-fill, fetched YYYY-MM-DD)

- <fact> — source: <URL>

(or: "No gaps.")

---

GAPS / FLAGS FOR CHINTAN

- <data the catalogue was missing that the web couldn't fill>
- <anything ambiguous or contradictory>
- <experiential inputs the mind map will need — see video-mindmap: meaningful vs
  marginal per tier, one honest limitation per model, tier map per persona, which
  features actually move the needle, the anchor/most-sold model>

---

HANDOFF
→ video-hook reads STRATEGY BRIEF + PRODUCT FACTS
→ video-mindmap reads all of it and turns it into the connector map
```

## Hard rules

1. **Never fabricate catalogue data.** A failed query is an `ERROR:` line, not a guess.
2. **Real catalogue feature names** (`feature_library.feature_name`), never a paraphrase.
3. **The DB is read-only from here.** It's shared with the website and the Admin app —
   any change needed is a two-app change and belongs in the Admin app.
4. **Read the brand voice, never write it.** No writes into the script-generator repo.
5. **Never push to ClickUp.**
6. **Web research is gap-fill only** — 3 queries max, never a substitute for the catalogue.
7. **Cite everything** — ClickUp page IDs for framing, URLs for web facts, pull date for
   the catalogue.
8. **Don't do the hook's job or the map's job here.** This skill establishes facts and
   strategy. It does not write hook copy and it does not decide boards.
