import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Partner with Missoula Legends',
  description: 'Explore publication sponsorships, section support, and optional creative services with Missoula Legends while preserving independent editorial integrity.',
  alternates: { canonical: '/partner' },
}

export default function PartnerPage() {
  const partnershipOptions = [
    {
      number: '01',
      title: 'Publication & Newsletter Sponsorship',
      description: 'Support general editorial reporting and receive clearly labeled recognition in our publication and community newsletter dispatches. Sponsorship is visibly disclosed and never confused with editorial reporting.',
    },
    {
      number: '02',
      title: 'Section & Historical Project Support',
      description: 'Underwrite deep-dive historical research, photography series, or dedicated neighborhood archive projects that preserve key chapters of Missoula history for public access.',
    },
    {
      number: '03',
      title: 'Optional Creative & Marketing Services',
      description: 'For business owners who want assistance beyond their free core listing—such as original photography, storytelling profiles, website copy, or local marketing strategy provided separately through True Path Digital.',
    },
  ]

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#FAF8F4] to-ivory-paper dark:from-[#141815]/40 dark:to-soft-black border-b border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-8 py-20 md:py-28 text-center">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            PARTNERSHIPS &amp; SPONSORSHIPS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-deep-spruce dark:text-white tracking-tight leading-[1.05] mb-6">
            Support the Publication
            <br />
            <span className="text-aged-brass italic">Without Buying Its Judgment.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-3xl mx-auto">
            Missoula Legends partners with organizations, businesses, and patrons who appreciate local history, craft, and honest community storytelling.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        
        {/* Prominent Editorial Independence Statement */}
        <div className="relative bg-deep-spruce text-ivory-paper border border-aged-brass/35 rounded-2xl p-8 sm:p-10 mb-16 text-left shadow-lg overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
          />
          <div className="relative z-10">
            <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold mb-3 block">
              OUR SPONSORSHIP PRINCIPLE
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white font-normal leading-relaxed">
              Sponsorship supports the work. It does not determine who we cover, how businesses are ranked, or what our independent editorial content says.
            </p>
          </div>
        </div>

        {/* 3 Distinct Options */}
        <div className="mb-16 text-left">
          <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold mb-3 block">
            PARTNERSHIP PATHWAYS
          </span>
          <h2 className="font-serif text-2.5xl sm:text-4xl text-deep-spruce dark:text-white mb-8 tracking-tight font-normal">
            Three Ways to Work Together
          </h2>

          <div className="flex flex-col gap-6">
            {partnershipOptions.map((opt) => (
              <div key={opt.number} className="p-8 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                <span className="font-mono text-xs text-aged-brass font-bold uppercase tracking-widest bg-aged-brass/10 px-3 py-1.5 rounded-md shrink-0">
                  Option {opt.number}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-2.5">
                    {opt.title}
                  </h3>
                  <p className="font-serif text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/78 leading-relaxed font-normal">
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Separation Note */}
        <div className="bg-[#FAF7F2] dark:bg-slate-900/40 border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-xl p-6 sm:p-8 mb-16 text-left">
          <h3 className="font-serif text-base font-bold text-deep-spruce dark:text-white mb-2">
            Clear Separation of Services &amp; Directory Listings
          </h3>
          <p className="text-xs sm:text-sm text-smoked-olive dark:text-ivory-paper/80 leading-relaxed font-normal">
            Core directory listings are always free for qualifying local businesses. Purchasing creative or marketing services from True Path Digital is entirely optional, never required for directory inclusion, and never alters editorial coverage or ranking.
          </p>
        </div>

        {/* Contact / Inquiry Box */}
        <div className="bg-[#FCFAF6] dark:bg-[#1A201E]/80 border-2 border-aged-brass/35 dark:border-aged-brass/25 rounded-2xl p-8 sm:p-12 text-center shadow-md">
          <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold mb-3 block">
            GET IN TOUCH
          </span>
          <h2 className="font-serif text-2.5xl sm:text-3.5xl text-deep-spruce dark:text-white mb-4 font-normal tracking-tight">
            Start a Partnership Conversation
          </h2>
          <p className="text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/80 max-w-lg mx-auto mb-8 font-normal leading-relaxed">
            If your organization wants to explore publication sponsorship, project underwriting, or optional creative services, write directly to Trevor.
          </p>

          <a
            href="mailto:trevor@missoulalegends.com?subject=Partnership%20Inquiry%20%E2%80%94%20Missoula%20Legends"
            className="inline-flex items-center justify-center bg-deep-spruce hover:bg-oxblood-brown dark:bg-aged-brass dark:hover:bg-aged-brass/90 text-ivory-paper dark:text-soft-black px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98]"
          >
            Inquire About Partnerships &rarr;
          </a>

          <p className="text-[11px] font-mono text-warm-stone/70 tracking-wider mt-4">
            trevor@missoulalegends.com &bull; Plain conversations, no automated sales funnel
          </p>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-16 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-warm-stone">
          <Link href="/support" className="hover:text-aged-brass transition-colors">
            &larr; Reader Support
          </Link>
          <Link href="/disclosure" className="hover:text-aged-brass transition-colors">
            Read Disclosure Policy &rarr;
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
