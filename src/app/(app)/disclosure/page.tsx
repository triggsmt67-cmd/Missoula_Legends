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
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
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
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            Missoula Legends is an independent, community-focused project run by Trevor Riggs. It was built purely to highlight the best of the Garden City. We believe in absolute transparency and want you to know exactly how this site runs.
          </p>
          
          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">No Paid Listings or Advertisements</h3>
          <p>
            We never accept payment, sponsorships, or paid ads to feature businesses, photographs, or stories. No one can buy their way onto this website or pay to get ranked higher. Every shop, builder, and story is hand-picked based on quality and community contribution.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">No Affiliate Links or Commissions</h3>
          <p>
            We do not use affiliate codes, referral links, or trackers to earn money when you visit, reserve a table, or purchase a service from a featured business. Any links to local websites are provided purely for your convenience.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">100% Free for Everyone</h3>
          <p>
            Missoula Legends is completely free. We do not charge local businesses to join our directory, and we do not charge readers to access our stories or photo gallery. This project is fueled purely by a love for Missoula.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
