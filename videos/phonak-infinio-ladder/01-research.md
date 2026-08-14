VIDEO RESEARCH
==============

TOPIC: I Opened a ₹2,56,000 Phonak Hearing Aid. Here's What You Actually Get.
       (the Audéo Infinio ladder: I30 / I50 / I70 / I90 / Sphere, anchored on a
       customer's I50 unboxed on camera)
SLUG: phonak-infinio-ladder
GENERATED: 2026-08-13
CATALOGUE PULLED: 2026-08-13 (Supabase, read-only)
VENDOR SOURCES VERIFIED: 2026-08-13 (Phonak official PDFs + phonak.com + HearingTracker)

---

STRATEGY BRIEF

SURFACE PAIN: "There are four Infinio models and a Sphere version. Which one do I
actually need, and is the AI worth it?"

REAL PAIN (1SD): The fear of being walked up a price ladder by someone who profits
from the climb. Chintan's own April 2026 script names it almost verbatim:
*"Kabhi na Kabhi, kisi hearing care professional ne aapko ₹2-3 lakh ka hearing aid
zaroor recommend kiya hoga."* The viewer is not confused about features. They are
trying to work out whether they are being told the truth.

TARGET VIEWER MOMENT:
They have a printed quote in their hand from a clinic, or a WhatsApp message with
three model names and three prices on it. The gap between the cheapest and the most
expensive is more than a lakh, and nobody has explained what that lakh buys. They are
about to either overpay out of fear, or walk away out of distrust.

FUNNEL STAGE: Consideration → Decision (they have accepted they need a hearing aid and
have a specific brand's quote in hand)

CORE TAKEAWAY: The Infinio ladder is not one smooth climb. There is exactly one step
where the money buys a lot (I50 → I70), one step where it buys almost nothing
(I70 → I90), and one branch where it buys something genuinely different (Sphere). Know
which step you are standing on.

NOT FOR: Anyone whose hearing loss or lifestyle has not been assessed yet. This video
compares within one family for someone already quoted on it. It is not a
"which hearing aid should I buy" video, and the I30 at ₹1,54,000 is still a premium
device that most first-time buyers do not need to start at.

RECOMMENDED HOOK TEMPLATE: B, Costly Assumption
WHY: The assumption is "higher number = proportionally better hearing", and it is
costly in the most literal sense, ₹2,26,000 for one step. The sealed box in hand makes
the assumption concrete instead of abstract, and the price is said out loud in the
first ten seconds.

OPEN LOOPS TO PLANT:
1. **"One of these four steps costs more than two lakh and gives you almost nothing.
   I'll show you which."** Closes on the `delta-ladder` node, the I70 → I90 row.
2. **"And the model I'd actually buy is not the most expensive one, and it's not the
   cheapest either."** Closes on the `verdict` node, where the I70-Sphere is revealed
   as costing ₹80,000 LESS than the I90-R while doing the hard job better.

---

PRODUCT FACTS (Supabase, tables used: hearing_aid_models, feature_library,
model_features, platforms, technology_levels)

All prices are `unit = 'Pair'` rows, which exist for every model here (figma-board-svg
rule 9: never double a `Pcs` price when a Pair row exists). These are **MRP**, not the
after-discount price. The board must show the after-discount price and must never
print the discount percentage (CLAUDE.md rule 6).

| Model | DB id | Tech level | MRP/pair (₹) | Channels | Warranty | Features mapped |
|---|---|---|---|---|---|---|
| Audeo I 30-R | HA-271 | 30 | 1,54,000 | 12 | 2 yr | 9 |
| Audeo I 50-R | HA-270 | 50 | 2,56,000 | 16 | 2 yr | 12 |
| Audeo I 70-R | HA-269 | 70 | 4,44,000 | 20 | 3 yr | 16 |
| Audeo I 70-Sphere | HA-267 | 70-Sphere | 5,90,000 | 20 | 4 yr | 18 |
| Audeo I 90-R | HA-268 | 90 | 6,70,000 | 20 | 3 yr | 17 |
| Audeo I 90-Sphere | HA-266 | 90-Sphere | 8,75,000 | 20 | 4 yr | 19 |

`-R Go` variants also exist (HA-315..322) at ₹6,000 more per pair. These are the same
device bundled with **Phonak ChargerGo** (the charger with an integrated battery)
instead of the standard charger, confirmed against Phonak's charging-options table.
Out of scope for the board; worth one spoken line.

All six share: platform `PL-0002` (**Infinio**), Bluetooth `BLT-0004`, fitting range
0-110 dB, rechargeable, IP68.

**THE LADDER, which is the spine of the video**

| Step | Extra cost | What actually changes |
|---|---|---|
| I30 → I50 | +₹1,02,000 | +4 channels (12→16), +3 features: Motion Sensor Hearing, SoundRelax, DuoPhone |
| **I50 → I70** | **+₹1,88,000** | **+4 channels (16→20), +4 features: StereoZoom 2.0, Dynamic Noise Cancellation, Tap Control, SmartSpeech Technology, +1 yr warranty. The real jump.** |
| **I70 → I90** | **+₹2,26,000** | **+1 feature (Speech Enhancer) and one extra AutoSense program. Same 20 channels. Same 3 yr warranty.** |
| I70 → I70-Sphere | +₹1,46,000 | Spheric Speech Clarity (medium strength) + SpeechSensor, the DEEPSONIC AI chip, +1 yr warranty |
| I90 → I90-Sphere | +₹2,05,000 | Spheric Speech Clarity (full strength) + SpeechSensor, +1 yr warranty |

**THE FINDING THAT CARRIES THE VIDEO**

The **I90-R at ₹6,70,000 is dominated by the I70-Sphere at ₹5,90,000.** It costs
**₹80,000 more** and its only advantages over the I70-R are two loud-noise features
(Speech Enhancer, plus the automatic "Speech in loud noise" AutoSense program) that the
Sphere's DEEPSONIC chip does substantially better. If loud noise is the problem, the
cheaper device is the better device. That is the whole channel's thesis with a receipt.

**Feature coverage:** 19 features across 8 categories (Connectivity, Conversation
Management, Environment Adaptation, Fitting Tools, Listening Comfort, Noise Management,
Tinnitus, Wearer Empowerment). Nine are present at every level and ungraded, so they
belong in the "common to every Infinio" band, not the delta table:
APD 3.0 · AutoSense OS 6.0 · Real Ear Sound · Roger Technology · SoundRecover2 ·
Tinnitus Balance · UltraZoom · WhistleBlock · WindBlock.
Ten vary by tier and carry the argument. Feature names are `feature_library.feature_name`
verbatim.

⚠️ **`performance_score` (the 3/4/5 grades) is Synva's own scale, not a Phonak spec.**
Phonak publishes a feature as present or absent, and grades strength for exactly one
feature (Spheric Speech Clarity: medium at 70-Sphere, full at 90-Sphere). Treat the
grades the same way CLAUDE.md v2.4 treats `perf_*`: they belong in a labelled
"Synva's assessment" panel, never in the manufacturer-spec band.

Notes on selection:
- `Pcs` rows excluded; every model has a Pair row.
- `-R Go` rows excluded from the board, noted above.
- CROS I-R (HA-211, ₹54,500) excluded: different product class, no channels or tech
  level recorded, and it would confuse the ladder.

---

CHINTAN'S FRAMING

Sources: brand-voice baseline (`YouTube Script Generator Agent/context/synva-brand-voice.md`,
read live, 5,236 lines) + ClickUp doc `197p90-3416` pages May 2026 `197p90-8376`,
April 2026 `197p90-8276`, Hooks `197p90-5996`.

- **Tier vocabulary:** "performance levels" (not "tiers" or "models"). Phonak's own
  labels map cleanly: 30 Essential / 50 Standard / 70 Advanced / 90 Premium.
- **The car analogy, used repeatedly and already proven on camera** (`197p90-8276`):
  *"1IX or 2IX ko ek Hyundai Creta samajhlo aur 3IX ko Mercedes C Class, 5IX ko
  Mercedes S Class and 7IX Mercedes Maybach"* and *"It's like Choosing a Mercedes over
  a Hyundai Creta."* Ports directly onto I30/I50/I70/I90.
- **The permission-to-not-overspend reframe** (`197p90-8276`): *"₹1 lakh tak ke hearing
  aids working professionals ke liye genuinely ENOUGH hote hai. Isse upar jaana Bilkul
  MANDATORY nahi."* This video is the same move one rung up the price ladder.
- **The upsell callout** (`197p90-8276`): *"Kabhi na Kabhi, kisi hearing care
  professional ne aapko ₹2-3 lakh ka hearing aid zaroor recommend kiya hoga."*
  This is the 1SD pain stated in his own words. Strong hook candidate.
- **Credentials line, used verbatim in every video:** *"Maine aur mere Team ne piche
  2 saal mein 500 se bhi zyada loogon ko apne Hearing loss, Lifestyle AUR BUDGET ke
  hisaab se ek SAHI hearing aid choose karne mein madad ki hai."*
- **Retention ask, stated explicitly** (`197p90-8276`): *"Yeh videos tab kaam karte hai
  jab aap end tak dekhte ho."*
- **His standard end-loop:** *"Iss video ke end tak zaroor dekhna, kaha mai aapko woh
  model bataounga, jo Synva pe Maximum ... sabse zyada prefer karte hai."*
- **Signature close:** *"Mai aapko agle video mein milunga. Tab tak ke liye, Bye Bye!"*

---

NEW FRAMING OBSERVED THIS RUN

- The **unboxing-as-cross-reference** pattern (`197p90-8276`): *"lene ke baad aap iski
  puri un-boxing video dekh sakte hai jaha mai in-detail batata hu ki aapko yeh device
  ko kaise setup karna hai."* He treats the unboxing as the *post-purchase* video and
  the comparison as the *pre-purchase* video. This video deliberately merges the two,
  which is new. Worth watching whether it dilutes either job.
- Not in the voice baseline; Chintan can port it into the script repo if he wants.
  **This skill does not write there.**

---

WEB FACTS + VENDOR VERIFICATION (fetched 2026-08-13)

Primary sources, in order of authority:
1. **Phonak Infinio Feature Summary** (official, doc 028-2681-03, dated 2024-07) —
   https://www.phonak.com/content/dam/celum/phonak/master-assets/en/documents/hearing-instruments/infinio-us/ph-overview-infinio-feature-summary-8.5x11in-028-2681-03-en-us.pdf
2. **Phonak Audéo I Product Information** (official, doc 027-0712-02, dated 2024-05) —
   https://www.phonak.com/content/dam/celum/phonak/master-assets/en/documents/hearing-instruments/infinio/audeo-i/ph-product-information-audeo-i-210x280-027-0712-02-en.pdf
3. Phonak Audéo Sphere product page — https://www.phonak.com/en-us/hearing-devices/hearing-aids/audeo-sphere
4. HearingTracker, Audéo Infinio Ultra — https://www.hearingtracker.com/hearing-aids/phonak-audeo-infinio
5. HearUpUSA, Sphere I70 vs I90 — https://www.hearupusa.com/blogs/news/phonak-audeo-sphere-i70-vs-phonak-audeo-sphere-i90

**CONFIRMED against Phonak's own documents (safe to say on camera):**
- **Fine-tuning channels 20 / 20 / 20 / 20 / 16 / 12** for 90-Sphere / 70-Sphere / 90 /
  70 / 50 / 30. Phonak's own spec table, source 2. Matches the DB exactly.
  **Channels stop climbing at I70.**
- **Speech Enhancer is I90-only.** Source 1 lists it in the 90 Premium column and
  nowhere else. Matches the DB. This is the load-bearing claim and it holds.
- **Sphere exists only at I70 and I90.** Sources 1, 3, 4. Matches the DB, which has no
  I30-Sphere or I50-Sphere row.
- **Spheric Speech Clarity is "medium strength" at 70-Sphere, "full strength" at
  90-Sphere.** Source 1, verbatim. The DB's 4-vs-5 grade agrees.
- **The AI is the DEEPSONIC chip and it exists only in Sphere models**; non-Sphere
  Infinio carries the ERA chip alone. Sources 3, 4.
- **Bluetooth 5.3, identical across all four levels** (source 2), two active
  connections, pairs with up to eight devices. **Bluetooth is not a tier differentiator
  here** — worth stating, because a marketing table elsewhere implied it was.
- IP68, built-in rechargeable, charge time 3h to 3.5h. Source 2.
- StereoZoom 2.0, Dynamic Noise Cancellation and Tap Control start at I70.
  Motion Sensor Hearing, SoundRelax and DuoPhone start at I50. Source 1, matches DB.

**Facts the DB does not hold at all, and that the video needs:**
- **"Ultra" is a firmware upgrade, not new hardware, and it applies to the WHOLE line.**
  Confirmed 2026-08-13 after Chintan flagged it. The hardware is identical to the
  Infinio devices released August 2024; Ultra is a **free in-clinic firmware update
  taking a few minutes**, available since **October 2025**, and a current owner of any
  Infinio or Infinio Sphere can have it installed at no cost. So **every Audéo Infinio
  Synva sells today is, or can be, an Ultra.** Sources 4, 6, 7.
  → This is a genuine video beat, not a footnote: *if you already own an Infinio, you
  are owed a free upgrade, go ask for it.* It also explains the "free upgrade" in
  Chintan's own January 2026 video title.
- **AutoSense OS 7.0 replaces 6.0 on Ultra.** Phonak states it was trained on **18x more
  real-world scenarios** and is **24% more precise** at identifying the listening
  situation. The Ultra firmware also brings **~30% better battery efficiency**,
  **one-step Bluetooth pairing**, and faster feedback management. Sources 6, 7.
  **The DB still says AutoSense OS 6.0 — that is now a factual error, see discrepancies.**
- **EasyGuard** earwax-protection system is named on the current Audéo Infinio Ultra R.
  Not in `feature_library` at all. Sources 4, 6.
- **Battery: up to 56 hours standard, but roughly 10-11 hours with Sphere mode running
  continuously** (sources 3, 4). This is the single best honest-limitation beat in the
  video: the AI that justifies the price premium is also what drains the battery.
- Phonak's marketing claims for Spheric Speech Clarity 2.0: "up to 3x more likely to
  understand every word", "listening effort reduced by up to 35%" vs StereoZoom 2.0
  (source 3). Report as Phonak's claim, attributed, never as measured fact.
- AutoSense OS 6.0 program counts differ by level: 30 Essential gets 4, 50 Standard 6,
  70 Advanced 7, 90 Premium 8. The extra program at I90 is **"Speech in loud noise"**
  (source 1). The DB flattens this, see discrepancies below.

---

⚠️ DB ↔ VENDOR DISCREPANCIES (the check that the last video skipped)

None of these are fatal, and the video's central claim survived the check. Recording
them all, per the new skill Step 5.

| # | Field | Supabase says | Phonak says | Verdict / action |
|---|---|---|---|---|
| 0 | **AutoSense OS version** | **`AutoSense OS 6.0`** | **AutoSense OS 7.0** since the Ultra firmware (Oct 2025) — 18x more training scenarios, 24% more precise | **The DB is factually wrong and would put a stale version number on camera.** Rename the feature to `AutoSense OS 7.0`. Highest-priority DB fix |
| 0b | **Model naming** | `Audeo I 30-R` … no row contains "Ultra" | the whole line is now **Audéo Infinio Ultra** (free firmware upgrade, all four levels, all existing units) | Rename in the Admin app. Buyers search "Ultra"; the catalogue does not use the word |
| 1 | AutoSense program count | one feature, present and ungraded at all six levels | program count varies by level: 4 / 6 / 7 / 8, and the I90-only program is "Speech in loud noise" | **DB understates the I70→I90 gap.** The honest delta is two things, not one. Say "one feature and one automatic program", not "one feature" |
| 2 | SpeechSensor | graded 4 at I70-Sphere, 5 at I90-Sphere | listed identically in both Sphere columns, no strength qualifier | **DB invents a difference Phonak does not state.** Do not put a 4-vs-5 on the board for this feature |
| 3 | ActiveVent Receiver | absent from `feature_library` entirely | listed at every level, with the caveat that it requires the ActiveVent receiver accessory | Catalogue gap. Not needed for this video; flag to the Admin app |
| 4 | Model naming | `Audeo I 30-R`, platform "Infinio". No row anywhere contains "Ultra" | currently marketed as **Audéo Infinio Ultra**; phonak.com uses "Infinio Ultra R" and "Infinio Ultra Sphere" | **Not a spec error** — Ultra is firmware, so the hardware naming is defensible. But the catalogue is using pre-late-2025 naming while buyers search the new one. Flag to the Admin app |
| 5 | T-coil | absent for all Audeo I rows | "Only in non-wireless Virto Infinio models" | **DB is correct.** Audeo I RIC genuinely has no T-coil. No action |
| 6 | `performance_score` 3/4/5 | present on 10 features | Phonak grades strength on exactly one feature (Spheric Speech Clarity) | Synva's own scale. Keep it out of the manufacturer band, per CLAUDE.md v2.4 |

**Caveat on the vendor sources themselves:** both official PDFs are dated **2024-05 and
2024-07**, which is *before* the late-2025 Ultra firmware. On anything Ultra-specific
(battery hours, Spheric Speech Clarity **2.0**, AutoSense revisions) the PDFs are stale
and the phonak.com product page is the better source. Where the two disagree, say so on
camera rather than picking one.

---

GAPS / FLAGS FOR CHINTAN

**Blocking, needs your answer before the mind map:**
1. **Is the I90-R actually dead in your clinic?** The data says it is dominated by the
   I70-Sphere on price and on the job it's sold for. If you have a real reason someone
   should buy an I90-R over an I70-Sphere, the video needs it, because otherwise this
   is the strongest thing you'll say all video.
2. **Which of these is the anchor model** — the one Synva actually sells most of in this
   family? Every video you've made closes on that, and the loop above is written
   assuming it is the I70-Sphere. Confirm or correct.
3. **One honest limitation per model.** The Sphere battery drain is documented and
   covers the Sphere models. For I30 / I50 / I70 the limitation has to come from you.
4. **Meaningful vs marginal per step.** The prices say I50 → I70 is the real jump. Does
   that match what you see in the fitting room, or is 16 channels already enough for
   most people, making I50 the honest recommendation?

**Non-blocking:**
5. Discrepancies 3 and 4 above belong in the Admin app, not here. The DB is read-only
   from this repo.
6. The India warranty ladder (2 / 2 / 3 / 3, Sphere 4) is not in any Phonak global
   document found. It is presumably the Indian distributor's term. **Verify it against
   your Phonak India price guide before it goes on a board** — it is the one headline
   spec in the table that no vendor source confirmed.
7. Retention structure for a 4-model comparison is the open question you flagged. That
   is `video-hook` + `video-mindmap` work, not research. The two open loops above are
   built to carry it, and the ladder gives a natural cliff at the I70 → I90 row.

---

HANDOFF
→ video-hook reads STRATEGY BRIEF + PRODUCT FACTS
→ video-mindmap reads all of it and turns it into the connector map
→ Unresolved before boards: flags 1-4 and 6
