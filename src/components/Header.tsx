import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-ivory-paper/90 dark:bg-soft-black/90 backdrop-blur-md border-b border-warm-limestone/40 dark:border-warm-limestone/10">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg sm:text-xl tracking-tight text-deep-spruce dark:text-ivory-paper font-bold hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
          MISSOULA <span className="font-mono text-warm-stone font-normal tracking-[0.2em] text-[10px] sm:text-xs ml-1">LEGENDS</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8 text-xs font-mono uppercase tracking-widest font-bold">
          <Link href="/" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Home
          </Link>
          <Link href="/archives" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Archives
          </Link>
          <Link href="/history/archives" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            History
          </Link>
          <Link href="/directory" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Directory
          </Link>
          <Link
            href="/spotlight"
            className="bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper dark:hover:bg-ivory-paper dark:hover:text-soft-black px-4 py-2.5 rounded-lg active:scale-[0.98] transition-all font-mono text-[10px] tracking-widest font-bold shadow-sm"
          >
            Become a Legend
          </Link>
        </nav>
      </div>
    </header>
  )
}
