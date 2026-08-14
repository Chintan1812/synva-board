BONUS BRIEF — "Which Phonak do you actually need?"
==================================================

SLUG: phonak-infinio-ladder
GENERATED: 2026-08-13
GOVERNED BY: `videos/LEAD-CAPTURE.md` (the gate, the fields, DPDP). Read that first.
BUILD SPEC GOES TO: the website repo, alongside `docs/BRIEF-lead-capture-gate.md`
STATUS: **specified, not built.** The `bonus` node is blocked until the page is live.

---

## Why this one passes the disqualifier

LEAD-CAPTURE's hard rule: **never gate anything the website already gives away.** Synva's
catalogue is public and indexed, prices included, so a model list, a price table or a
spec comparison cannot be a lead magnet. The rule that replaces it:
**gate the interpretation, not the data.**

Chintan's idea passes cleanly. The catalogue can say the I90-Sphere is ₹8,75,000. It
cannot say *you do not need it*. That judgement is the audiologist's, it is unscrapeable,
and it is the only thing here genuinely worth a phone number.

It is also the natural close for this specific video: the whole 12 minutes argues that the
ladder is not a smooth climb. The tool is that argument, made personal.

---

## The promise, and the restraint that IS the pitch

> **"Answer six questions. It tells you which Phonak level you actually need — and if the
> cheaper one is enough, it says so."**

The restraint is the product. Every other configurator in this category is a funnel that
climbs. This one is pitched, on camera and on the page, as one that **only recommends a
higher level when the answers require it**, and that will tell most people to buy cheaper.

**Say the mechanism out loud, because a promise of restraint is only credible if it is
falsifiable:** the tool recommends up on exactly three triggers, and nothing else.

| Trigger | Recommends | Why it is honest |
|---|---|---|
| Regular listening in **loud, multi-speaker noise** (restaurants, functions, site work) | I70, or Sphere if it is most days | This is the one thing the higher tiers measurably do better |
| **Fitting range** requires it | the level that covers it | Clinical, not preference |
| Wants **hands-free calls both ears / streaming** as a daily thing | I50 and up | DuoPhone starts at I50 |

Everything else — age, budget anxiety, "I want the best", brand pressure — recommends
**no change**. If none of the three fire, the honest answer is I30 or I50, and the tool
says that in as many words.

⚠️ **This makes an explicit promise. It has to be true in the code.** If the tool
recommends up when none of the triggers fire, the video has lied. Whoever builds it gets
this table as the spec, and the copy must not be softened afterwards.

---

## The six questions

Deliberately six: enough to be credible, few enough to finish. The first three do the
real work; the last three personalise the follow-up.

1. **Who is this for?** myself / my parent / someone else
   → maps to CRM `Guardian_Mobile` vs `Patient_Mobile`
2. **Do you have a recent hearing test?** yes, I have the report / yes, but no report /
   no → drives the fitting-range trigger, and a "no" routes to a test, not a product
3. **Where is hearing hardest?** quiet room / one-to-one in mild noise / restaurants and
   functions / loud group settings most days → **the main trigger**
4. **Phone calls and TV** — rarely / sometimes / every day, hands-free matters
5. **Lifestyle** — Calm & Comfortable / Social & Fulfilling / Active Professional
   → the same taxonomy as the video and the website's `browse.ts`
6. **Have you been quoted already?** no / yes, under ₹2L / yes, ₹2-5L / yes, above ₹5L
   → this is the second-opinion hook, and it is the highest-intent answer in the set

## The output

One screen: **the recommended level, one line on why, and the one thing it is NOT.**
Plus, when a quote was entered above the recommendation, the sentence that does the work:
*"Based on your answers, you do not need the level you were quoted."*

Then the honest caveat, always shown: **this is a shortlist, not a prescription. The
receiver and the fitting still need an audiologist.**

---

## The gate

Straight from LEAD-CAPTURE, no deviation:

- **Partial gate.** Questions 1-3 and a partial result are public and indexable. The full
  recommendation, the "what it is not" line and the quote comparison sit behind the form.
- **Two fields: Name + Mobile.** No email. Synva's CRM is 25 of 25 mobile, 0 of 25 email.
- **One unticked box:** *"You can message me on WhatsApp about my hearing questions."*
- **`Lead_Source = YouTube`** plus a UTM on every submission.
- Store timestamp, consent wording shown, and IP. DPDP, February 2026 rules.
- Marketing consent is **separate** from the transactional unlock.

## On camera

- Teased **once**, at the end of the hook. One sentence. Not in the pattern interrupt.
- Delivered at the `bonus` node (92%).
- **The board shows the URL and the promise. It never shows the form.**
- The WhatsApp consent is a checkbox on the page, **never a spoken ask** in the video.
- Link at the very top of the description.

---

## Open items

1. Build the page. The `bonus` node cannot be recorded before it is live.
2. Confirm the trigger table above is clinically right — it is written from the research,
   and it is Chintan's call to sign off.
3. Decide the URL. Suggest `synva.io/tools/which-phonak`.
4. Same ZMA / WhatsApp BSP questions that LEAD-CAPTURE already raised are still open.
