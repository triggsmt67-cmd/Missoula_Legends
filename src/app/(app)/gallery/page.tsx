import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SubmitPhotoModal } from '@/components/SubmitPhotoModal'
import { GalleryContent } from '@/components/GalleryContent'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Community Gallery',
  description: 'A curated collection of photos celebrating Missoula, Montana — submitted by the community and hand-selected by the Missoula Legends curator.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Community Gallery | Missoula Legends',
    description: 'A curated collection of photos celebrating Missoula, Montana — submitted by the community and hand-selected by the Missoula Legends curator.',
    url: 'https://missoulalegends.com/gallery',
    siteName: 'Missoula Legends',
    images: [{ url: '/media/missoula-hero-twilight.png', width: 1200, height: 630, alt: 'Missoula Community Gallery' }],
  },
}

// Seed photos using existing media for the placeholder preview
const seedPhotos = [
  {
    id: 'seed_1',
    photo: { url: '/media/missoula-hero-twilight.png', alt: 'Missoula twilight panorama from the south hills' },
    caption: 'Golden hour settles over the Garden City — the Clark Fork catching the last light of the evening as the valley goes quiet.',
    photographerName: 'Trevor Riggs',
    photographerInstagram: '@missoulalegends',
    neighborhood: 'south-hills',
    category: 'nature',
    dateTaken: 'Summer 2024',
    featured: true,
  },
  {
    id: 'seed_2',
    photo: { url: '/media/rockin-rudys.jpg', alt: "Rockin' Rudy's record store storefront on Higgins" },
    caption: "Four decades of crates, records, and good taste. Rockin' Rudy's on the Hip Strip remains one of Missoula's most iconic storefronts.",
    photographerName: 'Community Submission',
    photographerInstagram: null,
    neighborhood: 'hip-strip',
    category: 'business',
    dateTaken: 'Spring 2024',
    featured: false,
  },
  {
    id: 'seed_3',
    photo: { url: '/media/montgomery-distillery.jpg', alt: 'Montgomery Distillery interior and bar' },
    caption: "The warm amber light of Montgomery Distillery on a Friday evening — small-batch spirits crafted right here in Missoula's downtown.",
    photographerName: 'Community Submission',
    photographerInstagram: null,
    neighborhood: 'downtown',
    category: 'food-drink',
    dateTaken: 'Winter 2023',
    featured: false,
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  neighborhoods: 'Neighborhoods & Streets',
  business: 'Local Business',
  events: 'Events & Community',
  nature: 'Nature & Outdoors',
  history: 'History & Archival',
  'food-drink': 'Food & Drink',
  people: 'People of Missoula',
}

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  downtown: 'Downtown',
  'hip-strip': 'Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  northside: 'Northside',
  westside: 'Westside',
  rattlesnake: 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  lolo: 'Lolo',
  'greater-missoula': 'Greater Missoula Area',
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try { return decodeURIComponent(url) } catch { return url }
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function GalleryPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined

  let photos: any[] = []
  let featuredPhoto: any = null

  try {
    const payload = await getPayload({ config })
    const query: any = {
      collection: 'gallery',
      depth: 1,
      sort: '-publishedAt',
      limit: 100,
      overrideAccess: false,
    }
    if (activeCategory) {
      query.where = { category: { equals: activeCategory } }
    }
    const res = await payload.find(query)
    const allPhotos = res.docs

    // If DB has real photos, use them; otherwise fall back to seed placeholders
    if (allPhotos.length > 0) {
      featuredPhoto = allPhotos.find((p: any) => p.featured) || allPhotos[0] || null
      photos = allPhotos.filter((p: any) => p.id !== featuredPhoto?.id)
    } else {
      // No photos in gallery yet — show seed placeholders
      let source = activeCategory ? seedPhotos.filter(p => p.category === activeCategory) : seedPhotos
      featuredPhoto = source.find(p => p.featured) || source[0] || null
      photos = source.filter(p => p.id !== featuredPhoto?.id)
    }
  } catch (e) {
    // DB unavailable — show seed placeholders
    let source = activeCategory ? seedPhotos.filter(p => p.category === activeCategory) : seedPhotos
    featuredPhoto = source.find(p => p.featured) || source[0] || null
    photos = source.filter(p => p.id !== featuredPhoto?.id)
  }

  const allDisplayPhotos = featuredPhoto ? [featuredPhoto, ...photos] : photos
  const totalCount = allDisplayPhotos.length

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema.org for gallery page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            'name': 'Missoula Legends Community Gallery',
            'description': 'A curated collection of community-submitted photography celebrating Missoula, Montana.',
            'url': 'https://missoulalegends.com/gallery',
            'publisher': {
              '@type': 'Organization',
              'name': 'Missoula Legends',
              'url': 'https://missoulalegends.com',
            },
          })
        }}
      />

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      <Header />

      {/* ─── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#FAF8F4] to-ivory-paper dark:from-[#141815]/40 dark:to-soft-black border-b border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left side: Copy & Actions */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6 animate-fade-in">
                <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] uppercase font-bold bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
                  Community Gallery
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-deep-spruce dark:text-white tracking-tight leading-[1.05] mb-6 animate-fade-in [animation-delay:50ms]">
                Missoula Through
                <br />
                <span className="text-aged-brass italic">Your Lens.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-xl mb-8 animate-fade-in [animation-delay:100ms]">
                Missoula doesn’t need to be dressed up. It just needs someone with the eye to catch it right: the light on an old brick wall, the quiet pride behind a counter, the river at the right hour, and the small details most people walk past. This is a showcase for the photographers who see Missoula clearly, and for the people and places that make it worth seeing.
              </p>
              
              <div className="flex items-center gap-4 animate-fade-in [animation-delay:150ms]">
                <SubmitPhotoModal />
              </div>
            </div>

            {/* Right side: Elegant Framed Showcase Image */}
            <div className="lg:col-span-7 w-full animate-fade-in [animation-delay:100ms]">
              <div className="p-2 sm:p-3 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2rem] shadow-xl">
                <div className="relative aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-ivory-paper dark:bg-soft-black">
                  <Image
                    src="/media/missoula-hero-twilight.png"
                    alt="Scenic twilight view of Missoula, Montana"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 800px"
                    className="object-cover object-center scale-100 hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <div className="mt-3 px-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-warm-stone">
                  <span>📷 Trevor Riggs</span>
                  <span>South Hills Twilight</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER BAR ───────────────────────────────────────────────── */}
      <section className="sticky top-20 z-30 bg-ivory-paper/95 dark:bg-soft-black/95 backdrop-blur-md border-b border-warm-limestone/40 dark:border-warm-limestone/10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <Link
              href="/gallery"
              className={`text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-lg border whitespace-nowrap transition-all active:scale-[0.97] flex-shrink-0 ${
                !activeCategory
                  ? 'bg-deep-spruce text-ivory-paper border-deep-spruce font-bold'
                  : 'bg-transparent text-warm-stone border-warm-limestone/60 dark:border-warm-limestone/20 hover:border-warm-stone'
              }`}
            >
              All Photos
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/gallery?category=${key}`}
                className={`text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-lg border whitespace-nowrap transition-all active:scale-[0.97] flex-shrink-0 ${
                  activeCategory === key
                    ? 'bg-deep-spruce text-ivory-paper border-deep-spruce font-bold'
                    : 'bg-transparent text-warm-stone border-warm-limestone/60 dark:border-warm-limestone/20 hover:border-warm-stone'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN GRID ─────────────────────────────────────────────────────────── */}
      <main className="max-w-[1320px] mx-auto px-5 sm:px-8 py-12 md:py-16">
        {allDisplayPhotos.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-warm-limestone/30 dark:bg-warm-limestone/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-warm-stone" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              </svg>
            </div>
            <p className="font-serif text-2xl text-deep-spruce dark:text-ivory-paper mb-3">No photos in this category yet.</p>
            <p className="text-warm-stone text-sm font-normal mb-8 max-w-sm mx-auto">Be the first to submit a photo in this category and see Missoula through your lens.</p>
            <Link href="/gallery" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:underline">
              &larr; View All Photos
            </Link>
          </div>
        ) : (
          <GalleryContent
            photos={photos}
            featuredPhoto={featuredPhoto}
            activeCategory={activeCategory}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
