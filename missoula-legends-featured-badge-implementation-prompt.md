# Missoula Legends Featured Badge and Sharing Toolkit

Implement a polished, reusable “Featured on Missoula Legends” sharing toolkit on every published business directory profile. The experience must feel native to the existing editorial design and must not display raw HTML directly on the profile page.

## Before changing code

1. Read the repository `AGENTS.md`.
2. This project uses a version of Next.js with breaking changes. Read the relevant guides in `node_modules/next/dist/docs/` before using routing, server/client components, metadata, image handling, route handlers, or social-image APIs.
3. Inspect the current business profile implementation at `src/app/(app)/directory/[slug]/page.tsx`, the global design tokens in `src/app/globals.css`, and existing reusable modal/button patterns before designing new components.
4. Preserve the existing Payload CMS data model unless a database change is genuinely necessary. Do not add a badge field to every business record: the badge artwork is shared by every profile.
5. Keep unrelated files and existing user changes untouched.

## Existing badge assets

Use the production-ready assets already stored in `public/media/`:

- `featured-on-missoula-legends-320.png` — 320×81, transparent, lightweight preview/fallback.
- `featured-on-missoula-legends.png` — 640×161, transparent, primary high-density website embed asset. Display it at approximately 320 CSS pixels wide.
- `featured-on-missoula-legends-download.png` — 1200×302, transparent, owner download asset.

Do not stretch, distort, add a colored rectangle behind, or crop these files. When displayed, preserve the intrinsic aspect ratio and use responsive sizing so the badge never overflows a narrow container.

Public production URLs should resolve to:

- `https://www.missoulalegends.com/media/featured-on-missoula-legends.png`
- `https://www.missoulalegends.com/media/featured-on-missoula-legends-download.png`

Use the project’s canonical base-URL configuration if one already exists; do not scatter duplicate hard-coded environment logic throughout the codebase.

## Placement on the business profile

Find the existing “Claim or Update this Business Profile” block near the bottom of each directory profile. Evolve it into one unified owner panel rather than adding another unrelated card.

Suggested content hierarchy:

- Eyebrow: `FOR BUSINESS OWNERS`
- Heading: `Manage or share this profile`
- Supporting copy personalized with the current business name.
- Primary action: `Claim or Update Profile`
- Secondary action: `Get Featured Badge`

The claim/update action must retain its current destination and behavior. On desktop, the two actions may sit side by side. On mobile, stack them as full-width, comfortable touch targets. Keep this block in the main eight-column editorial content area rather than the customer-facing contact sidebar.

Match the site’s existing visual language: ivory paper, deep spruce, aged brass, serif editorial headings, small tracked mono labels, restrained borders, and subtle shadows. Do not introduce a generic SaaS dashboard aesthetic.

## Badge toolkit interaction

Clicking `Get Featured Badge` should open an accessible modal on desktop and a comfortable full-width sheet/dialog presentation on small screens. Do not navigate away from the profile.

The initial modal view should show:

- Heading: `Share Your Missoula Legends Feature`
- A large, clean preview of the badge on a neutral preview surface.
- The current business name.
- A short explanation that the badge links directly to this business’s Missoula Legends profile.
- Primary action: `Add to My Website`
- Secondary action: `Download Badge`
- Additional actions: `Copy Profile Link`, `Copy Text Link`, and `Share on Social`.

Do not show raw embed code in this initial view.

## Automatic business-specific values

The component should receive the current profile’s real `businessName` and `slug` from the existing server-rendered profile page. Generate these values automatically:

- Canonical profile URL: `https://www.missoulalegends.com/directory/{slug}`
- Badge URL: `https://www.missoulalegends.com/media/featured-on-missoula-legends.png`
- Download URL: `/media/featured-on-missoula-legends-download.png`
- Image alternative text: `{Business Name} is featured on Missoula Legends`
- Text-link label: `Read our profile on Missoula Legends →`

Every profile must use the same component and badge artwork. Only the business name, profile URL, alternative text, caption, and related share data change. A newly published directory entry should receive the toolkit automatically without manual CMS setup.

## Website installation experience

When the owner selects `Add to My Website`, present plain-language choices before any code:

1. `I manage the website` — provides a one-click copy action for the personalized embed.
2. `Someone else manages it` — provides a copyable handoff package suitable for sending to a web developer.
3. `I only need the image` — downloads the high-resolution transparent badge.

Keep the actual HTML inside a collapsed disclosure labeled `Developer installation details`. When expanded, show a readable code panel with a single `Copy Code` button. Never dump the code into the public page layout.

The generated embed must:

- Link directly to the current business profile, not the Missoula Legends homepage.
- Open safely in a new tab.
- Use `rel="noopener"`; do not add `noreferrer` because Missoula Legends should retain ordinary referral analytics. Do not add `nofollow` or `sponsored` unless site policy changes later.
- Load the shared 640-pixel transparent badge.
- Include personalized alternative text.
- Specify the badge’s intrinsic width and height to reduce layout shift.
- Display responsively at no more than about 320 CSS pixels wide while preserving aspect ratio.
- Avoid JavaScript, tracking scripts, iframes, hidden links, keyword-heavy anchor text, or dependencies on Missoula Legends stylesheets.

Generate the embed string from structured values. Escape any business-controlled text before inserting it into HTML to prevent malformed markup or injection.

## Copy and download behavior

Provide clear feedback for every action:

- Default: `Copy Code`, `Copy Link`, or `Copy Text Link`.
- Success: change briefly to `Copied ✓` and announce success to assistive technology.
- Failure: show a helpful inline message and preserve a manual-selection fallback.
- Download: use a meaningful filename such as `featured-on-missoula-legends.png`.

Clipboard and sharing actions require client-side interaction. Keep the business profile itself server-rendered and isolate client code to the smallest interactive component possible.

## Social sharing

The social experience should not expose HTML embed code. Provide:

- A suggested caption personalized with the current business name.
- `Copy Caption`.
- `Copy Profile Link`.
- `Download Badge`.
- `Share` using the native Web Share API when supported, with a graceful copy/download fallback when it is not.

Suggested caption structure:

`We’re proud to be featured on Missoula Legends—a local record of the businesses that help define Missoula. Read our profile: {profileUrl}`

If implementing a personalized social card in this pass is straightforward and supported by this installed Next.js version, generate a 1200×630 share image using the business name, the badge, and optionally the existing business featured image. Read the installed Next.js documentation before choosing the implementation. Keep text within safe margins and verify long business names. If that would materially expand scope or introduce a fragile image-generation system, leave a clearly documented follow-up and ship the reliable badge/caption/link workflow first.

## Accessibility and responsive behavior

- Use a semantic accessible dialog with an explicit title and close control.
- Move focus into the dialog when it opens, trap focus appropriately, close on Escape, and return focus to the triggering button.
- Ensure all controls work with keyboard, touch, and pointer input.
- Maintain visible focus styles and adequate color contrast.
- Give controls at least a 44-pixel touch target on mobile.
- Prevent background scrolling while the dialog is open.
- Do not rely on color alone for selected or success states.
- Respect reduced-motion preferences; use only subtle opacity/transform transitions.
- Test narrow mobile widths and long business names.

## Architecture expectations

- Build one reusable owner-sharing component; do not duplicate markup in every profile.
- Keep URL and embed generation in small, testable helpers.
- Reuse existing project utilities and visual patterns where appropriate.
- Do not store one copy of the shared badge in each Payload record.
- Do not add third-party packages unless the existing stack cannot reasonably support the interaction.
- Do not change existing profile canonical URLs, SEO metadata, schema data, claim/update behavior, or directory rendering.

## Verification

After implementation:

1. Run the project’s existing lint, type-check, test, and production-build commands as applicable.
2. Render at least two real directory profiles with different names and slugs.
3. Verify that each generated profile link and embed points to the correct canonical profile URL.
4. Paste the copied embed into a simple isolated HTML fixture and confirm that the badge displays at the correct size and links correctly.
5. Verify the three PNG assets have real alpha transparency and are served with successful responses.
6. Inspect desktop and mobile layouts visually.
7. Test keyboard navigation, focus return, Escape-to-close, success announcements, clipboard failure fallback, downloads, and native-share fallback.
8. Confirm no raw code appears until `Developer installation details` is intentionally expanded.
9. Confirm that adding a new directory profile requires no new badge configuration.

## Definition of done

The feature is complete when every published business profile has a polished, unified owner panel; owners can open a personalized badge toolkit; the correct direct profile URL is generated automatically; website code remains hidden until requested; the badge downloads at useful resolution with transparency; social caption/link sharing works; and the experience is responsive, accessible, visually consistent, and verified without duplicating badge data in Payload CMS.
