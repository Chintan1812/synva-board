---
name: video-hook
description: >
  Write the opening hook for a Synva Hearing YouTube long-format video — the 30 seconds
  that decide whether the viewer stays. Applies Chintan's 4-layer hook philosophy (pain
  one standard deviation deep, knife twist, audience of one, pain-to-solution gap) and
  specifies what is on screen while he says it. Use after video-research, or whenever
  Chintan asks to write a hook, an intro, an opening, or "how should I start this video".
  Triggers: "write the hook", "how do I open", "intro for this video", "hook for", "the
  opening".
---

# Video hook

**Step 2 of 4** in the board pipeline. Reads `videos/<slug>/01-research.md`, writes
`videos/<slug>/02-hook.md`.

Ported from the script-generator repo's `youtube-hook` skill and hook agent. One
addition for this pipeline: **Chintan does not read a script.** He talks over the mind
map. So the hook is written tight, but it is delivered from memory over a visible hook
board, and this skill specifies both halves.

If there is no research file, either run `video-research` first or say so — a hook
written without the fact base is generic, which is the one thing a hook can't be.

## Who it's for

Chintan's audience: middle-class Indian families, 35-65, usually an adult child
researching for an elderly parent. They're **confused, not dumb**, and they have a high
BS detector.

**Language:** English. Chintan delivers in Hindi/Hinglish himself — do not write Hinglish
here. **Tone:** friend to friend. Never a lecturer, never a doctor.

## The 4 layers (all four, every hook)

**Layer 1 — Pain one standard deviation away.** Never the obvious pain. The one underneath.

| Surface pain | Obvious (bad) hook | 1SD hook |
|---|---|---|
| "Expensive hearing aids" | "Best Hearing Aids for 2026" | "These 4 things secretly decide the price of a hearing aid, not the brand." |
| "Don't know which to buy" | "How to choose a hearing aid" | "Everyone told me more channels means better sound. I wasted 3 months believing that." |
| "Worried about being judged" | "Modern hearing aids look stylish" | "My grandfather refused one for 7 years. Not because he couldn't hear, but because of what wearing it meant about him." |

**Layer 2 — Twist the knife.** Make the pain present-tense. One of three tools, never all
three: **struggle reminder**, **FOMO** (what's being lost while they wait), or
**jealousy** (someone already in the after).

**Layer 3 — Audience of one.** "You" and "your", constantly. Never "people". The viewer is
the main character. Use "I" stories to be human, never to show off.

**Layer 4 — Pain to solution gap.** Where they are → what's stopping them → where they
could be → the implicit promise that this video is the bridge.

## Structure — 4 parts, 30 seconds, 65-75 words

```
[PATTERN INTERRUPT] → [PAIN ID] → [KNIFE TWIST] → [PROMISE]
```

**Pattern interrupt (0-5s)** — one sentence, ~10 words. Contrarian statement, shocking
specific fact with personal stakes, story mid-action, direct question at a hidden fear,
or an SFX moment noted for the editor. Write 2-3 options, pick the strongest.

**Pain identification (5-12s)** — max 2 sentences. Make them feel *seen*. The 1SD pain,
in concrete language.

**Knife twist (12-22s)** — max 2 sentences. One punch, not a story. A real number, a
time reference, or a sharp fact.

**Promise (22-30s)** — max 2 sentences. What they'll know, what mistake they'll avoid,
what decision they'll finally be able to make. Specific and believable. Never overpromise.

**Open loop line** — one sentence after the promise, planting a loop from the research
file's OPEN LOOPS.

> Count the words. Over 75, **cut** — don't compress.

## The five templates

- **A — Hidden Variable:** "Everyone talks about [obvious factor]. But what actually
  decides [outcome], and nobody tells you this, is [hidden variable]."
- **B — Costly Assumption:** "Most people believe [belief]. I believed it too. Then I
  learned [counterintuitive truth], and that changed everything."
- **C — Delayed Story:** "3 years ago, [person] was [situation]. [Outcome] didn't happen
  because of [obvious reason]. It happened because of [hidden reason]."
- **D — What They Don't Tell You:** "[Professional/brand] will tell you [misleading
  thing]. What they won't tell you is [truth], because [why it benefits them to hide it]."
- **E — Internal FOMO:** "Every [period] you don't [act], [invisible cost] accumulates.
  You can't see it. You can't feel it yet. But it's happening."

The research file recommends one. Use it unless you have a concrete reason not to, and
say what the reason is.

## Language rules

**Do:** short sentences (8 words max in the hook) · pause markers — like this · real
numbers ("₹3 lakh quote", "4 years ago") · analogies to glasses, smartphones, test
drives · Hindi cultural references are fine in an English script ("Doctor saab said…",
"my dada…").

**Don't:** "In today's video I'll be discussing…" · "Hi everyone, welcome back…" ·
"Before we start, please like and subscribe" · meandering sentences · passive voice ·
clinical language ("audiological assessment indicates…") · any opener that could belong
to any channel.

## What's on screen — the hook board

Because there's no script, the hook is also a **visual beat**. Specify it here so
`video-mindmap` can place it as the map's entry node:

- **The on-screen line** — the single line of text that appears during the pattern
  interrupt. Usually a compressed version of it, not the whole sentence. Six words or fewer.
- **The hook board** — for a model-comparison video this is the compact headline-specs
  board (Price · Channels · Bluetooth · Rechargeable · Warranty across the
  models, landscape, self-contained — see figma-board-svg rule 7 and
  `boards/styletto-ix/styletto-ix-hook.svg`). For a concept video it may be a single
  stat card or a myth-vs-truth card instead. Name which.
- **Loop anchors** — for each open loop, name the map node where it visibly closes. A
  loop with no closing node gets cut here, not discovered later.

## Quality check — all five must pass

1. **Stranger test** — first 10 seconds, no title, no thumbnail. Would they stay?
2. **"So what" test** — sentence by sentence. Can't justify it, cut it.
3. **Specificity test** — every generic word replaced. "Some people" → "your mother".
   "A lot of money" → "₹60,000".
4. **BS-detector test** — would a skeptical Indian middle-class viewer roll their eyes?
5. **Promise-delivery test** — does the video actually keep this promise? Overpromising
   kills trust permanently.

Any fail, revise before writing the file.

## Output

Write `videos/<slug>/02-hook.md`:

```markdown
HOOK — <topic>
==============

TEMPLATE USED: <A-E, name> <(and why, if it differs from the research recommendation)>
WORD COUNT: <n> (target 65-75)

PATTERN INTERRUPT:
<final line>
  alternates considered: <2 you rejected>

PAIN IDENTIFICATION:
<max 2 sentences>

KNIFE TWIST:
<max 2 sentences>

PROMISE:
<max 2 sentences>

OPEN LOOP LINE:
<1 sentence>

---

FULL HOOK (READ-THROUGH):
<all of it in sequence, as spoken>

---

ON SCREEN

- On-screen line: "<six words or fewer>"
- Hook board: <board type + what must be visible on it>
- Loop anchors:
  | Loop | Closes on node |
  |---|---|
  | <loop 1> | <node id / name in the mind map> |

---

QUALITY CHECK
1. Stranger test: <pass / flag + note>
2. "So what" test: <pass / flag>
3. Specificity test: <pass / flag — replacements made>
4. BS-detector test: <pass / flag>
5. Promise-delivery test: <pass / flag>

---

HANDOFF
→ video-mindmap: the hook board becomes the map's entry node; every loop above
  must close on a node that exists in the map.
```

## Hard rules

1. **Never talk about the product or the solution in the hook.** The hook is about the
   viewer's pain.
2. **English only.** Chintan converts to his own delivery.
3. **Every number comes from `01-research.md`.** No invented prices, stats or claims.
4. **A loop that can't close on a visible node doesn't get planted.**
5. **No en/em dashes in anything that reaches the screen** — comma, colon, period, or
   "to" for ranges.
