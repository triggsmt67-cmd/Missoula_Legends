# Missoula Legends

The digital registry and editorial guide for Missoula, Montana.

## Start here next session

The existing design and server-backed content are the baseline. This project uses Next.js, Payload CMS, server-hosted PostgreSQL, Vercel Blob media and Vercel hosting. A frontend without CMS content is **not a valid visual preview**.

1. Verify the checkout, branch, remote and pending work before editing:

   ```bash
   git status --short
   git remote -v
   git fetch origin
   git log -5 --oneline
   git rev-list --left-right --count HEAD...origin/main
   ```

   Repository: [triggsmt67-cmd/Missoula_Legends](https://github.com/triggsmt67-cmd/Missoula_Legends). Production branch: `main`. Preserve local drafts and unrelated changes; reconcile upstream work before releasing.
2. Read `AGENTS.md` and the relevant installed guides under `node_modules/next/dist/docs/` before changing Next.js code.
3. Inspect the [live website](https://www.missoulalegends.com/) and [Vercel project](https://vercel.com/trevor-riggs-projects/missoula-legends). Verify the current deployed commit and CMS content; this dated checkpoint may no longer be the latest state.
4. Compare a populated, server-backed preview against live at the same viewport size and color mode. Check the sponsor, images, featured story, recent businesses, history feature, gallery and curator content.
5. Keep fixes scoped. SEO and bug fixes should preserve the approved layout, images, sponsor settings and editorial content.

## Latest verified application release — November 25, 2026

| Item | Checkpoint |
| --- | --- |
| Application commit | [`478bf7f`](https://github.com/triggsmt67-cmd/Missoula_Legends/commit/478bf7fefc7d6b1aa0518b423273c464faf65ee5) — mobile, security, form, calendar and SEO fixes |
| Production | [www.missoulalegends.com](https://www.missoulalegends.com/) |
| Vercel deployment | [`dpl_MCibodw94EYY2f571FiZx6TfkFJZ`](https://vercel.com/trevor-riggs-projects/missoula-legends/MCibodw94EYY2f571FiZx6TfkFJZ) — verified READY |
| Versions | Next.js `16.3.8`, Payload `3.90.2`, React `19.2.4`; Vercel Node.js `24.x` |
| Release scope | 33 source, test and lockfile files; existing production database connection and CMS records retained |

Later documentation commits may sit above this application commit without changing application behavior.

### What shipped

- **Mobile rendering:** reveal sections remain visible in server-rendered HTML, support reduced motion and reveal tall sections correctly. The menu closes at desktop width and restores scrolling. The claim header fits a 320px screen.
- **Public data safety:** public Payload reads enforce access rules. Internal research notes, open questions and marketing grades require authentication. Directory search receives an explicit public-field projection.
- **Revalidation:** POST-only, authenticated CMS session or existing bearer-secret automation, origin/path validation and rate limiting. GET no longer mutates the cache.
- **Claim submissions:** success requires provider acceptance with an email ID. Provider failures return an error; the form retains its values rather than reporting false success.
- **Calendar synchronization:** all feeds must succeed before replacing events. Replacement is transactional; shared media records are retained.
- **Schema:** corrected undefined and inaccurate business/history types, removed invented landmark founding dates and forced history addresses, unified publisher/logo/author identities, and added linked author bylines. Unknown dates are omitted rather than replaced with the current time.
- **Search and canonicals:** URL queries initialize the input/results; ItemList schema matches initial filtered results; category aliases use valid parent URLs. Empty categories are omitted from the sitemap and marked noindex until populated.
- **Crawlers and sharing:** one robots.txt group applies private-path exclusions consistently. Directory/category social images and inherited Twitter metadata were corrected.
- **Build/assets:** repaired the npm lockfile for clean installs. Existing public images were restored; no image deletion was released.

### What was verified

These counts and business details were observed on November 25, 2026; recheck them next time:

- 57 tests passed; one optional history-story fixture test was skipped. Lint, TypeScript and an isolated production build passed.
- All 79 current or previous sitemap pages returned HTTP 200. All 78 URLs in the revised sitemap had matching declared canonicals, one H1 and parseable JSON-LD. No undefined Schema.org types were detected.
- Home & Lodging remained accessible but empty, noindex and excluded from the sitemap. It becomes indexable again when populated.
- Homepage text, sections and Benchmark Automotive Service sponsorship matched the approved preview and prior live site. All 13 displayed homepage images loaded.
- Checks at 320px and 375px passed for horizontal page overflow and menu/scroll recovery.
- `/directory?search=Blackfoot` displayed 2 of 45 results; the shopping query's schema contained the same 8 businesses as its initial view.
- Anonymous directory responses omitted the three private fields. GET `/api/revalidate` returned 405; unauthenticated `/api/sync-events` returned 401.
- No runtime error/fatal log groups were returned for the new deployment during post-release checks. No external log drains were configured.

Real claim-email delivery, production calendar replacement, authenticated CMS writes and a real Notion draft transfer were **not triggered** by this verification. Search Console indexing, Google-selected canonicals and ranking changes remain unverified.

## Preview correctly before another release

The earlier empty preview omitted CMS-driven sections, showed fallback sponsorship and lacked images. Passing a build did not establish content or visual parity.

- Use the existing server's published CMS content, active sponsor globals and media URLs for visual review.
- The approved local comparison used anonymous **GET-only reads of the production CMS REST API** in a temporary frontend copy. It used no local database or production database credentials. Preview-only imports and its submission-blocking proxy were not deployed.
- Do not point ordinary local development at production PostgreSQL. `src/payload.config.ts` enables schema push for development; preserve production data and configuration.
- Keep public image files that remain in use. Blob-hosted images do not automatically replace every local card, fallback, social image or badge download.
- Match viewport/color mode. Use UTC for server formatting to match production date-only values.

On the original workstation, the corrected preview was left on [port 3018](http://127.0.0.1:3018/). Its local runner is:

```bash
python3 scratch/preview-repair/run.py
```

Check the listener's PID and working directory before starting or stopping a server. Port 3017 was an older test copy, not the approved preview.

`scratch/` is ignored and its build lives in a temporary directory. This runner is a **local convenience, not fresh-clone setup**. If the helper/build is gone, recreate a read-only, server-content preview from the current source before approving visuals. Do not substitute an empty database or sample sponsor and treat it as the real site.

Detailed audit, preview and release evidence is local-only under `docs/audits/2026-11-25/`, especially `release-478bf7f/release.md`. Those files/screenshots were not pushed and may be absent in a fresh clone. The durable release checkpoint is summarized above.

## Developer workflow

Use Node.js 24.x and the committed npm lockfile. From the project root:

```bash
npm ci
npm test
npm run lint
npx tsc --noEmit
```

These code checks do not require production database or mail credentials. Keep the lockfile; investigate install errors rather than deleting it.

For an optimized build, use a clean isolated copy without production `.env` files or credentials. Production configuration requires `PAYLOAD_SECRET`; an isolated compile check can use a synthetic value. Building without CMS data checks compilation, **not visual parity**. Vercel builds the actual release with the existing production environment.

### Code map

| Area | Start with |
| --- | --- |
| Public pages/metadata | `src/app/(app)/` |
| CMS/admin and REST integration | `src/app/(payload)/`, `src/payload.config.ts` |
| CMS fields/access rules | `src/collections/`, `src/globals/` |
| Business schema/media URL helpers | `src/lib/schema-utils.ts` |
| Publisher, author and date schema | `src/lib/editorial-schema.ts` |
| Directory search/category rules | `src/lib/directory-search.ts`, `src/lib/directory-categories.ts` |
| Public client-data projection | `src/lib/public-directory.ts` |
| Sponsor normalization | `src/lib/sponsorship.ts` |
| Mobile menu/reveal behavior | `src/components/Header.tsx`, `src/components/ScrollReveal.tsx`, `src/app/globals.css` |
| Claim form/handler | `src/app/(app)/claim/`, `src/app/api/claim/route.ts` |
| Calendar replacement | `src/app/api/sync-events/route.ts`, `src/lib/replace-events.ts` |
| Crawl discovery | `src/app/robots.ts`, `src/app/sitemap.ts` |
| Regression coverage | `tests/` |

### Related workflow: history drafts

See [the history-draft workflow](docs/history-draft-workflow.md) for the receiver contract. The separate draft-only importer was preserved by this release. Check current sender/deployment state before changing anything: the setup guide includes historical pilot notes and does not prove the sender is still disconnected. The original workstation also has a local-only `docs/history-draft-handoff.md` recording the later setup. Do not rotate secrets or resend a story merely because a setup note is old.

### Release procedure

1. Reconcile with `origin/main` and preserve unrelated work. The GitHub repository is public: keep credentials, private handoffs, unrelated drafts and preview helpers out of commits.
2. Review the exact staged files. Run checks appropriate to the change; for application changes, compare a populated preview against the current live site before publishing.
3. Push only requested changes to `main`. Vercel's Git integration builds production automatically; avoid creating a second deployment unnecessarily.
4. Confirm Vercel's commit SHA and READY status, then inspect the real custom domain. READY alone does not prove correct content/rendering.
5. Check sponsor/content/images, mobile navigation and changed routes. Verify sitemap/canonicals/schema when SEO changed; inspect runtime errors for that deployment.
6. Record the application commit, deployment, date, results and remaining limitations here or in a durable release note. Distinguish documentation commits from application releases.

Keep secrets in the appropriate server environment, never in the README, logs or chat. A real email, CMS write, calendar synchronization or Notion transfer needs a deliberate verification plan rather than being a side effect of checking a deployment.

## Photography & Asset Guide

To maintain the "Million Dollar" editorial aesthetic of the site, please ensure uploaded photography adheres to the following aspect ratios and minimum dimensions before publishing. 

### Homepage Placements

* **Homepage Sponsor Card**
  * Use the approved sponsor logo or photo selected through Payload's active homepage sponsor settings.
  * Check the circular crop on desktop and mobile. The CMS relationship determines the sponsor; do not hardcode a sample business.

* **Main Featured Article (Top Left)**
  * **Aspect Ratio:** 16:10 (Wide Landscape)
  * **Recommended Size:** `1600 x 1000px`

* **Explore Missoula Pillars (6 Categories)**
  * **Aspect Ratio:** 4:5 (Portrait)
  * **Recommended Size:** `800 x 1000px`
  * **Note:** These are full-bleed posters. Ensure the primary subject of the photo is centered so it doesn't get clipped by the text.

* **Missoula Events Calendar (Sidebar List)**
  * **Aspect Ratio:** 1:1 (Square) or 4:3 (Landscape)
  * **Recommended Size:** `800 x 800px`

* **Dining Guide (Horizontal Cards)**
  * **Aspect Ratio:** 4:3 (Landscape)
  * **Recommended Size:** `800 x 600px`

* **Footer Parallax (Final CTA Background)**
  * **Aspect Ratio:** 16:9 or wider (Panoramic)
  * **Recommended Size:** `2400 x 1350px`
  * **Note:** This image sits completely full-bleed behind the final block. Wide, moody, and textured images work best here to contrast the white typography.

* **Curator Spotlight (Headshot)**
  * **Aspect Ratio:** 1:1 (Square)
  * **Recommended Size:** `400 x 400px`

### Automatic Image Resizing & Formats (Payload CMS)

When you upload any image to the Media collection, the server automatically processes and generates two additional cropped sizes:
* **`thumbnail`**: `500 x 375px` (4:3 Landscape, centered crop) — Used for small listing previews and admin previews.
* **`featureHero`**: `1400 x 700px` (2:1 Wide Landscape, centered crop) — Used for large page banners and wide display areas.

#### 💡 WebP Optimization Recommendation
To save Vercel Blob storage space and keep your website running fast:
* **Upload images in `.webp` format:** JPEG/PNG images are often several Megabytes (MB). Converting them to WebP first drops the size to **100KB - 300KB** with no visible loss of quality.
* **Why it matters:** Every upload creates **three files** in Vercel Blob (the original + the two resized formats above). Using WebP saves up to 90% of storage and bandwidth.
* **Conversion Tools:** You can easily convert your images to WebP for free using Google's **[Squoosh.app](https://squoosh.app/)** or **[TinyPNG](https://tinypng.com/)** before uploading.

---
