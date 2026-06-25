import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclosure & Transparency | Missoula Legends',
  description: 'Read the Missoula Legends disclosure and transparency policy for our community-focused directory.',
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
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            TRANSPARENCY
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Disclosure & Transparency
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed space-y-6">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            Missoula Legends is an independent local directory and editorial project created by Trevor Riggs and True Path Digital Solutions.
          </p>
          <p>
            Listings are selected through public research, local knowledge, community suggestions, owner submissions, and editorial judgment.
          </p>
          <p>
            Unless clearly stated, inclusion on this site does not mean a business has paid for placement, approved the listing, endorsed Missoula Legends, or entered into any formal relationship with True Path Digital Solutions.
          </p>
          <p>
            We do our best to keep business information accurate, but hours, services, ownership, menus, prices, availability, and contact details can change without notice.
          </p>
          <p>
            Business owners may request corrections, updates, or removal at any time by using our{' '}
            <Link href="/business-update" className="underline hover:text-aged-brass transition-colors">
              Business Update Request Form
            </Link>
            .
          </p>
          <p>
            Missoula Legends does not currently accept paid placement, sponsorships, affiliate commissions, or paid ranking boosts. If that changes, paid or sponsored placements will be clearly labeled.
          </p>
          <p>
            Missoula Legends is built to help people discover local businesses, landmarks, stories, and places worth knowing in Missoula. It is not an official ranking system, certification, endorsement, or review platform.
          </p>
        </div>
      </section>

      {/* Conversion / Action Section */}
      <section className="max-w-[800px] mx-auto px-6 pb-16 md:pb-24 text-left">
        <div className="bg-[#FAF7F2] dark:bg-slate-900/40 border border-warm-limestone/80 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white mb-1">
              Want your business highlighted?
            </h3>
            <p className="text-xs text-smoked-olive dark:text-ivory-paper/85 leading-relaxed font-normal">
              Claim your free listing or apply to be featured in the next Local Legends Spotlight. No cost, no catches.
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
              href="/spotlight"
              className="inline-flex items-center justify-center bg-aged-brass hover:bg-aged-brass/90 text-soft-black font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded-sm transition-all active:scale-[0.98] shadow-sm"
            >
              Apply Spotlight
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
