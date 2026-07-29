LEAD CAPTURE — the bonus, the gate, and what data to collect
============================================================

RESEARCHED: 2026-07-28 · applies to every video brief
DECIDES: what the `bonus` node promises, what the gate asks for, and how leads are nurtured
STATUS: decided. Chintan is building the website side before the ₹50k-vs-₹1L video ships.
BUILD SPEC: `../Synva Webiste - 2.0/docs/BRIEF-lead-capture-gate.md` (this file is the evidence)

---

## The shape: partial gate, not full gate

Chintan's instinct is right and it is the documented best practice. **Publish the opening
of the Knowledge Hub post publicly, gate the rest.** Two reasons:

- The public portion stays indexable, so the post earns search traffic forever. A fully
  gated page is invisible to Google.
- The gate sits at the moment of maximum intent — after the reader has proven the content
  is worth it, not before.

**Deliver the unlocked content on-page, and follow up on WhatsApp.** The follow-up is what
makes the number worth having; the on-page unlock is what makes the form worth filling.

## What to ask for: NAME + MOBILE. Not email.

> **Corrected 2026-07-28 against Synva's live CRM.** The generic best practice is
> "email only, one field, 23.4% conversion". For Synva specifically that is the wrong
> answer, and following it would have built a second list disconnected from the business.

**Evidence — 25 most recent Zoho CRM Leads, every source:**

| Field | Populated |
|---|---|
| Mobile | **25 of 25** |
| Guardian_Mobile or Patient_Mobile | **25 of 25** |
| Full_Name | 25 of 25 |
| **Email** | **0 of 25** |

Synva's entire lead base is phone. Not one email address. Sources include Google Ads,
Referral, Walk In, Google Search, and **YouTube** — which is already a `Lead_Source`
value, with `UTM_Source: youtube` on at least one record.

Three consequences:

1. **An email-gated form builds a list that does not join to anything.** It cannot be
   matched, deduped or nurtured alongside the leads Synva already has.
2. **The business converts by talking to people.** An audiologist calls, or messages. The
   asset that produces a consultation is a working phone number, not an inbox.
3. **Phone is also the better Meta match in India**, since most accounts are registered
   with a number.

### The gate: two fields

- **Name** (required) — an audiologist calling needs it, and every existing record has it
- **Mobile** (required) — the field the whole business runs on
- **One unticked box:** *"You can message me on WhatsApp about my hearing questions."*
  Separate, specific, DPDP-compliant. Unticked, always.

No email field. It would be a third field that 0% of the current base has and that the
sales motion does not use.

### After unlock: the qualifier that personalises everything

On the thank-you state, one question — **"Who is this for?"** (myself / my parent /
someone else) and **which lifestyle** (Calm & Comfortable · Social & Fulfilling · Active
Professional).

This is elegant because it is the same taxonomy as the video itself, and it maps straight
onto fields the CRM already has: `Guardian_Mobile` vs `Patient_Mobile`. It turns a phone
number into a segmented lead, so the first WhatsApp message can say something specific
*("for a Calm & Comfortable lifestyle, these are the three under ₹50,000")* instead of
something generic.

**Cost is not a factor at this scale.** WhatsApp marketing templates run ~**₹1.09 per
message** (Meta's rate rose ~10% on 2026-01-01; billing moved from per-conversation to
**per-message**). At 100 leads that is ₹109 a send. Decide on engagement, not cost.

## Retargeting at 50-100 people: mostly no, and the reason matters

Honest answer to the question Chintan raised:

| Audience type | Minimum |
|---|---|
| Meta Custom Audience (general) | **100 people**, 1,000 recommended |
| **Website-visitor retargeting** | **1,000 matched users** before ads deliver |
| **Customer list (email / phone upload)** | **no published minimum** |
| Practical floor to run consistently | ~150 |

So at 50-100:
- **Pixel/website retargeting will not run.** It needs 1,000 matched users. Not close.
- **A customer list can technically run** — no published minimum, ~150 in practice.

**The real conclusion: at this scale the list is not an ad asset yet, it is a nurture
asset.** Direct WhatsApp to 100 engaged people converts far better than spending on
ads to them. Build the list now so that retargeting becomes possible at 1,000; do not plan
media spend around it today.

One India-specific note if a customer list is ever uploaded: **phone numbers match to
Meta accounts at a higher rate than email in India**, because most Indian users register
with a phone number. That is an argument for eventually holding phone numbers — but for
*matching*, which is a separate purpose from *messaging*, and DPDP treats them separately.

## DPDP Act 2023 — this is not optional

India's data protection law binds all of the above:

- Consent must be **free, specific, informed, unconditional and unambiguous**, given by a
  clear affirmative action.
- **No pre-ticked boxes.** Inactivity is not consent.
- **Purpose-specific consent.** A WhatsApp opt-in alone does *not* license marketing
  messages. Transactional and marketing need **separate, separately-ticked** consents.
- From **February 2026**, timestamped consent records must be kept for every WhatsApp
  contact who receives marketing messages.

Practical design for the gate:
- Name + Mobile, plus **one unticked box** naming the purpose: *"You can message me on
  WhatsApp about my hearing questions."*
- Keep transactional and marketing consent separate — the unlock itself is transactional;
  the monthly nurture is marketing and needs its own affirmative tick.
- Store the timestamp, the wording shown, and the IP for every consent.

Healthcare-adjacent data raises the stakes here. Worth a lawyer's eye before launch.

## Top-of-mind for 30-45 in India

That age band is the buyer for a parent, and they are reachable. WhatsApp is the channel
that stays top-of-mind — 90-95% open against email's 18-25% — but the discipline is
cadence, not volume. Monthly, genuinely useful, and every message earning the next one.

Sequence that fits Synva's register:
1. **Immediately:** the content unlocks on the page
2. **~Day 3:** one WhatsApp message with the single most useful thing for their stated
   lifestyle, no ask
3. **Monthly:** one message, real value, soft consultation offer
4. **Never:** blast on price drops. It is the fastest way to become the thing Chintan
   built Synva against.

## The nurture system: Zoho Marketing Automation

Chintan's ask: a scheduled nurture that keeps adding people to a list, without building
it from scratch. **Zoho Marketing Automation (ZMA)** is the product, and it is the right
one because Synva already runs Zoho CRM.

| Product | Fit |
|---|---|
| **Zoho Marketing Automation** | **Yes.** Journey builder across **email, SMS, WhatsApp and web behaviour**, with native Zoho CRM sync. Lead profiles pull from forms, web behaviour and CRM records. ~$19-59/month. |
| Zoho Campaigns | Email marketing only. Easier to use, but no multichannel journey — not enough here. |
| Zoho CRM workflows / cadences | Already owned; good for internal follow-up tasks, not for a multi-step multichannel nurture. |

The journey to build is exactly the sequence below: form submit → CRM lead → day 0 asset
→ day 3 WhatsApp → monthly value → consultation offer, with branches on the lifestyle
answer.

**Two things to verify before committing:**
- Whether Synva's current Zoho plan includes ZMA, or it is a separate subscription.
- **WhatsApp needs a WhatsApp Business API account through a BSP regardless of tool.**
  ZMA orchestrates the sends; it does not remove the API setup, the template approval
  process, or the per-message cost.

Nothing here needs building from scratch. It needs configuring.

## ⚠️ The rule that disqualifies most lead-magnet ideas

**Never gate anything the website already gives away.**

Synva's catalogue is **public and indexed** — every model, every MRP, at
`/(shop)/hearing-aids/[category]` and `/(shop)/products/[slug]`, including
`product:price:amount` in the OpenGraph tags. So a price list, a model list or a spec
comparison **cannot be a lead magnet here.** The viewer hands over a phone number, unlocks
it, and finds the same thing free two clicks away. That costs more trust than the lead is
worth.

**Gate the interpretation, not the data.** The catalogue says what exists and what it
costs. It cannot say *which one is yours*. That judgement is the audiologist's, it is the
only thing on the site a competitor cannot scrape, and it is the one thing genuinely worth
a phone number. Every bonus should be a decision, a shortlist or a verdict — never a table.

## What this means for a video brief

- The bonus is a **Knowledge Hub post**, opening public, remainder gated on **name +
  mobile**.
- The `bonus` node board shows the URL and what they get, and the tease names it specifically.
- The video's description carries the link at the very top.
- **Set `Lead_Source = YouTube` and a UTM on every submission** so these leads are
  attributable. The CRM already uses both, so the reporting works on day one.
- The WhatsApp consent is a checkbox on the form, never a spoken ask in the video.

## Open items for Chintan

1. Confirm the Zoho plan covers ZMA, and whether a WhatsApp BSP is already in place.
2. **The existing base is the bigger prize.** Every lead in the CRM already has a mobile
   and most have no nurture at all. A back-fill journey over that base is worth more than
   anything one video will add — but it needs a lawful basis, since DPDP consent for
   marketing cannot be assumed retroactively from a walk-in or an ads enquiry. Worth legal
   input before the first send.
3. Decide the monthly message. One per month, real value, no price blasts.

## Sources

[Email + WhatsApp benchmarks India](https://blog.campaignhq.co/email-whatsapp-marketing-benchmarks-india/) ·
[WhatsApp vs email vs SMS open rates](https://nimblebiz.ai/blog/whatsapp-open-rate-vs-email-vs-sms-benchmarks) ·
[WhatsApp Business API pricing 2026](https://setsmart.io/blog/whatsapp-business-api-pricing) ·
[Meta custom audiences guide](https://benly.ai/learn/meta-ads/custom-audiences-guide) ·
[Why retargeting audiences are too small](https://tribeupacademy.com/meta-ads-retargeting-audience-too-small/) ·
[Gated content conversion statistics](https://www.amraandelma.com/gated-content-conversion-statistics/) ·
[When to gate content](https://www.benchmarkemail.com/blog/when-to-gate-content/) ·
[Consent under DPDP Act 2023](https://ksandk.com/data-protection-and-data-privacy/consent-under-dpdp-act-2023-compliance-strategies/) ·
[DPDP + WhatsApp Business](https://www.complyzero.com/blog/dpdp-whatsapp-business-compliance) ·
[WhatsApp opt-in compliance India](https://wa.expert/pages/whatsapp-opt-in-compliance-india)
