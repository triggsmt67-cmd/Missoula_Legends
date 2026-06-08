import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

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
            LEGAL REGISTRY
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Disclosure Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            This Disclosure Policy is designed to maintain absolute transparency between Missoula Legends and our audience. We believe in open communication regarding how our editorial directory is supported and maintained.
          </p>
          
          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">Paid Partnerships & Promotion</h3>
          <p>
            Missoula Legends may include paid partnerships, sponsored editorial listings, affiliate links, advertising, and the promotion of the curators’ and owners' own businesses. Any content that is sponsored, paid, or features commercial arrangements will be clearly identified and disclosed on the respective page.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">Editorial Independence</h3>
          <p>
            Despite receiving promotional support or sponsorships for featured sections, our editorial team creates all guides, reviews, historical narratives, and photography layouts independently. Sponsorship status does not guarantee positive reviews or influence our editorial integrity.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">Affiliate & Partner Links</h3>
          <p>
            We may earn a small referral commission if you purchase services or reserve tables through select affiliate links embedded in business listings. This does not change the price of the service to you, and we only recommend products or businesses we personally curated and believe in.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
