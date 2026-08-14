MIND MAP — I Opened a ₹2,56,000 Phonak Hearing Aid
=================================================

SLUG: phonak-infinio-ladder
GENERATED: 2026-08-13
READS: 01-research.md + 02-hook.md
EMITS: mindmap.json (the board manifest) · 04-talk-brief.md (the shoot pointers)
PATTERN: single-device anchor × tier ladder × late inversion

**The mind map replaces the script.** There is no word-for-word script for this video.
Lay the boards out in FigJam, connect them with connectors, and talk over the map.

---

## The retention design

The problem Chintan named: *"making sure they stay hooked for the entire way is gonna be
tricky."* He is right, and the reason is structural. **A four-model comparison leaks
viewers the moment someone decides which model is theirs.** It is why the channel's two
existing Infinio videos died at 1.1 and 2.4 views/day.

Three mechanisms, all load-bearing:

**1. A physical object, not a table.** The sealed I50 opens at 11% and stays in frame to
the end. Every competing video on this topic is a spec sheet read aloud. This one has a
thing in a hand, which is the only visual a comparison cannot copy.

**2. Three loops, all planted at 0%, none paid before 55%.**

| Loop | The line | Planted | Paid | Node |
|---|---|---|---|---|
| A | "one step costs ₹2,26,000 and gives you almost nothing" | 0% | **55%** | `turn` |
| C | "₹80,000 less than the model most people get pushed towards" | 0% | **70%** | `dominated` |
| B | "the one I would actually buy" | 0% | **78%** | `verdict` |

Staggered so one is always open. A viewer who has decided "I am an I50 person" at minute
six still does not know which step wastes ₹2,26,000, and cannot leave without finding out.

**3. The surprise is an inversion, placed late.** At 70% the cheaper device turns out to
be the better buy. Inversions hold better than rankings because they cannot be guessed
from the thumbnail.

**The single thing that would break it:** resolving the I70 → I90 step on the ladder
board at 34%. Everything before 55% is setup for that reveal.

---

## Traversal

```
entry ──> trust ──> plan ──> inbox ──> common ──> ladder ──┬──> sphere ──> battery
  │                                                        │        │
  │                                                        └──> turn ┘
  │                                                                 │
  │                                                                 v
  └───────────── loops A, C, B close here ────────>  dominated ──> verdict
                                                                    │
                                                       upgrade <────┘
                                                          │
                                                       bonus ──> cta
```

`ladder` is the hub: three edges out. `sphere` and `turn` both feed `dominated`, which is
why the inversion lands as hard as it does. By the time the viewer sees it they already
know (a) the AI lives only in Sphere and (b) what the I90 adds over the I70. The
inversion is then arithmetic they do themselves.

---

## Nodes

14 nodes: 4 dense hubs (`entry`, `ladder`, `sphere`, `dominated`) + 10 lighter ones.
Full manifest with talk tracks, `must_show`, canvas positions and veil flags:
**`mindmap.json`**. Shoot pointers: **`04-talk-brief.md`**.

| % | Node | Board | Role |
|---|---|---|---|
| 0 | entry | `infinio-entry` | hook, 4 levels, third delta chip veiled |
| 4 | trust | `title-banner` ♻ | who is talking |
| 7 | plan | `chapters` ♻ | what they get |
| 11 | inbox | `infinio-inbox` | the box, opened. Pays the title early |
| 22 | common | `infinio-common` | the shared floor. Kills the two upsells |
| 34 | ladder | `infinio-ladder` | **the hub.** Three steps, additive |
| 46 | sphere | `infinio-sphere` | where the AI actually is |
| 55 | turn | `infinio-turn` | **loop A pays.** ₹2,26,000 for two things |
| 62 | battery | `infinio-battery` | the honest limitation |
| 70 | dominated | `infinio-dominated` | **loop C pays.** The inversion |
| 78 | verdict | `infinio-verdict` | **loop B pays.** ⚠️ placeholder |
| 86 | upgrade | `infinio-upgrade` | the free Ultra upgrade |
| 92 | bonus | `infinio-bonus` | the tool. ⚠️ blocked |
| 97 | cta | `cta` ♻ | close |

♻ = reused brand board, no new generator.

---

## Build phases

All eleven new boards are **built and verified** (0 errors, 0 warnings).

```
npm run boards:all infinio     # all 11
npm run verify infinio         # lint + PNGs into .tmp/
```

---

## Reveal plan

Two boards use veils from `brand/reveal-covers`:

- **`entry`** — the third delta chip (I70 → I90, +₹2,26,000). Covered from 0%, lifted at
  55%. This is loop A made physical.
- **`ladder`** — one veil per rung, revealed in sequence, so a dense hub board does not
  dump three answers at once.

Both boards are laid out so those regions are independently coverable. Do not redesign
them in a way that merges the rungs or the chips.

---

## ⚠️ Blocked before recording

1. **`dominated`** — is there a real clinical case for the I90-R over the I70-Sphere?
2. **`verdict`** — per-level persona + the anchor model. Five `[ASK CHINTAN]` rows.
3. **`ladder`** — one honest limitation each for I30 / I50 / I70.
4. **Every price board** — MRP or after-discount? All eleven regenerate either way.
5. **Every price board** — the warranty ladder 2/2/3/3/4 is **unverified** against any
   Phonak document. Check the Phonak India price guide.
6. **`bonus`** — Knowledge Hub page + gate must be live. See `BONUS-BRIEF.md`.

Items 1-3 are experiential and come only from Chintan. Items 4-6 are decisions.

---

HANDOFF
→ figma-board-svg has already run: `boards/phonak-infinio-ladder/*.svg`, 11 files
→ import via `figma-plugin/` (Choose SVG file), then connect in FigJam
→ resize with the **Scale tool (K)**, never a corner drag
