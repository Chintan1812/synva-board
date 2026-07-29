BONUS / LEAD MAGNET — brainstorm for the ₹50k vs ₹1L Phonak video
=================================================================

DATE: 2026-07-28 · Chintan will build the website side after scripting
RULES: videos/LEAD-CAPTURE.md (name + mobile, unticked WhatsApp consent, partial gate,
Knowledge Hub post) · delivered at ~70% of runtime · must EXTEND the video, never repeat it

---

## The test every option has to pass

The viewer has just been told **what each price buys**. The question forming in their head
at ~70% is not *"what did he say again"* — it is:

> **"Fine. So what do *I* do?"**

A bonus that re-states the video answers the wrong question. A bonus that answers *that*
question is worth a phone number. Four criteria:

| | Why |
|---|---|
| **Extends, not repeats** | A recap has no perceived value; they just watched it |
| **Works on THEIR situation** | Generic guides do not get phone numbers |
| **Segments the lead** | Every answer should become a CRM field, or the WhatsApp follow-up is generic and burns the opt-in |
| **Cheap to produce** | Chintan builds this himself, after scripting |

---

## Option 1 — "Apna Quote Check Karo": the quote audit sheet
They paste in the model they were quoted; the sheet tells them what to verify.

Rows: is this price **per pair or per piece** · does it have **Bluetooth** · is it
**rechargeable** · which **platform** (and is it the current one) · **warranty** ·
**fitting range vs your audiogram**.

**For:** resolves the video's exact stated pain — *"aapko kisine difference hi nahi
bataya"*. Highest perceived value of any option; it is a weapon, not a leaflet. Whoever
fills it is **decision-stage with a live quote**, the hottest lead Synva can get.
**Against:** only useful to someone who already has a quote, so it excludes the earlier
half of the audience. And it invites comparison against other retailers' pricing, which
can get messy.

## Option 2 — The lifestyle × budget matrix
L1 / L2 / L3 across ₹50,000 and ₹1,00,000 with named models.

**For:** direct extension of the video's spine; trivial to produce.
**Against:** **this is the video in a table.** It is the weakest option on the "extends,
not repeats" test, and it is the one I would have defaulted to. Recommend against.

## Option 3 — The full price ladder, Phonak + Signia, every band
Every model, per pair after discount, with channels / Bluetooth / rechargeable / warranty.

**DISQUALIFIED — and my earlier reasoning for rejecting it was wrong.**
I called it "a business decision". It is not: **the full price list is already public.**
The website ships a complete catalogue at `/(shop)/hearing-aids/[category]` and
`/(shop)/products/[slug]`, rendering `mrp` per variant, right down to
`product:price:amount` in the OpenGraph tags. It is public and indexed.

So the real objection is far more damaging: **it has no gate value.** Asking for a phone
number to unlock data that is free two clicks away is a broken promise. The viewer hits
the gate, hands over their number, and then finds the same prices ungated on the same
site. That does not build a list; it costs trust.

## Option 4 — "Kya Phonak aapke liye sahi hai?": the self-check ⭐ **CHOSEN**

**Output changed 2026-07-29 (Chintan), and it is a real upgrade.** The tool no longer
returns "your band". It answers two questions in order:

1. **Kya aapke liye Phonak sahi hai?** — **and the answer can be NO**
2. Agar haan → konse devices

**The honest "no" is the whole differentiator, and it is structurally load-bearing.** The
two `cheezein` in §4a are exactly the cases where the tool MUST say no: someone who needs a
behind-the-ear on the latest platform, or invisible plus rechargeable. So the tool
reproduces the video's honesty mechanically rather than Synva asserting it. No competitor
publishes a tool that talks people out of their own brand.

Inputs: **hearing loss + lifestyle**. Plain questions, no jargon.

1. Din bhar ghar pe rehte ho, ya bahar? *(lifestyle L1/L2/L3)*
2. Restaurant ya function mein baat samajhne mein dikkat hoti hai?
3. Phone pe baat karna zaroori hai, ya kam?
4. Battery badalna theek hai, ya rechargeable chahiye?
5. Dikhna nahi chahiye, ya koi problem nahi?
6. Yeh aapke liye hai ya kisi aur ke liye? *(guardian vs patient)*

**For:** the **strongest on all four criteria.** It extends the video (the video teaches
the framework, the tool applies it to *them*). Every answer is a CRM field — Q1 sets the
lifestyle, Q4 and Q5 decide Phonak-vs-Signia on the rechargeable/invisible axes, Q6 fills
`Guardian_Mobile` vs `Patient_Mobile`. It works whether or not they already have a quote.
And the payoff can reuse Option 3's data **privately** — they see the models for *their*
answers, not the whole ladder.
**Against:** needs an interactive component, not just a post. Most build effort here.

## Option 5 — "Jab Phonak sahi nahi hai": the honest exclusions guide
The situations where Phonak cannot serve you, and what to look at instead.

**For:** nobody else publishes this; it directly pays off the hook's "do cheezein" loop.
**Against:** narrow — only relevant to profound loss or invisible-seekers. Better as a
*section inside* another option than as the bonus itself.

---

## Recommendation: Option 4, with Option 3's data as the private payoff

**The tool, not the table.** Six questions in, their band and their shortlist out.

Why this one:
- It answers *"so what do I do?"* instead of restating what they just heard
- **Every answer becomes a CRM field**, so the day-3 WhatsApp can say *"for a Calm &
  Comfortable lifestyle at ₹50,000, these are your three"* instead of something generic.
  That specificity is the whole reason LEAD-CAPTURE.md says to collect the number at all
- Q4 (rechargeable) and Q5 (invisible) are exactly the two axes where **Phonak loses** —
  so the tool independently reproduces the video's honesty rather than Synva asserting it
- The model data is **live from the DB**, freshly synced to the June 2026 guide, so it
  stays correct without maintenance
- **Crucially, the gated thing is the INTERPRETATION, not the data.** The catalogue
  already tells anyone what exists and what it costs. What it cannot tell them is *which
  one is theirs*. That judgement is the only thing on this website worth a phone number,
  and it is the one thing a competitor cannot scrape
- It reuses the 3-step framework Chintan already teaches, which makes it feel like the
  channel rather than a bolt-on

**Fold in Option 5** as the result-page footnote: if their answers hit a Phonak dead end
(profound + rechargeable, or invisible + rechargeable), the result says so plainly.

**Deliberately not Option 3** — not because publishing prices is risky, but because
**Synva already publishes them.** A price list cannot be a lead magnet on a site whose
catalogue is public and indexed.

---

## The tease, at ~70%

> *"Aur jaise maine shuru mein bola tha, maine ek chhota sa tool banaya hai. 6 sawaal.
> Aapko exactly bata dega ki aapke liye 50,000 wala theek hai ya 1,00,000 wala, aur konse
> models. Link description mein hai."*

Plant a one-line version in the plan-of-attack beat right after the hook, then deliver
here.

⚠️ **Do not record either line until the page exists.** Three cheatsheets are already
promised on camera and unshipped (videos/TOPIC-SLATE.md).

## Build notes for the website

- Route: `/(marketing)/knowledge-hub/[slug]` already exists
- **Questions public, result gated** — the six questions render for everyone; the
  band + shortlist unlock on name + mobile. Keeps the page indexable and puts the gate at
  peak intent, which is exactly the partial-gate shape in LEAD-CAPTURE.md
- Model shortlist comes from `hearing_aid_models` live — no hardcoded lists
- Write answers to Zoho: `Lead_Source = YouTube`, `UTM_Source`, lifestyle, and
  `Guardian_Mobile` vs `Patient_Mobile` from Q6
