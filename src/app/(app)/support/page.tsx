import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Support the Record',
  description: 'Support independent local storytelling, photography, historical research, and free business directory listings in Missoula, Montana.',
  alternates: { canonical: '/support' },
}

export default function SupportPage() {
  const supportUrl = process.env.SUPPORT_URL

  const fundingItems = [
    {
      title: 'Local Interviews & Reporting',
      description: 'Funding the time required to sit down with longtime business owners, craftsmen, and neighborhood fixtures to record their firsthand stories.',
      icon: (
        <svg className="w-5 h-5 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      ),
    },
    {
      title: 'Original Photography',
      description: 'Documenting Missoula storefronts, workshops, equipment, and faces with high-quality original photography rather than stock images.',
      icon: (
        <svg className="w-5 h-5 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      ),
    },
    {
      title: 'Historical Research & Preservation',
      description: 'Digging through local archives, deeds, old photographs, and city records to verify historical context and keep Missoula heritage accessible.',
      icon: (
        <svg className="w-5 h-5 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      title: 'Directory Maintenance & Corrections',
      description: 'Constantly reviewing operating details, hours, contact information, and owner requests to ensure the local directory stays useful and reliable.',
      icon: (
        <svg className="w-5 h-5 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
    },
    {
      title: 'Hosting & Technology Infrastructure',
      description: 'Covering domain registry, database operations, cloud hosting, speed optimization, and search index maintenance so the record stays online.',
      icon: (
        <svg className="w-5 h-5 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.7 4.95a2.25 2.25 0 0 1 1.8-.9h9a2.25 2.25 0 0 1 1.8.9l2.55 3.6a4.5 4.5 0 0 1 .9 2.7" />
        </svg>
      ),
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
            SUPPORT THE RECORD
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-deep-spruce dark:text-white tracking-tight leading-[1.05] mb-6">
            Help Keep Missoula’s Stories
            <br />
            <span className="text-aged-brass italic">on the Record.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-3xl mx-auto">
            Missoula Legends is free to read and free for qualifying local businesses to join. Reader support helps fund interviews, photography, historical research, technology, and the time required to document the places that make Missoula feel like Missoula.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        
        {/* Trust Statement Callout */}
        <div className="relative bg-[#FAF7F2] dark:bg-slate-900/40 border border-aged-brass/35 dark:border-aged-brass/25 rounded-2xl p-6 sm:p-8 mb-16 text-left shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-aged-brass/10 border border-aged-brass/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-aged-brass font-serif font-bold text-sm">❦</span>
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-deep-spruce dark:text-white mb-1.5">
                Our Editorial Independence
              </h2>
              <p className="font-serif text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/85 leading-relaxed font-normal">
                Support is voluntary. Contributors do not receive control over listings, rankings, recommendations, or editorial coverage.
              </p>
            </div>
          </div>
        </div>

        {/* What Support Funds */}
        <div className="mb-16 text-left">
          <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold mb-3 block">
            WHERE SUPPORT GOES
          </span>
          <h2 className="font-serif text-2.5xl sm:text-4xl text-deep-spruce dark:text-white mb-8 tracking-tight font-normal">
            What Voluntary Support Makes Possible
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fundingItems.map((item) => (
              <div key={item.title} className="p-6 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-xl shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-aged-brass/10 border border-aged-brass/20 flex items-center justify-center mb-4 shrink-0">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-smoked-olive dark:text-ivory-paper/78 leading-relaxed font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Action Section */}
        <div className="relative bg-deep-spruce text-ivory-paper border border-aged-brass/25 rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden text-center">
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
          />
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
            <span className="font-mono text-aged-brass tracking-[0.2em] text-[11px] uppercase font-bold">
              GET INVOLVED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white leading-snug">
              Interested in Backing This Work?
            </h2>
            <p className="font-serif text-base text-white/85 leading-relaxed font-normal">
              Whether you are an individual reader, a longtime resident, or someone who cares about preserving Missoula&apos;s character, we welcome your involvement.
            </p>

            {supportUrl ? (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-aged-brass hover:bg-aged-brass/90 text-soft-black px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98]"
              >
                Contribute to the Record &rarr;
              </a>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <a
                  href="mailto:trevor@missoulalegends.com?subject=Supporting%20Missoula%20Legends"
                  className="inline-flex items-center justify-center bg-aged-brass hover:bg-aged-brass/90 text-soft-black px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Ask About Supporting the Project &rarr;
                </a>
                <p className="text-[11px] font-mono text-white/60 tracking-wider">
                  Direct inquiry to Trevor Riggs &bull; trevor@missoulalegends.com
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Links */}
        <div className="mt-16 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-warm-stone">
          <Link href="/mission" className="hover:text-aged-brass transition-colors">
            &larr; Read Our Mission
          </Link>
          <Link href="/partner" className="hover:text-aged-brass transition-colors">
            Explore Business Partnerships &rarr;
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
