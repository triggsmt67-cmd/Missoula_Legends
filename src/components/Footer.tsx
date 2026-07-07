import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-warm-limestone/30 dark:border-warm-limestone/10 bg-soft-black text-ivory-paper py-16 text-left">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono tracking-widest text-warm-stone uppercase">
              © {new Date().getFullYear()} Missoula Legends. All rights reserved.
            </p>
            <p className="text-[10px] font-mono text-warm-stone/50 uppercase tracking-widest mt-1.5">
              ROSTERS, HISTORIC STREETS & INDEPENDENT MAKERS
            </p>
            <p className="text-[10px] font-mono text-warm-stone/50 uppercase tracking-widest mt-2">
              Powered by <a href="https://truepath406.com" target="_blank" rel="noopener noreferrer" className="hover:text-aged-brass transition-colors underline">True Path Digital</a>
            </p>
          </div>
          <div className="flex gap-8 text-xs font-mono uppercase tracking-widest font-bold text-warm-stone">
            <Link href="/directory" className="hover:text-aged-brass transition-colors">
              Directory
            </Link>
            <Link href="/history/stories" className="hover:text-aged-brass transition-colors">
              History
            </Link>
            <Link href="/" className="hover:text-aged-brass transition-colors">
              Editorial
            </Link>
            <Link href="/claim" className="hover:text-aged-brass transition-colors">
              Get Listed Free
            </Link>
          </div>
        </div>
        <div className="border-t border-warm-limestone/10 pt-6 flex flex-col gap-4">
          <p className="text-xs text-warm-stone/70 leading-relaxed max-w-[90ch]">
            <span className="font-bold text-warm-stone/95">Disclosure & Transparency:</span> Missoula Legends is an independent local directory and editorial project. Business information may come from public sources, owner submissions, community suggestions, and editorial research. Inclusion does not imply endorsement, sponsorship, partnership, or approval unless clearly stated. Read our full <Link href="/disclosure" className="underline hover:text-aged-brass transition-colors">Disclosure & Transparency Policy</Link>.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-widest text-warm-stone/50 mt-2">
            <Link href="/privacy" className="hover:text-aged-brass transition-colors">Privacy Policy</Link>
            <span className="text-warm-stone/20">•</span>
            <Link href="/terms" className="hover:text-aged-brass transition-colors">Terms Policy</Link>
            <span className="text-warm-stone/20">•</span>
            <Link href="/content-use" className="hover:text-aged-brass transition-colors">Content Use Policy</Link>
            <span className="text-warm-stone/20">•</span>
            <Link href="/sitemap" className="hover:text-aged-brass transition-colors">HTML Sitemap</Link>
            <span className="text-warm-stone/20">•</span>
            <a href="/sitemap.xml" target="_blank" className="hover:text-aged-brass transition-colors">XML Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
