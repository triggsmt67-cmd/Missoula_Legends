# Send to History Draft

This workflow saves a reviewed story in the existing Payload **History** collection, using the site's existing Payload configuration. It does not provision or reconfigure PostgreSQL, require a schema migration, publish a story, overwrite an existing entry, or change the separate Business Directory Profiles webhook. It is disabled until separately configured.

## Set up the editor workflow

1. After review and approval to deploy, add a dedicated random secret of at least 32 characters under `HISTORY_DRAFT_WEBHOOK_SECRET` in the deployment environment. Keep it out of URLs, Notion text fields, documents, logs, and chat. Do not reuse the directory secret.
2. Use a private editorial database or input flow, separate from Business Directory Profiles. For Notion, use a **database automation** with a deliberate **Send to History Draft** status as the trigger. Do not reuse a Published trigger. In the automation choose **Send webhook**, enter the website URL ending in `/api/history-draft`, and set custom header `x-history-draft-token` to the dedicated secret. The server still forces draft status regardless of the incoming status. Limit database editing access to the intended editors.
3. Include these Notion properties only:

   | Property | Type | Required |
   | --- | --- | --- |
   | Title | Title | Yes |
   | Slug | Text, unique and stable | Yes |
   | Excerpt | Text | Yes |
   | Story Markdown | Text | Yes |
   | Hero Media ID | Number | Yes |
   | Era / Year | Text | No |
   | Location / Landmark | Text | No |

   Use the **Story Markdown property**, not the Notion page body; Notion webhooks send database properties only. A validated current version of the story goes in that property. Do not type another title heading into the body if the page already displays the title. Citations and photo credits belong in the Markdown body. An existing editable Word file is an editorial source, not a webhook payload.
4. Choose the hero photo in Payload **Media** and use that record's numeric ID. Confirm reproduction rights, alt text and the credit first. The workflow does not fetch photo URLs or upload images. The site's existing Media library is publicly readable, so use only an asset cleared for public use. Do not upload merely to run a private test against production.
5. After triggering, open Payload **History**, search by title or slug, and confirm **Draft**, image, excerpt, formatted body and link targets. Confirm the story is missing from the signed-out History index and its direct public URL is not live. Publish only through a separate, deliberate approval and the existing History editor.

## Repeat behavior

- A new valid request returns 201 with its draft ID, slug, and status.
- Replaying the same slug/title returns the existing draft without changing its text. Make later edits in that draft.
- A published match is never overwritten or converted back to a draft.
- Invalid or incomplete requests write nothing. Notion may pause the rule after a non-success response; check its run before re-enabling it. Never repeatedly toggle status or resend blindly.

## Golden Pheasant pilot

- Slug: `golden-pheasant-missoula`.
- Era and location: 1940s–1990s; 316–318 North Higgins Avenue, Missoula.
- Hero: [John Margolies, Golden Pheasant sign, 1987](https://tile.loc.gov/storage-services/service/pnp/mrg/01500/01511r.jpg). Credit: John Margolies Roadside America photograph archive, Library of Congress, Prints and Photographs Division. [Collection rights guidance](https://guides.loc.gov/roadside-america-photographs/rights-reproductions).
- Keep the precise closing date open. Verify the five source links in the History draft.
- No new database or hosted preview is required for setup. Do not run a preview against the production database. Keep the sender off until a deliberate deployment on the existing Missoula Legends project and a one-story draft transfer have both been authorized. Run the no-database checks before any deployment. A webhook stores the draft, not a Word attachment, and does not fill a Story Markdown property from Word automatically.

## Local checks

`node --test tests/history-draft-webhook.test.mjs` runs the webhook contract with an in-memory store. Set `HISTORY_STORY_FIXTURE` to the local Golden Pheasant JSON file to also run the story payload. The JSON deliberately omits a real Media ID. Run TypeScript and lint checks on the changed files before deployment. These checks do not connect to PostgreSQL.

## Verified local pilot

A loopback-only Next.js server and temporary PostgreSQL cluster were used for the Golden Pheasant test. A request without the token returned 401. A real HTTP request using Notion-shaped properties and the locally seeded historical image created exactly one Payload History draft. Sending it twice returned the same draft ID. Authenticated readback confirmed the rich-text story, source links, excerpt and image reference; the signed-out History API returned zero matching records. TypeScript, lint, and eight focused route-contract tests also passed. The real Notion automation, Vercel preview, and production were not connected in this test.

## Notion queue pilot

The private **Missoula Legends History Stories** queue is ready in Notion, with Golden Pheasant at Draft. Do not use a local or preview media ID in production. The Draft and Published URL fields are intentionally blank. The production sender is still unconnected. Do not create or attach another database for the rollout.

The Notion connector's plain-text query omitted rich-text source destinations; the saved property itself retained them. The importer now reconstructs links and italic/bold annotations from Notion rich-text fragments. The exact saved story was read back from Notion and sent with a representative Notion envelope to the local endpoint; all five source links, the credited photo, and the text persisted in one draft, with zero signed-out matches. This does not test the real Notion automation's outbound delivery. Nine focused handler tests and TypeScript/lint passed after the change.
