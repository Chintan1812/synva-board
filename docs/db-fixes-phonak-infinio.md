DB FIX BRIEF — Phonak Audéo Infinio → Infinio Ultra
===================================================

RAISED: 2026-08-13, during `video-research` Step 5 for `videos/phonak-infinio-ladder/`
SOURCE OF TRUTH: Phonak's own documents + phonak.com (see Evidence)
APPLY WHERE: **the Admin app (`Consultation PDF Generator`), never from Synva Boards.**
This repo holds the anon key and is read-only by design. The DB is shared with the
website and the Admin app, so every item here is a two-app change.
STATUS: **not applied.** Written up for Chintan to action later.

---

## Why this exists

`video-research` Step 5 diffs the catalogue against the manufacturer before anything
goes on camera. This run found six mismatches on the Audéo Infinio line. Two of them
would have put a wrong fact on a board; the rest are gaps or overstatements.

The trigger for the whole check: on 2026-08-12 a wrong `bluetooth_type_id` cell shipped
a false Terra claim to camera.

---

## Priority 1 — factually wrong today, blocks the video board

### 1. `AutoSense OS 6.0` → `AutoSense OS 7.0`

| | |
|---|---|
| Row | `feature_library.PT-003`, `feature_name = "AutoSense OS 6.0"` |
| Blast radius | **34 `model_features` rows, all on `platform_id = PL-0002` (Infinio).** No other platform touched. Lumity keeps `PT-029` (5.0), Paradise keeps `PT-020` (4.0), Terra keeps `PT-030` (5.0 Limited) |
| Change | `feature_name` → `AutoSense OS 7.0` |
| Why | The **Infinio Ultra firmware, shipping since October 2025, replaces AutoSense OS 6.0 with 7.0.** Phonak states 7.0 was trained on 18x more real-world scenarios and is 24% more precise at classifying the listening situation. The upgrade is free, in-clinic, takes minutes, and applies to every Infinio and Infinio Sphere already sold |
| Risk | Low. Single-platform, and the rename is a pure display-string change |

**One judgement call for Chintan:** a unit that has *not* yet had the firmware installed
is still running 6.0. Options: (a) rename `PT-003` outright, treating Ultra as the
current state of the line — simplest, and true for anything sold from now on; or (b) add
a new `PT-0xx "AutoSense OS 7.0"` and re-point the 34 rows, keeping 6.0 for history.
**Recommend (a).** The catalogue describes what Synva sells today, and what Synva sells
today is upgradeable to 7.0 at no cost.

### 2. Model naming does not contain "Ultra"

| | |
|---|---|
| Rows | All 24 `Audeo I *` rows (HA-205..210, HA-266..271, HA-315..322) plus any other `PL-0002` rows |
| Now | `Audeo I 30-R`, `Audeo I 70-Sphere`, `Audeo I 30-R Go`, … |
| Phonak today | **Audéo Infinio Ultra R** and **Audéo Infinio Ultra Sphere**, in four levels I30 / I50 / I70 / I90 |
| Why it matters | Not a spec error — Ultra is firmware, so the hardware naming is defensible. But **buyers search "Infinio Ultra"** and the catalogue never uses the word, so the website's product pages cannot rank for it. This is a demand problem, not just a tidiness one |
| Risk | **Medium — touches `slug`, `seo_title`, `seo_description` and public URLs.** A rename without redirects breaks live product links. Coordinate with the website side |

**Recommend deciding the convention once and applying it to the whole line**, e.g.
`Audéo Infinio Ultra I30-R`. Do not rename piecemeal.

---

## Priority 2 — the DB overstates or understates a difference

### 3. `SpeechSensor` grades a difference Phonak does not state

| | |
|---|---|
| Rows | `model_features` for `feature_id = PT-002` on **HA-206** and **HA-267** (both `Audeo I 70-Sphere`, Pcs and Pair) — `performance_score = '4'` |
| Everything else | The other 13 rows carrying `PT-002` are `'5'` |
| Phonak | Its Infinio feature summary lists **SpeechSensor identically** in the 90 Sphere and 70 Sphere columns, with **no strength qualifier**. The only feature Phonak grades by strength is Spheric Speech Clarity ("full" at 90-Sphere, "medium" at 70-Sphere) |
| Change | Set HA-206 and HA-267 `performance_score` to `'5'`, or to `NULL` |
| Why | As it stands the DB invents a tier difference the manufacturer never claims. Put that on a board and it is a false comparison |

⚠️ **Related, no DB change needed:** `performance_score` and the `perf_*` columns are
**Synva's own 1-5 assessments**, not vendor specs (CLAUDE.md v2.4). They stay out of the
manufacturer-spec band on every board. This item is only about not inventing a delta.

### 4. AutoSense program count is flattened

| | |
|---|---|
| Now | AutoSense is one ungraded row, identical for all six Infinio tiers |
| Phonak | Program count tiers by level: **I30 → 4, I50 → 6, I70 → 7, I90 → 8.** The program the I90 gets and the I70 does not is **"Speech in loud noise"** |
| Effect | **The DB hides a real tier difference**, which understates the I70→I90 gap. For this video the gap is the argument, so the board carries it from the vendor document instead |
| Options | (a) `performance_score` 1-4 on the AutoSense row per tier, cheap but abuses a Synva-owned column for vendor data; (b) a `notes`-style field on `model_features`; (c) leave it and let boards read the vendor doc |
| Recommend | **(c) for now.** Do not encode vendor data in a column that CLAUDE.md defines as Synva's own opinion. Revisit if a second video needs it |

---

## Priority 3 — catalogue gaps, no video impact

### 5. `ActiveVent Receiver` missing from `feature_library`

Phonak lists it at **every** Infinio level, with the caveat that it requires the
ActiveVent receiver accessory. Absent from the catalogue entirely. Add it as a Phonak
feature if the line is going to be described completely; note the accessory dependency
so it never reads as included in the box.

### 6. `EasyGuard` missing from `feature_library`

Phonak names **EasyGuard** (earwax protection) on the current Audéo Infinio Ultra R.
Not in the catalogue. Add.

---

## Verified correct — do NOT "fix" these

Recorded so a future pass does not undo good data:

| Field | Status |
|---|---|
| Fine-tuning channels 12 / 16 / 20 / 20 (and 20 on both Sphere) | ✅ matches Phonak's own spec table exactly |
| `Speech Enhancer` on I90 and I90-Sphere only | ✅ matches Phonak's feature summary. This is the video's load-bearing claim |
| Sphere existing only at I70 and I90 | ✅ correct, no I30/I50-Sphere rows exist |
| `Spheric Speech Clarity` graded 4 at 70-Sphere, 5 at 90-Sphere | ✅ Phonak itself says "medium strength" vs "full strength" |
| **T-coil absent on all Audeo I rows** | ✅ correct. Phonak: "only in non-wireless Virto Infinio models" |
| Bluetooth identical across all four levels | ✅ Bluetooth 5.3 line-wide. Not a tier differentiator |
| StereoZoom 2.0 / Dynamic Noise Cancellation / Tap Control starting at I70 | ✅ matches |
| Motion Sensor Hearing / SoundRelax / DuoPhone starting at I50 | ✅ matches |

---

## ⚠️ Unverified — needs Chintan's Phonak India price guide, not the web

**The warranty ladder: 2 / 2 / 3 / 3 years, and 4 on both Sphere models.** No global
Phonak document found states this; it is presumably an Indian distributor term. It is
the **only headline spec in the whole table with no vendor confirmation**, and it is
currently printed on boards. Check it against the Phonak India guide before the shoot.

---

## Evidence

| # | Source | Note |
|---|---|---|
| 1 | Phonak Infinio Feature Summary, doc `028-2681-03`, dated **2024-07** — [PDF](https://www.phonak.com/content/dam/celum/phonak/master-assets/en/documents/hearing-instruments/infinio-us/ph-overview-infinio-feature-summary-8.5x11in-028-2681-03-en-us.pdf) | The per-level feature matrix. **Predates Ultra** |
| 2 | Phonak Audéo I Product Information, doc `027-0712-02`, dated **2024-05** — [PDF](https://www.phonak.com/content/dam/celum/phonak/master-assets/en/documents/hearing-instruments/infinio/audeo-i/ph-product-information-audeo-i-210x280-027-0712-02-en.pdf) | Channels, Bluetooth 5.3, IP68, chargers. **Predates Ultra** |
| 3 | [Phonak Audéo Sphere product page](https://www.phonak.com/en-us/hearing-devices/hearing-aids/audeo-sphere) | Current. Uses "Infinio Ultra R" / "Infinio Ultra Sphere" |
| 4 | [HearingTracker — Audéo Infinio Ultra](https://www.hearingtracker.com/hearing-aids/phonak-audeo-infinio) | Ultra = firmware, not hardware |
| 5 | [HearUpUSA — Sphere I70 vs I90](https://www.hearupusa.com/blogs/news/phonak-audeo-sphere-i70-vs-phonak-audeo-sphere-i90) | Corroborates the I70/I90 deltas |
| 6 | [HearingTracker — free Ultra upgrade](https://www.hearingtracker.com/news/phonak-audeo-infinio-ultra-free-upgrade-big-changes) | AutoSense 7.0, free in-clinic update |
| 7 | [Hears Hearing & Hearables — Infinio Ultra updates](https://hearshearingandhearables.com/phonak-infinio-ultra-updates/) | October 2025, 30% battery efficiency, EasyGuard |

**Both Phonak PDFs predate the Ultra firmware.** On anything Ultra-specific they are
stale, and the product page plus sources 6-7 are the better authority.

---

## Suggested order of work

1. **#1 AutoSense rename** — highest value, lowest risk, unblocks the board
2. **#3 SpeechSensor scores** — two rows, one minute
3. **Verify the warranty ladder** against the Phonak India guide
4. **#2 Ultra renaming** — plan with the website side, needs redirects
5. **#5 / #6** feature additions whenever the line is next touched
6. **#4** leave as-is unless a later video needs it

Follow the existing pattern: a CSV-driven script in the Admin app, dry-run by default,
`--commit` to apply, with the current values kept as the rollback record — the same
shape as `scripts/apply-phonak-catalog-diff.ts`.
