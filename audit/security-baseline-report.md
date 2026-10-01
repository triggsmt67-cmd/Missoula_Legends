# Security Review: missoula-legends-audit

## Scope

Complete application-source review at latest origin/main b4d7539; overall validation partial due external integration and deployment follow-ups.

- Scan mode: repository
- Target kind: git_revision
- Target ID: target_sha256_fe140316f58c60717dc79ba17c6e8a843294613439ceb88bd8b33e7e1e407ef4
- Revision: b4d7539a6a496e7ef5acf9349bc7dbf403691e48
- Inventory strategy: repository
- Included paths: .
- Excluded paths: none

Limitations and exclusions:
- Live deployment and production Notion automation not exercised; external-feed and dependency follow-ups remain.
- Excluded \*\*/\*.{png,jpg,jpeg,webp,ico}: Binary assets contain no application implementation.
- Excluded \*.md: Static prose/marketing briefs; AGENTS and README operational guidance read.
- Excluded node_modules/\*\*: Dependency audit separate; installed Payload access semantics inspected.

### Scan Summary

| Field | Value |
| --- | --- |
| Scan outcome | completed |
| Reportable findings | 5 |
| Severity mix | medium: 5 |
| Confidence mix | high: 5 |
| Coverage | partial |
| Validation mode | static source and isolated local reproduction |

Canonical artifacts: `scan-manifest.json`, `findings.json`, and `coverage.json`. This report is a deterministic projection of those files.

## Threat Model

Missoula Legends is a Next.js 16/Payload 3 public editorial registry on Vercel, backed by PostgreSQL and Blob; server pages, Payload REST, independent-secret Notion/intake/cron routes, and Resend submissions form distinct boundaries (package.json:5-21; src/payload.config.ts:74-94; vercel.json:2-6).

### Assets

- CMS identities with broad authenticated CRUD; five-attempt/ten-minute login lockout (src/collections/Users.ts:8-20).
- Publication, listing and relationship integrity of directory/articles/history/gallery (src/collections/Directory.ts:8-21; src/collections/Articles.ts:35-46).
- Internal notes, public cache availability, submission information and spending authority (src/collections/Directory.ts:487-494; src/app/api/revalidate/route.ts:4-14; src/app/api/send-email/route.ts:140-148).
- Environment references PAYLOAD_SECRET, DATABASE_URI/POSTGRES_URL, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY, NOTION_SYNC_SECRET, INTAKE_SECRET, CRON_SECRET and optional GEMINI_API_KEY; no secret values copied.

### Trust Boundaries

- Anonymous REST readers receive collection publication/listing filters; public Local API queries bypass these by default unless overrideAccess:false (src/app/api/\[...slug\]/route.ts:10-16; src/collections/Directory.ts:12-21; src/app/(app)/articles/\[slug\]/page.tsx:198-209).
- CMS authenticated users already have broad management authority; no lower-privilege role separation declared (src/collections/Users.ts:12-20).
- Intake secret -\> create/list/delete directory with explicit overrideAccess:true. Browser stores capability in localStorage (src/app/(app)/intake/actions.ts:23-47,64-95; src/app/(app)/intake/page.tsx:25,52).
- Notion production secret via Bearer/header/query -\> slug-selected upsert/publication; development bypasses auth; full body logged (src/app/api/notion-sync/route.ts:350-374,511-615).
- Cron requires Bearer CRON_SECRET and x-vercel-cron:1 outside development. Three fixed HTTPS RSS paths feed image URLs fetched with redirects and no destination/byte/time control; bytes go to media, then events/media are replaced (src/app/api/sync-events/route.ts:180-212,223-279,353-399).
- Public forms -\> fixed operator mailbox through Resend, with escaped HTML, checked replyTo, honeypots and process-local rate limits (src/app/api/claim/route.ts:34-84; src/app/api/send-email/route.ts:36-148).
- Stored content -\> JSON-LD and sponsor executable scripts. Unsafe serialization crosses content-to-code boundary; CSP allows unsafe-inline (src/lib/schema-utils.ts:707-709; src/components/SponsorRecordCard.tsx:13-25; next.config.ts:5-8).
- Runtime DB chooses DATABASE_URI then POSTGRES_URL, rejects localhost on Vercel, adds uselibpqcompat=true; pool max3 and push:true. Operator pg scripts use raw URI precedence without these transformations; seed reads cwd/public/media and deletes configured records (src/payload.config.ts:29-48,77-94; migrate-slugs.js:9-36; src/scripts/seed.ts:17-64).
- Blob token selects store, public configured delivery host is 1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com; media writes need user but storage delivery bypasses access, local staticDir is public/media (src/collections/Media.ts:9-36; src/payload.config.ts:86-94).
- Gemini receives event prompt using optional key and four-second timeout fallback; Resend sends to trevor@truepath406.com using configured sender/fixed claim sender (src/app/api/sync-events/route.ts:121-176; src/app/api/claim/route.ts:59-84; src/app/api/send-email/route.ts:140-148).

### Attacker Capabilities

- Anonymous visitors control URL slugs, revalidation paths, form inputs and REST requests; no initial shared-secret/CMS authority.
- Content authors can influence synchronized or stored text, but publishing text must not imply executing code in visitor browsers.
- External event publisher can influence RSS content only if feed supports that; public control of arbitrary image URL not established.
- Operator maintenance runners already hold DB authority; no remote executable interface established.

### Security Objectives

- Enforce published/listed rules on public queries and relationship population; protect internal fields from API and client props.
- Keep independent secret-based imports/actions and authenticated CMS mutations distinct.
- Encode content safely at script sinks; restrict import network/resource authority and avoid sensitive logs.
- Maintain accurate Notion fields while keeping database validation read-only as user scope.

### Assumptions

- No deployed configuration, actual DB privileges, proxy header trust or live-secret validity verified. No connected DB writes or live exploitation.
- No SECURITY.md found; policy resolver returned empty output. Independent architecture/baseline/frontend review completed.
- Notion schema and rows verified read-only: Neighborhood/Context/Description are text; context absent in webhook; unknown exact neighborhoods skipped; Description mapped.
- Database/Blob identities remain environment-dependent; staticDir absolute handling and external ingress quotas not verified.
- Development auth bypass assumes dev not remotely exposed or connected to production. Rate limiting is process-local with no inactive-key eviction.
- Dependency audit found 14 advisories including critical Next ImageResponse; no next/og route found, so that exploit path is not established. Updates tracked in remediation report.
- Neighborhood Context admin description claims structured metadata but only subheader is consumed; JSON-LD currently uses neighborhoodLabel. This is functional gap, not separate security issue.

## Findings

| Finding | Severity | Confidence | Detailed write-up |
| --- | --- | --- | --- |
| [Public directory responses expose internal research notes](#finding-1) | medium | high | inline below |
| [Sponsor content is interpolated into executable browser scripts](#finding-2) | medium | high | inline below |
| [Anonymous requests can invalidate public page caches](#finding-3) | medium | high | inline below |
| [Published content can escape JSON-LD script elements](#finding-4) | medium | high | inline below |
| [Public pages can render unpublished CMS documents](#finding-5) | medium | high | inline below |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct evidence supports the finding with no material unresolved blocker. |
| medium | Evidence supports a plausible issue, but material runtime or reachability proof remains. |
| low | Evidence is incomplete and the item is retained only for explicit follow-up. |

<a id="finding-1"></a>

### [1] Public directory responses expose internal research notes

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Independent source review and installed Payload semantics establish the trace; serializer reproduced locally. |
| Category | information-disclosure |
| CWE | CWE-200 |
| Affected lines | src/collections/Directory.ts:487-494, src/app/(app)/directory/page.tsx:71-86, src/app/api/notion-sync/route.ts:560-565 |

#### Summary

Anonymous readers can retrieve internal research notes from published directory records through REST and the directory client payload.

#### Root Cause

The Notion importer stores researchNotes. Directory read access exposes published listings, but the internal field has no field read restriction; the directory page also bypasses access before passing whole documents to a client component.

#### Validation

The Notion importer stores researchNotes. Directory read access exposes published listings, but the internal field has no field read restriction; the directory page also bypasses access before passing whole documents to a client component.

Validation method: static source trace and isolated serializer reproduction

Limitations:
- No live database mutations or exploitation performed.

#### Dataflow

Notion notes -\> directory.researchNotes -\> public REST / directory client props

#### Reachability

Unauthenticated visitor

- **Attacker:** Unauthenticated visitor

#### Severity

**Medium** — Calibrated to the established attacker boundary; live exploitation not tested.

Additional runtime or deployment evidence could raise or lower this severity.

#### Remediation

Restrict editorial-only fields to authenticated readers and respect access controls in public Local API queries.

<a id="finding-2"></a>

### [2] Sponsor content is interpolated into executable browser scripts

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Independent source review and installed Payload semantics establish the trace; serializer reproduced locally. |
| Category | cross-site-scripting |
| CWE | CWE-79 |
| Affected lines | src/components/SponsorRecordCard.tsx:13-25 |

#### Summary

A stored sponsor name can break out of a tracking script and execute arbitrary browser code on pages showing that sponsor.

#### Root Cause

The sponsor tracking builder escapes quotes only, leaving backslashes and HTML script terminators untouched. TrackingScript inserts that dynamic string as executable inline HTML and installs one global listener per card.

#### Validation

The sponsor tracking builder escapes quotes only, leaving backslashes and HTML script terminators untouched. TrackingScript inserts that dynamic string as executable inline HTML and installs one global listener per card.

Validation method: static source trace and isolated serializer reproduction

Limitations:
- No live database mutations or exploitation performed.

#### Dataflow

Stored sponsor name -\> buildGtagClickScript -\> raw executable script -\> visitor browser

#### Reachability

Malicious or compromised sponsor content author

- **Attacker:** Malicious or compromised sponsor content author

Limitations:
- Content writing requires CMS authentication or influence over authorized Notion content.

#### Severity

**Medium** — Calibrated to the established attacker boundary; live exploitation not tested.

Additional runtime or deployment evidence could raise or lower this severity.

#### Remediation

Use a client click handler that passes sponsor values as ordinary gtag arguments and binds each event to its own link.

<a id="finding-3"></a>

### [3] Anonymous requests can invalidate public page caches

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Independent source review and installed Payload semantics establish the trace; serializer reproduced locally. |
| Category | missing-authentication |
| CWE | CWE-306 |
| Affected lines | src/app/api/revalidate/route.ts:4-14 |

#### Summary

Anyone can invalidate selected pages and every category page, forcing subsequent requests to regenerate content.

#### Root Cause

The GET handler accepts a caller-selected path and calls revalidatePath twice without authenticating the request. This grants anonymous callers a cache mutation capability.

#### Validation

The GET handler accepts a caller-selected path and calls revalidatePath twice without authenticating the request. This grants anonymous callers a cache mutation capability.

Validation method: static source trace and isolated serializer reproduction

Limitations:
- No live database mutations or exploitation performed.

#### Dataflow

GET path query -\> revalidatePath -\> invalidated public caches

#### Reachability

Unauthenticated automated client

- **Attacker:** Unauthenticated automated client

#### Severity

**Medium** — Calibrated to the established attacker boundary; live exploitation not tested.

Additional runtime or deployment evidence could raise or lower this severity.

#### Remediation

Require a server-side secret, validate public route paths and use authenticated POST requests for revalidation.

<a id="finding-4"></a>

### [4] Published content can escape JSON-LD script elements

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Independent source review and installed Payload semantics establish the trace; serializer reproduced locally. |
| Category | cross-site-scripting |
| CWE | CWE-79 |
| Affected lines | src/lib/schema-utils.ts:707-709, src/app/(app)/directory/\[slug\]/page.tsx:644-648, src/app/(app)/history/\[slug\]/page.tsx:238-243, next.config.ts:5-8 |

#### Summary

Stored CMS or synchronized Notion text containing a script-closing sequence can execute code in a visitor's website origin.

#### Root Cause

serializeJsonLd replaces less-than signs with a JavaScript Unicode escape that evaluates to the same less-than sign. Other JSON-LD sinks use raw JSON.stringify. Both retain HTML script-closing sequences inside JSON strings, and the production CSP permits inline scripts.

#### Validation

serializeJsonLd replaces less-than signs with a JavaScript Unicode escape that evaluates to the same less-than sign. Other JSON-LD sinks use raw JSON.stringify. Both retain HTML script-closing sequences inside JSON strings, and the production CSP permits inline scripts.

Validation method: static source trace and isolated serializer reproduction

Limitations:
- No live database mutations or exploitation performed.

#### Dataflow

CMS / authorized Notion content -\> JSON.stringify or ineffective serializer -\> raw script HTML -\> visitor script execution

#### Reachability

Malicious or compromised content author or imported content source

- **Attacker:** Malicious or compromised content author or imported content source

Limitations:
- Content writing requires CMS authentication or influence over authorized Notion content.

#### Severity

**Medium** — Calibrated to the established attacker boundary; live exploitation not tested.

Additional runtime or deployment evidence could raise or lower this severity.

#### Remediation

Encode less-than signs as literal backslash-u003c sequences and use the safe serializer at every JSON-LD sink.

<a id="finding-5"></a>

### [5] Public pages can render unpublished CMS documents

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Independent source review and installed Payload semantics establish the trace; serializer reproduced locally. |
| Category | broken-access-control |
| CWE | CWE-862 |
| Affected lines | src/app/(app)/articles/\[slug\]/page.tsx:198-209, src/app/(app)/history/\[slug\]/page.tsx:138-149, src/app/(app)/directory/\[slug\]/page.tsx:341-351, src/app/(app)/page.tsx:124-145, src/app/(app)/directory/category/\[slug\]/page.tsx:231-242 |

#### Summary

Public slug and metadata queries bypass published-only collection rules, exposing unpublished records to visitors who know a slug.

#### Root Cause

Payload Local API find defaults overrideAccess to true. Public detail queries constrain only slug, so collection published-only read rules do not run; draft:false selects primary documents without filtering their publication status.

#### Validation

Payload Local API find defaults overrideAccess to true. Public detail queries constrain only slug, so collection published-only read rules do not run; draft:false selects primary documents without filtering their publication status.

Validation method: static source trace and isolated serializer reproduction

Limitations:
- No live database mutations or exploitation performed.

#### Dataflow

Public URL slug -\> access-bypassed Payload find -\> document and metadata rendered

#### Reachability

Unauthenticated visitor with a known or guessed slug

- **Attacker:** Unauthenticated visitor with a known or guessed slug

#### Severity

**Medium** — Calibrated to the established attacker boundary; live exploitation not tested.

Additional runtime or deployment evidence could raise or lower this severity.

#### Remediation

Set overrideAccess:false consistently on public Local API queries, retaining explicit publication and listing predicates and enforcing relationship reads.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Public CMS reads and relationships | not recorded | Reported | Fully reviewed all frontend page/layout/components and collection policies; publication filtering bypass and raw internal fields confirmed. |
| Content rendering and sponsorship | not recorded | Reported | Fully reviewed components, schema helpers, globals and public rendering; unsafe script serialization reproduced locally. |
| Public API and privileged imports | not recorded | Reported | All API routes and intake actions reviewed. Revalidation lacks authorization; production imports/intake fail closed on missing/wrong shared secrets. Event image destination/resource controls require hardening. |
| Email submission controls | not recorded | No issue found | HTML escaped, fixed recipients, replyTo validated; no open relay found. Quotas remain per-process; claim provider result not checked is functional bug. |
| Secrets, runtime and maintenance | not recorded | No issue found | Payload secret required in production; no hardcoded production secret or input-built SQL found. Maintenance commands are operator-only, seed is destructive and was not executed. Runtime and scripts resource precedence differs. |
| Notion schema/mapping | not recorded | Needs follow-up | Live schema and 35 row summaries checked read-only; missing context mapping and neighborhood aliases/options confirmed; Description present in source records and route, real webhook selection unknown. |
| Dependency/configuration review | not recorded | Needs follow-up | Lockfile npm audit reports 14 vulnerable packages; critical Next next/og advisory not reachable in app source. Minor/patch dependency updates planned. Repo source/config/scripts fully audited; binary/static prose excluded. |
| Notion field mapping | not recorded | No issue found | Reviewed production secret authorization; functional Notion mapping gaps tracked separately. |
| Notion field mapping | not recorded | No issue found | Security authentication in production requires configured sync secret. Functional mapping gaps confirmed separately: missing neighborhoodContext and exact-label neighborhood mapping. |

## Open Questions And Follow Up

- Third-party RSS control over image destinations is not established; conditional SSRF/resource hardening remains.
- Process-local rate limiting cannot guarantee deployment-wide quotas; ingress header trust unverified.
- Production Notion automation webhook field selection and real persistence require deployment and authorized end-to-end test.
