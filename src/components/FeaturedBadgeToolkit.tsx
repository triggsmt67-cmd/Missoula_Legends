'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type ToolkitView = 'overview' | 'website' | 'social'

type FeedbackState = {
  action: string
  message: string
}

type FeaturedBadgeToolkitProps = {
  businessName: string
  profileUrl: string
}

const BADGE_PATH = '/media/featured-on-missoula-legends.png'
const BADGE_DOWNLOAD_PATH = '/media/featured-on-missoula-legends-download.png'

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getSiteOrigin(profileUrl: string): string {
  try {
    return new URL(profileUrl).origin
  } catch {
    return 'https://www.missoulalegends.com'
  }
}

async function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('Clipboard request timed out.')), 900)
        }),
      ])
      return
    } catch {
      // Some embedded browsers leave clipboard permission requests unresolved.
      // Fall through to the selection-based copy path below.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('Copy was not available in this browser.')
  }
}

function ArrowIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <span aria-hidden="true" className="text-base leading-none">
      {direction === 'left' ? '←' : '→'}
    </span>
  )
}

export function FeaturedBadgeToolkit({ businessName, profileUrl }: FeaturedBadgeToolkitProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [view, setView] = useState<ToolkitView>('overview')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const siteOrigin = useMemo(() => getSiteOrigin(profileUrl), [profileUrl])
  const badgeUrl = `${siteOrigin}${BADGE_PATH}`
  const badgeAlt = `${businessName} is featured on Missoula Legends`
  const textLink = `Read our profile on Missoula Legends →\n${profileUrl}`
  const socialCaption = `We’re proud to be featured on Missoula Legends—a local record of the businesses that help define Missoula. Read our profile: ${profileUrl}`

  const embedCode = useMemo(() => {
    const safeProfileUrl = escapeHtmlAttribute(profileUrl)
    const safeBadgeUrl = escapeHtmlAttribute(badgeUrl)
    const safeBadgeAlt = escapeHtmlAttribute(badgeAlt)

    return `<a href="${safeProfileUrl}" target="_blank" rel="noopener">\n  <img\n    src="${safeBadgeUrl}"\n    alt="${safeBadgeAlt}"\n    width="640"\n    height="161"\n    loading="lazy"\n    decoding="async"\n    style="display:block;width:100%;max-width:320px;height:auto;"\n  >\n</a>`
  }, [badgeAlt, badgeUrl, profileUrl])

  const developerHandoff = useMemo(
    () =>
      `Please add our “Featured on Missoula Legends” badge to an appropriate place on our website, such as the About, Press, Community, or footer area. The badge should link directly to our business profile.\n\nBusiness: ${businessName}\nProfile: ${profileUrl}\nBadge image: ${badgeUrl}\n\nEmbed code:\n${embedCode}`,
    [badgeUrl, businessName, embedCode, profileUrl],
  )

  const emailHref = useMemo(() => {
    const subject = `Please add our Missoula Legends badge — ${businessName}`
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(developerHandoff)}`
  }, [businessName, developerHandoff])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
      document.body.style.overflow = ''
    }
  }, [])

  function showFeedback(action: string, message: string) {
    setFeedback({ action, message })
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 2800)
  }

  async function handleCopy(action: string, value: string, successMessage: string) {
    try {
      await copyToClipboard(value)
      showFeedback(action, successMessage)
    } catch {
      showFeedback(action, 'Copy failed. Open the developer details and select the text manually.')
    }
  }

  function openDialog() {
    setView('overview')
    setFeedback(null)
    dialogRef.current?.showModal()
    document.body.style.overflow = 'hidden'
  }

  function closeDialog() {
    dialogRef.current?.close()
  }

  function handleDialogClose() {
    document.body.style.overflow = ''
    setView('overview')
    setFeedback(null)
    triggerRef.current?.focus()
  }

  async function handleNativeShare() {
    if (!navigator.share) {
      await handleCopy('social-caption', socialCaption, 'Caption and profile link copied ✓')
      return
    }

    try {
      await navigator.share({
        title: `${businessName} on Missoula Legends`,
        text: `We’re proud to be featured on Missoula Legends—a local record of the businesses that help define Missoula.`,
        url: profileUrl,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      showFeedback('native-share', 'Sharing was unavailable. Copy the caption instead.')
    }
  }

  const copyButtonLabel = (action: string, defaultLabel: string) =>
    feedback?.action === action && feedback.message.includes('✓') ? 'Copied ✓' : defaultLabel

  return (
    <>
      <section className="mt-16 lg:col-span-8 lg:col-start-1" aria-labelledby="business-owner-tools-heading">
        <div className="relative overflow-hidden border border-warm-limestone/70 bg-gradient-to-br from-[#fbf9f4] to-[#f1ebdf] p-7 shadow-sm dark:border-warm-limestone/15 dark:from-slate-900/55 dark:to-slate-950/55 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/media/missoula-historical-map-panoramic.webp')] bg-cover bg-center opacity-[0.035] mix-blend-multiply dark:opacity-[0.025] dark:mix-blend-screen"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="mb-3 block font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-aged-brass">
              For Business Owners
            </span>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl text-left">
                <h2
                  id="business-owner-tools-heading"
                  className="font-serif text-2xl font-semibold leading-tight tracking-tight text-deep-spruce dark:text-ivory-paper sm:text-[1.75rem]"
                >
                  Manage or share this profile
                </h2>
                <p className="mt-3 max-w-[62ch] font-serif text-[15px] leading-relaxed text-smoked-olive dark:text-ivory-paper/78 sm:text-base">
                  Are you the owner or manager of {businessName}? Keep this profile current or share your Missoula Legends feature on your website and social channels.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
                <Link
                  href={`/business-update?business=${encodeURIComponent(businessName)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-deep-spruce bg-deep-spruce px-5 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ivory-paper shadow-sm transition-colors hover:bg-oxblood-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-aged-brass/35 dark:bg-[#203633] dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black"
                >
                  Claim or Update <ArrowIcon />
                </Link>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={openDialog}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-aged-brass/70 bg-transparent px-5 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-deep-spruce transition-colors hover:bg-aged-brass hover:text-soft-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper"
                >
                  Get Featured Badge <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="badge-toolkit-title"
        onClose={handleDialogClose}
        onCancel={(event) => {
          event.preventDefault()
          closeDialog()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            closeDialog()
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog()
        }}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden border border-warm-limestone/70 bg-ivory-paper p-0 text-soft-black shadow-[0_30px_90px_rgba(10,18,14,0.35)] backdrop:bg-soft-black/75 backdrop:backdrop-blur-sm dark:border-warm-limestone/20 dark:bg-[#121a16] dark:text-ivory-paper sm:w-[calc(100%-3rem)]"
      >
        <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-3rem)]">
          <header className="sticky top-0 z-20 flex items-start justify-between gap-5 border-b border-warm-limestone/50 bg-ivory-paper/95 px-5 py-5 backdrop-blur-md dark:border-warm-limestone/15 dark:bg-[#121a16]/95 sm:px-8 sm:py-6">
            <div>
              <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-aged-brass">
                Business Owner Toolkit
              </span>
              <h2 id="badge-toolkit-title" className="font-serif text-2xl font-semibold tracking-tight text-deep-spruce dark:text-ivory-paper sm:text-3xl">
                Share Your Missoula Legends Feature
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close badge toolkit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-warm-limestone/70 text-xl text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {view !== 'overview' && (
              <button
                type="button"
                onClick={() => {
                  setView('overview')
                  setFeedback(null)
                }}
                className="mb-6 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-warm-stone transition-colors hover:text-deep-spruce focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:hover:text-ivory-paper"
              >
                <ArrowIcon direction="left" /> Back to sharing options
              </button>
            )}

            {view === 'overview' && (
              <div>
                <div className="border border-warm-limestone/60 bg-white p-5 shadow-inner dark:border-warm-limestone/15 dark:bg-[#0d1411] sm:p-8">
                  <Image
                    src={BADGE_PATH}
                    alt={badgeAlt}
                    width={640}
                    height={161}
                    className="mx-auto h-auto w-full max-w-[560px]"
                    priority={false}
                  />
                </div>
                <div className="mx-auto mt-6 max-w-2xl text-center">
                  <p className="font-serif text-lg font-semibold text-deep-spruce dark:text-ivory-paper">{businessName}</p>
                  <p className="mx-auto mt-2 max-w-xl font-serif text-[15px] leading-relaxed text-smoked-olive dark:text-ivory-paper/75">
                    The badge and every sharing option below link visitors directly to this business profile.
                  </p>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setView('website')}
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-deep-spruce px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ivory-paper transition-colors hover:bg-oxblood-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:bg-[#203633] dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black"
                  >
                    Add to My Website <ArrowIcon />
                  </button>
                  <a
                    href={BADGE_DOWNLOAD_PATH}
                    download="featured-on-missoula-legends.png"
                    className="inline-flex min-h-12 items-center justify-center gap-2 border border-aged-brass/70 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-deep-spruce transition-colors hover:bg-aged-brass hover:text-soft-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper"
                  >
                    Download Badge <span aria-hidden="true">↓</span>
                  </a>
                </div>

                <div className="mt-5 grid gap-3 border-t border-warm-limestone/45 pt-5 sm:grid-cols-3 dark:border-warm-limestone/15">
                  <button
                    type="button"
                    onClick={() => handleCopy('profile-link', profileUrl, 'Profile link copied ✓')}
                    className="min-h-11 border border-warm-limestone/70 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    {copyButtonLabel('profile-link', 'Copy Profile Link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy('text-link', textLink, 'Text link copied ✓')}
                    className="min-h-11 border border-warm-limestone/70 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    {copyButtonLabel('text-link', 'Copy Text Link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('social')}
                    className="min-h-11 border border-warm-limestone/70 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    Share on Social
                  </button>
                </div>
              </div>
            )}

            {view === 'website' && (
              <div>
                <span className="mb-3 block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-aged-brass">Website Installation</span>
                <h3 className="font-serif text-2xl font-semibold text-deep-spruce dark:text-ivory-paper">Who manages your website?</h3>
                <p className="mt-2 max-w-2xl font-serif text-[15px] leading-relaxed text-smoked-olive dark:text-ivory-paper/75">
                  Choose the easiest route. The profile link and badge address are already personalized for {businessName}.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleCopy('embed-code', embedCode, 'Website embed copied ✓')}
                    className="group min-h-36 border border-warm-limestone/70 bg-white p-5 text-left transition-colors hover:border-aged-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:bg-white/[0.03]"
                  >
                    <span className="font-serif text-lg font-semibold text-deep-spruce dark:text-ivory-paper">I manage it</span>
                    <span className="mt-2 block text-sm leading-relaxed text-smoked-olive dark:text-ivory-paper/70">
                      {copyButtonLabel('embed-code', 'Copy the ready-to-paste website embed.')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy('handoff', developerHandoff, 'Web-person instructions copied ✓')}
                    className="group min-h-36 border border-warm-limestone/70 bg-white p-5 text-left transition-colors hover:border-aged-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:bg-white/[0.03]"
                  >
                    <span className="font-serif text-lg font-semibold text-deep-spruce dark:text-ivory-paper">Someone else does</span>
                    <span className="mt-2 block text-sm leading-relaxed text-smoked-olive dark:text-ivory-paper/70">
                      {copyButtonLabel('handoff', 'Copy a complete handoff for your web person.')}
                    </span>
                  </button>
                  <a
                    href={BADGE_DOWNLOAD_PATH}
                    download="featured-on-missoula-legends.png"
                    className="group min-h-36 border border-warm-limestone/70 bg-white p-5 text-left transition-colors hover:border-aged-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:bg-white/[0.03]"
                  >
                    <span className="font-serif text-lg font-semibold text-deep-spruce dark:text-ivory-paper">I need the image</span>
                    <span className="mt-2 block text-sm leading-relaxed text-smoked-olive dark:text-ivory-paper/70">Download the large transparent PNG.</span>
                  </a>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={emailHref}
                    className="inline-flex min-h-11 items-center justify-center border border-aged-brass/70 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-deep-spruce transition-colors hover:bg-aged-brass hover:text-soft-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper"
                  >
                    Email Instructions
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('website-text-link', textLink, 'Text link copied ✓')}
                    className="inline-flex min-h-11 items-center justify-center border border-warm-limestone/70 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    {copyButtonLabel('website-text-link', 'Copy Text-Link Alternative')}
                  </button>
                </div>

                <details className="group mt-7 border border-warm-limestone/60 bg-white dark:border-warm-limestone/15 dark:bg-white/[0.025]">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-deep-spruce focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper">
                    Developer installation details
                    <span aria-hidden="true" className="text-aged-brass transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-warm-limestone/50 p-4 dark:border-warm-limestone/15 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="text-xs leading-relaxed text-warm-stone">Paste into a Custom HTML, Embed, or Code block.</p>
                      <button
                        type="button"
                        onClick={() => handleCopy('details-code', embedCode, 'Website embed copied ✓')}
                        className="min-h-11 shrink-0 border border-aged-brass/70 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-deep-spruce transition-colors hover:bg-aged-brass hover:text-soft-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper"
                      >
                        {copyButtonLabel('details-code', 'Copy Code')}
                      </button>
                    </div>
                    <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words bg-deep-spruce p-4 text-left font-mono text-[11px] leading-relaxed text-ivory-paper" tabIndex={0}>
                      <code>{embedCode}</code>
                    </pre>
                  </div>
                </details>
              </div>
            )}

            {view === 'social' && (
              <div>
                <span className="mb-3 block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-aged-brass">Social Sharing</span>
                <h3 className="font-serif text-2xl font-semibold text-deep-spruce dark:text-ivory-paper">Ready to post</h3>
                <p className="mt-2 max-w-2xl font-serif text-[15px] leading-relaxed text-smoked-olive dark:text-ivory-paper/75">
                  Download the badge, copy the caption, and share the direct profile link wherever your business is active.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="flex items-center border border-warm-limestone/60 bg-white p-5 dark:border-warm-limestone/15 dark:bg-[#0d1411]">
                    <Image src={BADGE_PATH} alt={badgeAlt} width={640} height={161} className="h-auto w-full" />
                  </div>
                  <div className="border border-warm-limestone/60 bg-white p-5 dark:border-warm-limestone/15 dark:bg-white/[0.025]">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-warm-stone">Suggested Caption</span>
                    <p className="mt-3 font-serif text-[15px] leading-relaxed text-soft-black dark:text-ivory-paper/85">{socialCaption}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-deep-spruce px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ivory-paper transition-colors hover:bg-oxblood-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:bg-[#203633] dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black"
                  >
                    Share Profile <ArrowIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy('social-caption', socialCaption, 'Caption and profile link copied ✓')}
                    className="inline-flex min-h-12 items-center justify-center border border-aged-brass/70 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-deep-spruce transition-colors hover:bg-aged-brass hover:text-soft-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:text-ivory-paper"
                  >
                    {copyButtonLabel('social-caption', 'Copy Caption')}
                  </button>
                  <a
                    href={BADGE_DOWNLOAD_PATH}
                    download="featured-on-missoula-legends.png"
                    className="inline-flex min-h-11 items-center justify-center border border-warm-limestone/70 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    Download Badge
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('social-link', profileUrl, 'Profile link copied ✓')}
                    className="inline-flex min-h-11 items-center justify-center border border-warm-limestone/70 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-deep-spruce transition-colors hover:border-aged-brass hover:bg-aged-brass/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aged-brass dark:border-warm-limestone/20 dark:text-ivory-paper"
                  >
                    {copyButtonLabel('social-link', 'Copy Profile Link')}
                  </button>
                </div>
              </div>
            )}

            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {feedback?.message || ''}
            </p>
            {feedback && (
              <div
                className={`mt-5 border px-4 py-3 text-sm ${
                  feedback.message.includes('✓')
                    ? 'border-aged-brass/60 bg-aged-brass/10 text-deep-spruce dark:text-ivory-paper'
                    : 'border-oxblood-brown/50 bg-oxblood-brown/10 text-oxblood-brown dark:text-[#f1c9be]'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}
