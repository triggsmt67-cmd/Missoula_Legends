# Missoula Legends — Pre-Launch Fix List

Work top to bottom. Tier 1 blocks outreach; Tier 2 before GSC indexes deep; Tier 3 when convenient.

## Tier 1 — Before the first outreach email goes out

- [ ] **Real photos on trades profiles.** Replace the generic Missoula hero (M hillside / twilight valley) on every business you plan to email — building, trucks, or shop front. Also set each page's og:image to the real photo, since that's what shows when the link is shared or texted.
- [ ] **Verify SPF, DKIM, DMARC on missoulalegends.com** (mxtoolbox.com). Required before wave one of outreach.
- [ ] **Fill or hide empty listings.** Deals on Wheels has no description. A thin page next to rich ones undercuts the "every business gets a real write-up" pitch.
- [ ] **One CTA everywhere.** Mission page says "Become a Legend → /spotlight"; everything else says "Get Listed Free → /claim". Pick /claim, kill or redirect /spotlight.

## Tier 2 — Before Google indexes deeply (this week)

- [ ] **HTML sitemap still links the dead article slug** (`/articles/trevortruepath406com`). Update to `/articles/lolo-creek-distillery`. Check the XML sitemap for the same stale URL.
- [ ] **Fix duplicate H1 + polluted meta descriptions on articles.** Lolo Creek article has a second `#` H1 in the body, and the raw `#` bleeds into the meta description ("...built something else.# Lolo Creek Distill..."). Audit all articles for the same pattern — one H1 per page, clean descriptions.
- [ ] **Cap directory card previews at 2–3 sentences.** Blackfoot's card dumps ~800 words with raw headers inline; Bitterroot Welding's does the same. Ragged cards read as unfinished.
- [ ] **Reconcile category structure.** Homepage pillars (Trades & Services → /tradesmen) vs. sitemap's six separate trade sectors (auto-repair, plumbing-hvac, septic-excavation, towing, welding-fabrication, electrical) plus Automotive, which isn't a pillar. One hierarchy, consistently linked.
- [ ] **Fix inconsistent History nav link** — some pages link /history, others /history/stories.

## Tier 3 — High-leverage, not blocking

- [ ] **Add LocalBusiness JSON-LD to every profile** (name, address, phone, geo, hours, sameAs → their website/GBP). Correlates with ~45% higher AI citation rates.
- [ ] **Surface the FAQs onto profile pages** with FAQPage schema. The Q&As already exist in your Notion pipeline — this is publishing, not writing.
- [ ] **Add Review/aggregateRating markup** where you cite real ratings in write-ups (e.g., BRO's 4.9 stars).
- [ ] **Skip llms.txt** — 2026 bot-traffic data shows it's barely read. Schema + unique editorial text is what earns AI citations, and you already have the second half.

## Quick QA pass before showing anyone

- [ ] Click every nav link on mobile.
- [ ] Share a profile link to yourself in a text — check the preview image and title.
- [ ] Google `site:missoulalegends.com` after indexing starts; check titles/descriptions read clean.
- [ ] Submit both a nomination and a claim form to confirm they arrive.
