import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclosure & Transparency',
  description: 'Read the Missoula Legends disclosure, sponsorship policy, and editorial transparency standards.',
  alternates: { canonical: '/disclosure' },
}

export default function DisclosurePolicyPage() {
  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Header Navigation */}
      <Header />

      {/* Banner Title */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-16 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.webp")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            TRANSPARENCY & ETHICS
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Disclosure & Sponsorship Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed space-y-6">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: August 2026</p>
          
          <h2 className="text-2xl sm:text-3xl font-serif text-deep-spruce dark:text-white font-normal mt-8 mb-4">
            1. Free Core Directory Listings
          </h2>
          <p>
            Missoula Legends is an independent local guide created to celebrate the craft, heritage, and character of Missoula, Montana. Every qualifying local business is entitled to a free core directory listing. Businesses cannot pay for higher directory ranking, search placement, or favorable editorial treatment.
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-deep-spruce dark:text-white font-normal mt-8 mb-4">
            2. Clearly Labeled Underwriting Placements
          </h2>
          <p>
            To support free directory access, independent local research, and cultural documentation, Missoula Legends offers a limited number of clearly labeled community partner and section underwriting positions (such as the Homepage Hero partner, Category Underwriters, and Spotlight Program supporters).
          </p>
          <p>
            All paid sponsorships follow strict trust standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base font-sans">
            <li>Every paid placement is distinctly labeled with a visible <strong>&ldquo;Sponsored&rdquo;</strong> record badge.</li>
            <li>Outbound sponsor links adhere to web standards and search engine guidelines using <code className="font-mono text-xs bg-warm-limestone/40 dark:bg-slate-800 px-1.5 py-0.5 rounded">rel=&ldquo;sponsored nofollow noopener&rdquo;</code>.</li>
            <li>Sponsorships do not use invasive third-party ad trackers, behavioral cookies, or rotating ad networks.</li>
            <li>Underwriting never influences our editorial selections, historical stories, or directory inclusion decisions.</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-serif text-deep-spruce dark:text-white font-normal mt-8 mb-4">
            3. Editorial Independence & The Local Spotlight
          </h2>
          <p>
            Our monthly Local Spotlight and editorial stories are chosen independently by our curation team. While businesses may apply for consideration, selection is based entirely on local character, craft, community resonance, and story merit. A business cannot purchase a Spotlight feature.
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-deep-spruce dark:text-white font-normal mt-8 mb-4">
            4. Voluntary Reader & Business Support
          </h2>
          <p>
            Missoula Legends may also receive support through voluntary reader contributions and separate creative or digital services provided independently to local business owners. Any financial relationship is governed by the principle that editorial trust and directory integrity come first.
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-deep-spruce dark:text-white font-normal mt-8 mb-4">
            5. Business Corrections & Ownership Requests
          </h2>
          <p>
            We strive for historical and factual accuracy. Business owners may request updates, corrections, or profile modifications at any time through our{' '}
            <Link href="/business-update" className="underline hover:text-aged-brass transition-colors font-medium">
              Business Update Request Form
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Conversion / Action Section */}
      <section className="max-w-[800px] mx-auto px-6 pb-16 md:pb-24 text-left">
        <div className="bg-[#FAF7F2] dark:bg-slate-900/40 border border-warm-limestone/80 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white mb-1">
              Have questions or want to partner?
            </h3>
            <p className="text-xs text-smoked-olive dark:text-ivory-paper/85 leading-relaxed font-normal">
              Read our mission, explore underwriting opportunities, or claim your business profile today.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              href="/claim"
              className="inline-flex items-center justify-center bg-deep-spruce hover:bg-oxblood-brown dark:bg-[#203633] text-ivory-paper dark:hover:bg-aged-brass dark:hover:text-soft-black font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded-sm transition-all active:scale-[0.98] shadow-sm"
            >
              Get Listed Free
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center justify-center bg-aged-brass hover:bg-aged-brass/90 text-soft-black font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded-sm transition-all active:scale-[0.98] shadow-sm"
            >
              Partner Inquiries
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
