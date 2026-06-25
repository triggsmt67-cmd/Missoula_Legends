import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Our Mission',
  description: 'Learn why Missoula Legends was created: a completely free guide documenting the local businesses, photography, and history of the Garden City.',
  alternates: { canonical: '/mission' },
}

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
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

        <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-8 py-20 md:py-28 text-center">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-deep-spruce dark:text-white tracking-tight leading-[1.05] mb-6">
            Documenting the Garden City,
            <br />
            <span className="text-aged-brass italic">One Legend at a Time.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-3xl mx-auto">
            Missoula isn’t just a spot on a Montana map. It’s a mix of local shops, old stories, and quiet moments that make this valley special. We’re here to write them down.
          </p>
        </div>
      </section>

      {/* ─── MAIN STATEMENT ────────────────────────────────────────────────────── */}
      <main className="max-w-[900px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        {/* Introduction */}
        <div className="prose prose-xl dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed mb-16 text-left">
          <p className="text-xl sm:text-2xl font-normal text-deep-spruce dark:text-white/95 leading-relaxed mb-6">
            As Missoula grows and the internet gets noisier, it’s easy to lose track of the local shop owners, honest tradespeople, and neighborhood spots that make our community special. Most websites and search apps just show you whoever spends the most on advertising, rather than who actually serves the town best.
          </p>
          <p className="text-lg sm:text-xl font-normal text-smoked-olive dark:text-ivory-paper/78 mb-6">
            <strong>Missoula Legends</strong> was built to be a quiet break from all that online noise. This is a local guide selected through research, community suggestions, and first-hand interest—a clean, quiet corner of the web where we share the stories of the people, places, and history that actually make Missoula what it is.
          </p>
        </div>

        {/* The 3 Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
          {[
            {
              title: 'Local Businesses',
              desc: 'We profile the local shops, builders, and makers who create things that last. If they do great work in Missoula, they belong here.',
              icon: (
                <svg className="w-6 h-6 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              )
            },
            {
              title: 'Community Photography',
              desc: 'We showcase Missoula through the eyes of the people who walk its streets. No filters, no generic stock photos. Just the raw, beautiful light of the Garden City.',
              icon: (
                <svg className="w-6 h-6 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              )
            },
            {
              title: 'Preserving History',
              desc: 'We share stories of the old buildings, landmarks, and early days of our valley. Knowing where we came from helps us shape where we are heading.',
              icon: (
                <svg className="w-6 h-6 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              )
            }
          ].map((pillar) => (
            <div key={pillar.title} className="p-6 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-aged-brass/10 border border-aged-brass/20 flex items-center justify-center mb-5 shrink-0">
                {pillar.icon}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-spruce dark:text-white mb-2.5">{pillar.title}</h3>
              <p className="text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/78 leading-relaxed font-normal">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* ─── MANIFESTO (THE NO FEES CLAUSE) ──────────────────────────────────────── */}
        <div className="relative bg-deep-spruce text-ivory-paper border border-aged-brass/25 rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden mb-16 text-left">
          {/* Watermark map background */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
          />
          <div className="relative z-10">
            <span className="font-mono text-aged-brass tracking-[0.2em] text-[11px] sm:text-xs uppercase font-bold mb-4 block">
              Our Independence
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6 leading-tight">
              No Fees. No Pay-to-Play.
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-white/90 leading-relaxed font-serif font-normal">
              <p>
                Almost every city guide, local directory, or magazine is really just a bunch of paid ads. Businesses pay to get featured, buy their way to the top of the list, or lock their info behind paywalls. We don’t believe in that.
              </p>
              <p>
                <strong>Missoula Legends does not charge a single penny.</strong> It is completely free. We don't charge shops to join, we don't charge you to read, and no one can pay us to get a higher ranking.
              </p>
              <p>
                Missoula Legends is built through local research, editorial judgment, community suggestions, and first-hand interest in the people and places that shape Missoula. Some listings are simple directory entries. Others may become deeper stories, profiles, or features over time.
              </p>
              <p>
                Inclusion does not imply a formal relationship, endorsement, sponsorship, or approval by the listed business unless clearly stated.
              </p>
            </div>
          </div>
        </div>

        {/* ─── CALL TO ACTION ──────────────────────────────────────────────────────── */}
        <div className="text-center py-12 border-t border-warm-limestone/50 dark:border-warm-limestone/15 flex flex-col gap-8">
          <div>
            <h2 className="font-serif text-2.5xl sm:text-3.5xl text-deep-spruce dark:text-white mb-3">Help Us Map the Legends</h2>
            <p className="text-xs sm:text-sm text-smoked-olive dark:text-ivory-paper/78 max-w-xl mx-auto font-normal">
              Whether you are an independent provider looking to claim your free profile or a reader looking to nominate a local craftsman, let's keep Missoula's character intact.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/claim" 
              className="w-full sm:w-auto bg-deep-spruce hover:bg-oxblood-brown dark:bg-[#203633] text-ivory-paper dark:hover:bg-aged-brass dark:hover:text-soft-black px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold transition-all text-center shadow-sm"
            >
              Claim Free Profile
            </Link>
            <Link 
              href="/spotlight" 
              className="w-full sm:w-auto bg-aged-brass hover:bg-aged-brass/90 text-soft-black px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold transition-all text-center shadow-sm"
            >
              Apply for Spotlight
            </Link>
            <Link 
              href="/nominate" 
              className="w-full sm:w-auto bg-transparent border border-deep-spruce/20 dark:border-white/20 text-deep-spruce dark:text-white px-8 py-4 rounded-md hover:bg-warm-limestone/10 font-mono text-xs uppercase tracking-widest font-bold transition-all text-center"
            >
              Nominate a Legend
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
