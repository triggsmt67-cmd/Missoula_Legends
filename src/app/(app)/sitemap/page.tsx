import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedDirectory, seedArticles } from '../../../data/seedData.js'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Sitemap | Missoula Legends',
  description: 'Explore the complete index of local business profiles, editorial stories, historical features, and categories in the Missoula Legends directory.',
  alternates: { canonical: '/sitemap' },
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
  automotive: 'Automotive',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'auto-repair': 'Auto Repair',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical',
  'towing': 'Towing',
  'welding-fabrication': 'Welding & Fabrication',
}

const getSeedSlug = (businessName: string) => {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function HTMLSitemapPage() {
  let listings: any[] = []
  let articles: any[] = []
  let histories: any[] = []

  try {
    const payload = await getPayload({ config })
    
    // Fetch listings
    const dirRes = await payload.find({
      collection: 'directory',
      depth: 0,
      limit: 1000,
    })
    listings = dirRes.docs

    // Fetch articles
    const artRes = await payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1000,
    })
    articles = artRes.docs

    // Fetch history
    const histRes = await payload.find({
      collection: 'history',
      depth: 0,
      limit: 1000,
    })
    histories = histRes.docs
  } catch (e: any) {
    console.warn('Database failed to fetch sitemap links, falling back to seed/mock data:', e.message)
    // Fallback listings
    listings = seedDirectory.map((l: any) => ({
      businessName: l.businessName,
      slug: getSeedSlug(l.businessName),
      category: l.category,
    }))

    // Fallback articles
    articles = seedArticles.map((a: any) => ({
      title: a.title,
      slug: a.slug,
    }))

    // Fallback history
    histories = [
      {
        title: "The Wilma Theatre: Missoula's Palace of Cinema",
        slug: 'the-wilma-theatre-palace-of-cinema',
      }
    ]
  }

  // Define static pages
  const staticPages = [
    { name: 'Home / Interactive Map', href: '/' },
    { name: 'Business Directory Registry', href: '/directory' },
    { name: 'Editorial Stories Hub', href: '/stories' },
    { name: 'Historical Vault', href: '/history' },
    { name: 'Community Photo Gallery', href: '/gallery' },
    { name: 'Nominate a Legend', href: '/nominate' },
    { name: 'Apply for a Local Spotlight', href: '/spotlight' },
    { name: 'Our Mission & Story', href: '/mission' },
  ]

  // Define legal pages
  const legalPages = [
    { name: 'Disclosure & Transparency', href: '/disclosure' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Content Use Policy', href: '/content-use' },
  ]

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-16 md:py-24 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            SITE INDEX
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-[1.1]">
            HTML Sitemap
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-2xl mx-auto mt-4 font-serif">
            A comprehensive hierarchical directory mapping all sections, stories, and registered local businesses.
          </p>
        </div>
      </section>

      {/* Sitemap Grid Main Section */}
      <main className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
          
          {/* Column 1: Core Pages & Sectors */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Editorial & Core Pages
              </h2>
              <ul className="space-y-2.5 text-sm font-mono">
                {staticPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="hover:text-aged-brass hover:underline transition-colors block">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Directory Sectors
              </h2>
              <ul className="space-y-2.5 text-sm font-mono">
                {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
                  <li key={slug}>
                    <Link href={`/directory/category/${slug}`} className="hover:text-aged-brass hover:underline transition-colors block">
                      {label} Sector
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Registered Business Profiles */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Business Profiles ({listings.length})
              </h2>
              {listings.length > 0 ? (
                <ul className="space-y-2.5 text-sm font-mono max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {listings.map((biz) => (
                    <li key={biz.slug || biz.businessName}>
                      <Link href={`/directory/${biz.slug}`} className="hover:text-aged-brass hover:underline transition-colors block">
                        {biz.businessName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-warm-stone italic">No profiles registered.</p>
              )}
            </div>
          </div>

          {/* Column 3: Stories, Historical Features & Policies */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Editorial Features
              </h2>
              {articles.length > 0 ? (
                <ul className="space-y-2.5 text-sm font-mono mb-8">
                  {articles.map((art) => (
                    <li key={art.slug}>
                      <Link href={`/articles/${art.slug}`} className="hover:text-aged-brass hover:underline transition-colors block">
                        {art.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-warm-stone italic mb-8">No articles found.</p>
              )}
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Historical Vault Features
              </h2>
              {histories.length > 0 ? (
                <ul className="space-y-2.5 text-sm font-mono mb-8">
                  {histories.map((hist) => (
                    <li key={hist.slug}>
                      <Link href={`/history/${hist.slug}`} className="hover:text-aged-brass hover:underline transition-colors block">
                        {hist.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-warm-stone italic mb-8">No historical vaults mapped.</p>
              )}
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4 border-b border-warm-limestone/50 pb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Policies & Legals
              </h2>
              <ul className="space-y-2.5 text-sm font-mono">
                {legalPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="hover:text-aged-brass hover:underline transition-colors block">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
