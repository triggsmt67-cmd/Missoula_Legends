# Missoula Legends — "You've Been Added" Outreach Sequence

**Type:** Directory notification outreach (3 emails, plain text, sent manually from Gmail)
**Sender:** trevor@missoulalegends.com
**Example recipient:** Garden City Plumbing & Heating (swap facts per business)
**Goal:** Get the owner to look at their live page and reply — a correction, an approval, or a removal request all count as wins. A reply starts the relationship.

---

## Sequence Overview

| # | Subject | Purpose | Timing | Ask | Exit trigger |
|---|---------|---------|--------|-----|--------------|
| 1 | wrote a page about Garden City Plumbing — did I get it right? | Notify + fact-check request | Day 0 (Tue–Thu, 9–11am) | Check the page, reply with corrections | Any reply |
| 2 | (same thread) | Bump with one specific fact question | Day 4–5 | Confirm one detail | Any reply |
| 3 | (same thread) | Close the loop, hand over the link, promise silence | Day 10–12 | None — takeaway | Sequence ends |

**Rules for every email:** plain text, no images, no logo, one link (their page), never mention True Path or upgrades, physical mailing address + removal line at the bottom.

---

## Email 1 — The Notification (Day 0)

**Subject options:**
1. wrote a page about Garden City Plumbing — did I get it right?
2. your page on Missoula Legends
3. Garden City Plumbing is in the Missoula registry — check me on the facts

*(Option 1 recommended. Specific, lowercase, implies they have final say.)*

**Body:**

> Hi [First name],
>
> I run Missoula Legends, a free local directory documenting the businesses that keep this town running. I wrote a page about Garden City Plumbing & Heating, built from public info:
>
> https://www.missoulalegends.com/directory/garden-city-plumbing-heating
>
> Before I treat it as final, I'd rather you check it. I've got you on Flynn Lane since 1985, Mon–Fri 7:30–5 with a 24/7 emergency line, and a crew that knows its way around the old hot-water boilers in the University District. If any of that's wrong, reply and I'll fix it the same day.
>
> The listing is free — no fees now or ever, and nobody can pay to outrank you. If you'd rather not be listed at all, say so and the page comes down. No hard feelings.
>
> Trevor Riggs
> Missoula Legends
> [phone]
>
> [Mailing address, Missoula, MT]
> Don't want to hear from me? Reply "remove" and that's the end of it.

**Why it works:** delivers news, not an ask. The three specific facts are the hook — owners reply to correct facts about themselves far more reliably than they reply to "claim your listing." Personalize those three facts per business from your directory pipeline; that one step is the difference between 3% and 10%+ replies.

---

## Email 2 — The Bump (Day 4–5, reply in same thread)

**No new subject — reply to your own email so the thread stacks.**

**Body:**

> [First name] — quick one.
>
> I'm finalizing the Plumbing & HVAC section this week and want your page airtight before furnace season. One thing I couldn't verify: the page says 24/7 emergency line year-round. Still true?
>
> If I don't hear back I'll leave everything as is — you can change it anytime.
>
> Trevor

**Why it works:** it's three sentences, asks one yes/no question, and gives a reason for the timing (furnace season) that's about *them*, not you. "If I don't hear back I'll leave it as is" removes all pressure — which is exactly what makes people answer. Swap the question per business: pick the one fact you're least sure of.

---

## Email 3 — Close the Loop (Day 10–12, same thread)

**Body:**

> Last note from me, [First name].
>
> Your page is live and it stays up either way: https://www.missoulalegends.com/directory/garden-city-plumbing-heating
>
> It's yours to use — link it, text it to whoever asks if you've got a website, put it on the truck. Nothing to sign up for, nothing to buy, and I won't email you about it again.
>
> If you ever want something changed or taken down, one email to trevor@missoulalegends.com and it's done.
>
> Trevor Riggs
> Missoula Legends
> [Mailing address, Missoula, MT]

**Why it works:** the explicit "I won't email you again" is the whole play. It proves every claim the first two emails made, and it's the email that gets forwarded to a spouse or business partner. Counterintuitively, the goodbye email often pulls the most replies.

---

## Flow Logic (manual version)

```
Send Email 1 (Day 0)
   |
   Reply? --Yes--> EXIT. Respond personally within a few hours.
   |               Fix the page, send the updated link, done.
   No
   |
Send Email 2 (Day 4-5, same thread)
   |
   Reply? --Yes--> EXIT. Same as above.
   |
   No
   |
Send Email 3 (Day 10-12, same thread)
   |
   [SEQUENCE COMPLETE — never email again unless they write first]
```

**Exit conditions (stop the sequence immediately):**
- Any reply, including "remove" — honor removal same day
- They submit the claim/update form on the site
- Hard bounce — mark the address dead, don't retry

**Suppression:** never enroll a business you have any client or personal relationship with through True Path — those get a personal note, not this sequence.

---

## List Prep (do this before wave one)

1. **Verify every address.** Run the list through NeverBounce or ZeroBounce (~$0.008/email), or hand-check against the business's website/GBP listing. Remove invalid and "catch-all risky" addresses. Bounces are the fastest way to torch a fresh sending domain.
2. **Dedupe by business, not by email.** Trades lists often have the owner's personal address AND an office/info@ address for the same shop. One contact per business — prefer the owner's name-based address over info@ or contact@.
3. **Prefer addresses found on their own website** over scraped ones. If it's published on their site, it's monitored and it's fair game.
4. **Log the source** of each address in your tracking sheet. If a batch underperforms, you'll know whether it's the list or the copy.

## Sending Mechanics

- 15–25 sends/day max, Tue–Thu
- Default window 9–11am; worth testing 7–8am — shop owners are often at the desk before the bays open, and inboxes are emptier
- Verify SPF, DKIM, and DMARC on missoulalegends.com **before** wave one (check at mxtoolbox.com)
- Track in a simple sheet: business, contact, date sent 1/2/3, replied?, outcome
- BCC yourself or use Gmail labels — you need to know which thread is at which stage

---

## What "Working" Looks Like

| Metric | Floor | Good | Fix something if |
|--------|-------|------|------------------|
| Reply rate (whole sequence) | 8% | 15%+ | under 5% |
| Removal requests | — | under 3% | over 8% |
| Spam complaints | 0 | 0 | any |

Review after the first 50 sends. If replies are low, the problem is almost always the personalization line in Email 1 or bad contact addresses — fix those before touching the copy.

## A/B Ideas (only after 50+ sends)

1. **Email 1 subject:** "did I get it right?" framing vs. plain "your page on Missoula Legends"
2. **Email 2 question type:** hours/facts question vs. "anything you'd want added?"
3. **Email 3 screenshot test:** plain text vs. one cropped screenshot of their page (see below)
4. Don't test send time or length yet — volume is too low for signal.

## Screenshots: when and how

**Not in Email 1.** Images raise spam scoring on first-touch cold email, and a screenshot kills the reason to click. Plain text is what makes it read like a note from a person.

**Where screenshots earn their keep:**
- **In your reply after they respond** — always. They've engaged; now show them the page looking good.
- **Email 3, as a test variant** — for owners who never clicked, seeing the page may be the only way they ever see it. Thread already exists, so the deliverability risk is lower than first touch.

**How to crop:** just the business name + the "Why It's Listed" quote block. That's the flattering, unmistakably-about-them part. Don't include hero images that are generic Missoula stock (the M hillside, downtown skyline) — a photo that obviously isn't their shop undercuts "this is YOUR page." If their listing has a real photo of their building or trucks, lead with that crop instead.
