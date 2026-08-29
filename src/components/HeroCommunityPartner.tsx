import Image from 'next/image'

type PartnerLogo = {
  url?: string | null
  alt?: string | null
  sizes?: { thumbnail?: { url?: string | null } | null } | null
}

type DirectoryListingRel = {
  id?: string | number
  businessName?: string | null
  slug?: string | null
  category?: string | null
  neighborhood?: string | null
  description?: string | null
  featuredImage?: PartnerLogo | null
  hours?: string | null
  contactInfo?: {
    phone?: string | null
    website?: string | null
    instagram?: string | null
    address?: string | null
  } | null
  seoMetadata?: {
    ownerName?: string | null
    ownerTitle?: string | null
  } | null
}

export type HeroCommunityPartnerData = {
  displayMode?: 'available' | 'sponsored' | null
  directoryListing?: DirectoryListingRel | string | number | null
  businessName?: string | null
  monogram?: string | null
  logo?: PartnerLogo | string | number | null
  locationLabel?: string | null
  categoryLabel?: string | null
  ownershipLabel?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  supportMessage?: string | null
}

type Props = {
  partner?: HeroCommunityPartnerData | null
}

const CATEGORY_LABELS: Record<string, string> = {
  'food-drink': 'Food & Drink',
  'shopping': 'Local Goods & Shopping',
  'lifestyle': 'Lifestyle & Recreation',
  'automotive': 'Automotive',
  'auto-repair': 'Auto Repair & Service',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical Services',
  'towing': 'Towing & Recovery',
  'welding-fabrication': 'Welding & Fabrication',
}

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  'downtown': 'Downtown Missoula',
  'hip-strip': 'The Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  'northside': 'Northside',
  'westside': 'Westside',
  'rattlesnake': 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'orchard-homes-target-range': 'Orchard Homes',
  'rose-park': 'Rose Park',
  'miller-creek-linda-vista': 'Miller Creek',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  'bonner-milltown': 'Bonner-Milltown',
  'lolo': 'Lolo, MT',
  'wye': 'The Wye',
}

const disclosure = 'Paid placement never affects directory rankings or editorial coverage.'

export function HeroCommunityPartner({ partner }: Props) {
  const listing =
    typeof partner?.directoryListing === 'object' && partner.directoryListing !== null
      ? (partner.directoryListing as DirectoryListingRel)
      : null

  const isSponsored = partner?.displayMode === 'sponsored' && Boolean(partner.businessName || listing?.businessName)

  const businessName = isSponsored
    ? (partner?.businessName || listing?.businessName || 'Community Partner')
    : 'Support Missoula Legends'

  const monogram = isSponsored
    ? partner?.monogram || getMonogram(businessName)
    : 'ML'

  // Determine logo: custom upload override, or listing featured image
  const customLogo = typeof partner?.logo === 'object' ? partner.logo : null
  const listingImage = listing?.featuredImage || null
  const logo = customLogo || listingImage
  const logoUrl = logo?.sizes?.thumbnail?.url || logo?.url

  // Location label: custom override, or formatted neighborhood / address
  const locationLabel = isSponsored
    ? partner?.locationLabel || (listing?.neighborhood ? (NEIGHBORHOOD_LABELS[listing.neighborhood] || listing.neighborhood) : 'Missoula, MT')
    : 'One exclusive position'

  // Category label: custom override, or formatted directory category
  const categoryLabel = isSponsored
    ? partner?.categoryLabel || (listing?.category ? (CATEGORY_LABELS[listing.category] || listing.category) : 'Featured Provider')
    : 'Missoula'

  // Ownership / Detail: custom override, or hours / founder / locally owned
  const ownershipLabel = isSponsored
    ? partner?.ownershipLabel || (listing?.seoMetadata?.ownerName ? 'Founded by ' + listing.seoMetadata.ownerName : 'Locally Owned')
    : 'No rotating ads'

  // Description: custom override, or directory profile description
  const description = isSponsored
    ? partner?.description || listing?.description || 'A local business helping keep Missoula informed and connected.'
    : 'One community partnership helps keep local listings free and supports the stories that document our city.'

  // CTA link: custom override, or business website, or internal directory profile link
  const defaultCtaUrl = listing?.contactInfo?.website || (listing?.slug ? '/directory/' + listing.slug : '#')
  const ctaUrl = isSponsored
    ? normalizePartnerUrl(partner?.ctaUrl || defaultCtaUrl)
    : 'mailto:trevor@missoulalegends.com?subject=Missoula%20Legends%20Community%20Partnership'

  const ctaLabel = isSponsored
    ? partner?.ctaLabel || (listing?.contactInfo?.website ? 'Visit Official Website' : 'Explore Profile')
    : 'Ask About Partnership'

  const details = isSponsored
    ? [locationLabel, categoryLabel, ownershipLabel].filter(Boolean)
    : [locationLabel, categoryLabel, ownershipLabel]

  return (
    <aside
      aria-label={isSponsored ? 'Sponsored community partner: ' + businessName : 'Community partner opportunity'}
      className="w-full max-w-[500px] xl:justify-self-end rounded-[0.45rem] border border-aged-brass/80 bg-deep-spruce p-2.5 sm:p-3 shadow-[0_30px_75px_rgba(23,35,29,0.25)]"
    >
      <div className="flex items-center justify-between gap-3 px-2 py-2 pb-4 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8D8B8]">
        <span>Missoula Legends Community Partner</span>
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
            <p className="mt-2 font-mono text-[9px] tracking-[0.13em] text-warm-stone">
              {isSponsored ? 'SP · 0001 · MISSOULA' : 'SP · OPEN · MISSOULA'}
            </p>
          </div>
          <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-aged-brass font-serif text-xl text-oxblood-brown outline outline-1 outline-offset-[-6px] outline-dashed outline-aged-brass/75 sm:h-[68px] sm:w-[68px] sm:text-2xl">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logo?.alt || businessName + ' logo'}
                fill
                sizes="68px"
                quality={65}
                className="object-contain p-2.5"
              />
            ) : monogram}
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
            {details.map((detail) => <span key={detail}>{detail}</span>)}
          </div>
          <p className="mt-4 font-serif text-base italic leading-relaxed text-smoked-olive">{description}</p>
        </div>

        <a
          href={ctaUrl}
          rel={isSponsored && ctaUrl.startsWith('http') ? 'sponsored nofollow noopener' : undefined}
          className="flex min-h-12 items-center justify-between gap-4 border-y border-[#CFC1AA] py-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-oxblood-brown transition-colors hover:text-deep-spruce focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aged-brass"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>

        <p className="mt-4 text-[11px] leading-relaxed text-smoked-olive">
          {isSponsored
            ? partner?.supportMessage || 'This sponsorship supports free directory listings and independent local storytelling.'
            : 'Interested in becoming the single community partner featured here? Let’s talk.'}
        </p>
        {isSponsored && (
          <p className="mt-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.08em] text-[#7C6545]">
            {disclosure}
          </p>
        )}
      </div>
    </aside>
  )
}

function getMonogram(name?: string | null) {
  if (!name) return 'ML'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function normalizePartnerUrl(value?: string | null) {
  if (!value) return '#'
  if (value.startsWith('/')) return value
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '#'
  } catch {
    return '#'
  }
}
