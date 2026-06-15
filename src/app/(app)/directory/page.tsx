import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { DirectorySearchSection } from '@/components/DirectorySearchSection'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedDirectory } from '../../../data/seedData.js'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Missoula Business Directory',
    description: 'Explore the definitive guide to local trades, services, dining, and craftsmanship in Missoula, Montana.',
    alternates: { canonical: '/directory' },
    openGraph: {
      title: 'Missoula Business Directory | Missoula Legends',
      description: 'Explore the definitive guide to local trades, services, dining, and craftsmanship in Missoula, Montana.',
      url: 'https://missoulalegends.com/directory',
      siteName: 'Missoula Legends',
    },
  }
}

export default async function DirectoryPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined

  let listings = []

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      depth: 1,
      overrideAccess: false,
      limit: 1000,
    })
    listings = res.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    const sourceListings = seedDirectory
    listings = sourceListings.map((listing, idx) => ({
      id: `directory_${idx}`,
      businessName: listing.businessName,
      category: listing.category,
      neighborhood: listing.neighborhood,
      description: listing.description,
      featuredImage: {
        url: `/media/${listing.mediaKey}`,
        alt: listing.businessName,
      },
      contactInfo: listing.contactInfo,
      status: listing.status || 'listed',
      slug: listing.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Header Navigation */}
      <Header />

      {/* Directory Hero Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-24 md:py-32 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            ESTABLISHED REGISTRY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Missoula Business Directory
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-6 font-serif">
            A guide to local establishments and independent tradesmen representing the craft, flavor, and character of Missoula. Search local services or filter by trade category to find the local pros.
          </p>
        </div>
      </section>

      {/* Main Browseable Area */}
      <main className="max-w-[1200px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        {/* Client-side Search and Filter Interface */}
        <DirectorySearchSection listings={listings} initialCategory={activeCategory} />
        
        {/* Directory Disclaimer */}
        <div className="max-w-[850px] mx-auto mt-20 pt-10 border-t border-warm-limestone/40 dark:border-warm-limestone/15 text-left">
          <p className="text-xs text-warm-stone/85 leading-relaxed font-serif">
            Missoula Legends is an independent local directory. Business information is gathered from public sources, owner submissions, community suggestions, and editorial research. We do our best to keep details accurate, but hours, services, contact information, and availability may change. Inclusion does not imply endorsement, sponsorship, partnership, or approval by the listed business. Owners may request updates, corrections, or removal.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
