---
name: video-topic
description: >
  Pick and validate the next video topic and title using live YouTube demand data from
  the vidIQ MCP, before any research or board work starts. Finds the real competitive
  set, hunts outlier videos, checks keyword demand, and scores title candidates, then
  writes the evidence into videos/<slug>/00-topic.md. Use whenever Chintan asks what
  video to make next, wants a topic validated or compared against others, or wants title
  options. Triggers: "what video should I make", "validate this topic", "is this topic
  worth it", "title ideas", "check demand for", "what's working in the niche".
---

# Video topic — pick it on evidence, not instinct

**Step 0 of the board pipeline.** Everything downstream assumes the topic is already
chosen; this is the step that chooses it.

```
0. video-topic → 1. video-research → 2. video-hook → 3. video-mindmap → 4. figma-board-svg
```

Writes into `videos/<slug>/00-topic.md`, the file `npm run new-video` seeds.

## Two data sources, and they are not interchangeable

**Facts come from the YouTube Data API. Insight comes from vidIQ.** Chintan's rule,
2026-07-28: be direct where you can be, and spend credits only on what vidIQ does better.

| Use | Source |
|---|---|
| What videos exist, titles, publish dates, durations, views, likes, comments | **[lib/youtube.mjs](../../../lib/youtube.mjs)** — free, complete, no credits |
| Long vs Short split, views/day, age-normalised comparison | **lib/youtube.mjs** |
| Breakout score (over-performance vs channel baseline) | vidIQ |
| Keyword volume / competition / opportunity | vidIQ |
| Outlier discovery across channels, competitor sets | vidIQ |
| Title and thumbnail scoring | vidIQ |

`longFormVideos()` filters Shorts by duration. `viewsPerDay()` is the fair comparison
across videos of different ages — **use it, not raw views.** A 60-day-old video and a
300-day-old one are not comparable on totals, and view curves are front-loaded, so a
*newer* video showing *lower* views/day is a genuinely weak result, not an immature one.

Credentials are read live from the website repo's `.env.local`, never copied here.

**The API is also more current than vidIQ.** Verified 2026-07-28: vidIQ still reported a
video under a title Chintan had since changed. When the two disagree on a fact, the Data
API wins.

## Requires the vidIQ MCP

Server: `https://mcp.vidiq.com/mcp`, already configured as the `claude.ai vidIQ for
Claude` connector. If it reports **Needs authentication**, stop and tell Chintan to
authorize it — do not fake the numbers, and do not fall back to WebSearch and present
that as demand data. A guessed search volume is worse than no search volume.

**Discover the tools at run time** with `ToolSearch` (`vidiq`, or `+vidiq keyword`).
Roughly 34 tools exist. Do not hardcode names from this file; vidIQ can rename them.
The ones that matter here, as vidIQ documents them:

| Tool | Use |
|---|---|
| `outliers` | videos that beat their own channel's baseline — **the strongest signal** |
| `similar_channels` | who the real competitors are, which is rarely who you'd guess |
| `channel_search` | find channels by filter |
| `channel_stats` | audit a channel, including Synva's own baseline |
| `keyword_research` | demand and competition for a phrase |
| `youtube_search` | search YouTube directly |
| `trending_videos` | formats working right now |
| `video_stats` | reverse-engineer one video's performance over time |
| title / thumbnail scoring | score a title candidate |
| `video_watch` | frame-by-frame retention, pacing, hook strength (10 credits) |

**Credits are real money.** Most calls cost 5, `video_watch` costs 10, and they draw on
the shared vidIQ pool. Budget **8-12 calls** for a topic decision. Never spray calls
across every phrasing of a keyword; pick the 2-3 that actually differ in meaning. There
are free utility tools for credit balance and connected channels — check the balance
first if you're about to run a long session.

## Process

### Step 1 — Establish the competitive set

Don't assume it. `similar_channels` from Synva's channel, plus a `channel_search`
constrained to the niche. You're looking for the handful of Indian hearing-aid and
audiology channels that actually compete for the same viewer, not the global giants
whose numbers mean nothing at Synva's scale.

> ⚠️ **LONG FORMAT ONLY. This is the rule that matters most in this skill.**
>
> `similar_channels` returns `avgViews` as lifetime views ÷ **all** videos, Shorts
> included. In this niche that number is worthless and actively misleading: ear-impression
> and ear-wax ASMR Shorts pull tens of thousands of views and produce **zero leads**, so a
> channel can look 40x bigger than it is on the only content that matters.
>
> Verified 2026-07-28: HearinGuru showed `avgViews` ~189,100 and read as the dominant
> competitor. Its actual best long-form video is **3,217 views**, and most of its
> long-form is 15-60 second promos in the 20-300 view range. Synva's best long-form is
> **15,192**. The blended metric inverted the true picture completely.
>
> So: **never quote `avgViews` as a competitive fact.** Pull each serious competitor's
> real long-form with `channel_videos(channelId, videoFormat: "long", popular: true)` and
> compare against Synva's long-form. If you cite a competitor number, it came from that
> call or it doesn't go in the file.

Record the set. It's reusable across future topic decisions.

### Step 2 — Hunt outliers, not view counts

`outliers` across that set, **always with `contentType: "long"`** — the default is `all`
and silently mixes Shorts in. Scope with `channelIds` to the real competitive set rather
than a global keyword sweep, or you get US channels and adjacent niches instead of the
people competing for the same viewer.

A video with 40k views on a channel that averages 4k is a far better signal than a 400k
video on a channel that averages 500k. The first says *this subject pulled*; the second
says *this channel is big*.

**Rank Synva's own long-form by `viewsPerDay()` from [lib/youtube.mjs](../../../lib/youtube.mjs)
first — that costs nothing — and only then spend vidIQ credits on breakout scores for the
handful worth understanding.** Synva's own over-performers are stronger evidence than any
competitor's, because they already control for this audience, this presenter and this
format. A topic that matches a proven Synva cluster beats one that matches someone else's.

**Check the proposed topic against the near-neighbours that already exist.** If Synva has
published something adjacent, its views/day is the single best predictor available, and it
outranks every keyword score. Verified 2026-07-28: price-band videos decline monotonically
as the band rises (₹25k → 17.2 v/day, ₹50k → 12.6, ₹1L → 6.8), which is invisible in
keyword data and decisive for topic choice.

For each outlier worth noting: the subject, the angle, why you think it over-performed,
and whether Synva can say something **different** about it, not just say it again.

### Step 3 — Check demand on the candidates

`keyword_research` on 2-3 candidate framings. What you want is the shape: is there
steady demand, is competition beatable, is there a long-tail phrasing that's under-served.

**Read direction, not magnitude.** Indian hearing-aid search volume is thin and noisy.
A low number does not kill a topic Chintan gets asked weekly in the clinic — that gap
between low search volume and high real-world frequency is usually an *opportunity*,
because it means nobody has made the video that answers it.

### Step 4 — Titles

Draft 3-4 candidates against the angle, then score them. Use the scoring as a check
that you haven't drifted off how people actually phrase the problem — not as the author.

Chintan's angle is usually contrarian ("you don't need to spend more"), and keyword
tools systematically reward conventional phrasing. When the score and the reframe
conflict, **the reframe wins** and you note the tradeoff.

### Step 5 — Write the decision down

Append to `videos/<slug>/00-topic.md`:

```markdown
---

TOPIC EVIDENCE (vidIQ, YYYY-MM-DD, <n> credits)

COMPETITIVE SET
- <channel> — <subs / avg views> — <what they own>

OUTLIERS WORTH NOTING
| Video | Channel | Views vs baseline | Why it pulled | Can Synva say something different? |
|---|---|---|---|---|

DEMAND
| Candidate framing | Volume | Competition | Read |
|---|---|---|---|---|

TITLE CANDIDATES
| Title | Score | Note |
|---|---|---|

CHOSEN: <title>
WHY: <2-3 sentences — the evidence plus the angle it doesn't capture>
AGAINST THE DATA: <anything you're doing despite the score, and why>

---
```

Then hand off: `video-research` for the slug.

## What this tool cannot tell you

Write these into the decision when they apply. They are the difference between using
vidIQ and being used by it.

- **It cannot see leads, and leads are the point.** Synva's long-form videos produce
  consultations; Shorts produce view counts. vidIQ reports both as "views" and cannot
  tell them apart. A Short that pulls 40k and converts nobody will outrank, in every
  vidIQ metric, a 3k long-form video that fills the calendar. **Never rank a topic on
  channel-level view growth** — check what format drove it first (Chintan, 2026-07-28).
- **It is a lagging indicator.** It measures what already exists and already worked,
  which structurally pulls toward the middle of the distribution. Synva's actual
  differentiator — a practising audiologist saying "don't buy the expensive one" — has
  no search volume precisely because nobody else is making it.
- **It knows nothing clinical.** It cannot tell you whether a tier jump is meaningful or
  marginal in a real fitting. That's the experiential batch in `video-mindmap`, and it
  comes only from Chintan.
- **It doesn't know Synva's customers.** A question three people asked in the Experience
  Center this month is real demand that no keyword tool can see.

**Rule:** vidIQ picks between topics Chintan is already willing to make. It does not
decide what Synva believes.

## Hard rules

1. **Never fabricate a metric.** If the MCP is unauthorized or a call fails, say so and
   leave the section empty. No estimated volumes, no guessed view counts.
2. **Long format only, everywhere.** `contentType: "long"` on every `outliers` call,
   `videoFormat: "long"` on every `channel_videos` call, and **never** quote
   `similar_channels.avgViews` — it blends Shorts and inverts the ranking. Shorts may be
   reported separately as a distinct metric, never mixed into a competitive comparison.
3. **Discover tool names at run time.** Don't hardcode them from this file.
4. **Budget the credits** — 8-12 calls for a topic decision, check the balance first for
   a long session.
5. **Cite the tool and date** for every number that lands in `00-topic.md`.
6. **The reframe beats the score.** Record the disagreement rather than resolving it in
   the data's favour by default.
7. **vidIQ is read-only** and so is this skill — it never posts, renames, or changes
   anything on the channel.
