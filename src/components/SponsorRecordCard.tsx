import Image from 'next/image'
import type { NormalizedSponsorPlacement } from '@/lib/sponsorship'

type Props = {
  placement?: NormalizedSponsorPlacement | null
  variant?: 'hero' | 'banner' | 'compact'
  categoryName?: string
  className?: string
}

const trustDisclosure = 'Paid placement never affects directory rankings or editorial coverage.'

function normalizeSafeUrl(value?: string | null): string {
  if (!value) return '/directory'
  if (value.startsWith('/')) return value
  if (value.startsWith('mailto:')) return value
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString()
    }
    return '/directory'
  } catch {
    return '/directory'
  }
}

export function SponsorRecordCard({
  placement,
  variant = 'hero',
  categoryName,
  className = '',
}: Props) {
  // If placement is disabled or missing in production, do not render
  if (!placement || placement.status === 'disabled') {
    return null
  }

  const isSponsored = placement.status === 'sponsored' && Boolean(placement.sponsor?.name)
  const sponsor = placement.sponsor

  const businessName = isSponsored ? sponsor!.name : 'Support Missoula Legends'
  const monogram = isSponsored ? sponsor!.monogram : 'ML'
  const logoUrl = isSponsored ? sponsor!.logoUrl : null
  const logoAlt = isSponsored ? sponsor!.logoAlt || `${businessName} logo` : 'Missoula Legends logo'

  const locationLabel = isSponsored ? sponsor!.locationLabel : 'Missoula, Montana'
  const categoryLabel = isSponsored ? sponsor!.categoryLabel : categoryName || 'Community Registry'
  const ownershipLabel = isSponsored ? sponsor!.ownershipLabel : 'Independent Local Project'

  const description = isSponsored
    ? sponsor!.description
    : variant === 'banner'
    ? `Underwrite the ${categoryName || 'Directory'} section to keep local business listings free and independent.`
    : variant === 'compact'
    ? 'Community underwriters help keep the Local Spotlight program free for Missoula business owners.'
    : 'One community partnership helps keep local listings free and supports the stories that document our city.'

  const defaultMailto = `mailto:trevor@missoulalegends.com?subject=Missoula%20Legends%20${encodeURIComponent(
    variant === 'banner' ? `${categoryName || 'Category'} Partnership Inquiry` : 'Community Partnership Inquiry'
  )}`

  const ctaUrl = isSponsored ? normalizeSafeUrl(sponsor!.destinationUrl) : defaultMailto
  const isExternalUrl = ctaUrl.startsWith('http')

  const ctaLabel = isSponsored
    ? sponsor!.ctaLabel
    : variant === 'banner'
    ? 'Inquire About Category Sponsorship'
    : variant === 'compact'
    ? 'Become a Program Partner'
    : 'Ask About Partnership'

  const supportMessage = isSponsored
    ? sponsor!.supportMessage
    : 'All community partnerships directly fund independent local business documentation.'

  const recordCode = placement.recordCode || 'SP · 0001 · MISSOULA'

  const details = [locationLabel, categoryLabel, ownershipLabel].filter(Boolean)

  const headerLabel =
    variant === 'banner'
      ? `Missoula Legends ${categoryName ? `${categoryName} ` : ''}Category Partner`
      : variant === 'compact'
      ? 'Missoula Legends Program Partner'
      : 'Missoula Legends Community Partner'

  // =========================================================================
  // 1. BANNER VARIANT (Directory Category Pages)
  // =========================================================================
  if (variant === 'banner') {
    return (
      <aside
        aria-label={isSponsored ? `Category partner: ${businessName}` : 'Category underwriting opportunity'}
        className={`w-full rounded-[0.45rem] border border-aged-brass/80 bg-deep-spruce p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(23,35,29,0.18)] ${className}`}
      >
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 pb-2.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8D8B8]">
          <span>{headerLabel}</span>
          <span className="shrink-0 border border-[#E8D8B8]/65 px-2 py-1 text-[7px] tracking-[0.18em] text-ivory-paper">
            {isSponsored ? 'Sponsored' : 'Available'}
          </span>
        </div>

        <div
          className="relative overflow-hidden border border-[#D2C4AE] bg-[#F8F4EB] p-4 sm:p-6 text-deep-spruce"
          style={{
            backgroundImage:
              'linear-gradient(rgba(168,132,79,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,132,79,0.07) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <span aria-hidden="true" className="absolute left-2 top-2 h-4 w-4 border-l border-t border-aged-brass" />
          <span aria-hidden="true" className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-aged-brass" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
              {/* Monogram / Logo Avatar */}
              <div className="relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-aged-brass font-serif text-lg text-oxblood-brown outline outline-1 outline-offset-[-4px] outline-dashed outline-aged-brass/75">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={logoAlt}
                    fill
                    sizes="56px"
                    quality={65}
                    className="object-contain p-2"
                  />
                ) : (
                  monogram
                )}
              </div>

              {/* Sponsor Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.19em] text-oxblood-brown">
                    {isSponsored ? 'Category Partner Record' : 'Category Underwriting'}
                  </p>
                  <span className="text-warm-stone/50 font-mono text-[8px]">·</span>
                  <p className="font-mono text-[8px] tracking-[0.13em] text-warm-stone">{recordCode}</p>
                </div>

                <h2 className="mt-1 font-serif text-xl sm:text-2xl font-normal leading-tight text-deep-spruce truncate">
                  {businessName}
                </h2>

                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-oxblood-brown">
                  {details.map((detail) => (
                    <span key={detail}>{detail}</span>
                  ))}
                </div>

                <p className="mt-2 font-serif text-sm italic leading-snug text-smoked-olive max-w-2xl">
                  {description}
                </p>
              </div>
            </div>

            {/* CTA & Trust Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 border-[#D2C4AE]/60 pt-3 lg:pt-0">
              <a
                href={ctaUrl}
                rel={isSponsored && isExternalUrl ? 'sponsored nofollow noopener' : undefined}
                className="inline-flex min-h-10 items-center justify-between gap-3 border border-aged-brass/80 bg-deep-spruce hover:bg-oxblood-brown px-5 py-2.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] text-ivory-paper transition-all hover:shadow-sm"
              >
                <span>{ctaLabel}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>

              <div className="text-left lg:text-right">
                <p className="text-[10px] leading-tight text-smoked-olive">{supportMessage}</p>
                {isSponsored && (
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.08em] text-[#7C6545]">
                    {trustDisclosure}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  // =========================================================================
  // 2. COMPACT VARIANT (Local Spotlight & Article Sidebars)
  // =========================================================================
  if (variant === 'compact') {
    return (
      <aside
        aria-label={isSponsored ? `Program partner: ${businessName}` : 'Program underwriting opportunity'}
        className={`w-full max-w-[460px] rounded-[0.45rem] border border-aged-brass/80 bg-deep-spruce p-2.5 shadow-[0_20px_50px_rgba(23,35,29,0.2)] ${className}`}
      >
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 pb-3 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8D8B8]">
          <span>{headerLabel}</span>
          <span className="shrink-0 border border-[#E8D8B8]/65 px-2 py-1 text-[7px] tracking-[0.18em] text-ivory-paper">
            {isSponsored ? 'Sponsored' : 'Available'}
          </span>
        </div>

        <div
          className="relative overflow-hidden border border-[#D2C4AE] bg-[#F8F4EB] p-5 text-deep-spruce"
          style={{
            backgroundImage:
              'linear-gradient(rgba(168,132,79,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,132,79,0.07) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <span aria-hidden="true" className="absolute left-2 top-2 h-4 w-4 border-l border-t border-aged-brass" />
          <span aria-hidden="true" className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-aged-brass" />

          <div className="flex items-start justify-between gap-4 border-b border-[#CFC1AA] pb-4">
            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.19em] text-oxblood-brown">
                {isSponsored ? 'Spotlight Underwriter' : 'Program Underwriting'}
              </p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.13em] text-warm-stone">{recordCode}</p>
            </div>
            <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-aged-brass font-serif text-lg text-oxblood-brown outline outline-1 outline-offset-[-4px] outline-dashed outline-aged-brass/75">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  fill
                  sizes="48px"
                  quality={65}
                  className="object-contain p-2"
                />
              ) : (
                monogram
              )}
            </div>
          </div>

          <div className="py-4">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-warm-stone">
              {isSponsored ? 'Presented by' : 'Program Underwriting'}
            </p>
            <h3 className="mt-1 font-serif text-xl font-normal leading-tight text-deep-spruce">
              {businessName}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-oxblood-brown">
              {details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>
            <p className="mt-3 font-serif text-sm italic leading-relaxed text-smoked-olive">{description}</p>
          </div>

          <a
            href={ctaUrl}
            rel={isSponsored && isExternalUrl ? 'sponsored nofollow noopener' : undefined}
            className="flex min-h-10 items-center justify-between gap-3 border-y border-[#CFC1AA] py-2.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] text-oxblood-brown transition-colors hover:text-deep-spruce"
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>

          <p className="mt-3 text-[10px] leading-relaxed text-smoked-olive">{supportMessage}</p>
          {isSponsored && (
            <p className="mt-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.08em] text-[#7C6545]">
              {trustDisclosure}
            </p>
          )}
        </div>
      </aside>
    )
  }

  // =========================================================================
  // 3. HERO VARIANT (Homepage Hero Section)
  // =========================================================================
  return (
    <aside
      aria-label={isSponsored ? `Sponsored community partner: ${businessName}` : 'Community partner opportunity'}
      className={`w-full max-w-[500px] xl:justify-self-end rounded-[0.45rem] border border-aged-brass/80 bg-deep-spruce p-2.5 sm:p-3 shadow-[0_30px_75px_rgba(23,35,29,0.25)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 px-2 py-2 pb-4 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8D8B8]">
        <span>{headerLabel}</span>
        <span className="shrink-0 border border-[#E8D8B8]/65 px-2.5 py-1.5 text-[7px] tracking-[0.18em] text-ivory-paper">
          {isSponsored ? 'Sponsored' : 'Available'}
        </span>
      </div>

      <div
        className="relative overflow-hidden border border-[#D2C4AE] bg-[#F8F4EB] p-5 sm:p-7 text-deep-spruce"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,132,79,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,132,79,0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <span aria-hidden="true" className="absolute left-2.5 top-2.5 h-6 w-6 border-l border-t border-aged-brass" />
        <span aria-hidden="true" className="absolute bottom-2.5 right-2.5 h-6 w-6 border-b border-r border-aged-brass" />

        <div className="flex items-start justify-between gap-5 border-b border-[#CFC1AA] pb-5">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.19em] text-oxblood-brown">
              {isSponsored ? 'Community Partner Record' : 'Partnership Record'}
            </p>
            <p className="mt-2 font-mono text-[9px] tracking-[0.13em] text-warm-stone">{recordCode}</p>
          </div>
          <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-aged-brass font-serif text-xl text-oxblood-brown outline outline-1 outline-offset-[-6px] outline-dashed outline-aged-brass/75 sm:h-[68px] sm:w-[68px] sm:text-2xl">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                fill
                sizes="68px"
                quality={65}
                className="object-contain p-2.5"
              />
            ) : (
              monogram
            )}
          </div>
        </div>

        <div className="py-5 sm:py-6">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-warm-stone">
            {isSponsored ? 'Presented by' : 'An exclusive opportunity'}
          </p>
          <h2 className="mt-2 font-serif text-[1.7rem] font-normal leading-[1.04] tracking-tight text-deep-spruce sm:text-[2rem]">
            {businessName}
          </h2>
          <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-oxblood-brown">
            {details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </div>
          <p className="mt-4 font-serif text-base italic leading-relaxed text-smoked-olive">{description}</p>
        </div>

        <a
          href={ctaUrl}
          rel={isSponsored && isExternalUrl ? 'sponsored nofollow noopener' : undefined}
          className="flex min-h-12 items-center justify-between gap-4 border-y border-[#CFC1AA] py-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-oxblood-brown transition-colors hover:text-deep-spruce focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aged-brass"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>

        <p className="mt-4 text-[11px] leading-relaxed text-smoked-olive">
          {isSponsored
            ? supportMessage
            : 'Interested in becoming the single community partner featured here? Let’s talk.'}
        </p>
        {isSponsored && (
          <p className="mt-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.08em] text-[#7C6545]">
            {trustDisclosure}
          </p>
        )}
      </div>
    </aside>
  )
}
