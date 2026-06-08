'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-ivory-paper/95 dark:bg-soft-black/95 backdrop-blur-md border-b border-warm-limestone/40 dark:border-warm-limestone/10">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="font-serif text-base sm:text-xl tracking-tight text-deep-spruce dark:text-ivory-paper font-bold hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors z-50"
        >
          MISSOULA <span className="font-mono text-warm-stone font-normal tracking-[0.2em] text-[9px] sm:text-xs ml-1">LEGENDS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono uppercase tracking-widest font-bold">
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

        {/* Mobile menu toggle & button */}
        <div className="flex items-center gap-2 sm:gap-3 md:hidden z-50">
          <Link
            href="/spotlight"
            onClick={() => setIsOpen(false)}
            className="bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper px-3 py-2 rounded-md font-mono text-[9px] tracking-wider font-bold transition-all shadow-sm active:scale-[0.97]"
          >
            Become a Legend
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="text-deep-spruce dark:text-ivory-paper p-1 focus:outline-none flex items-center justify-center cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-20 bg-ivory-paper/98 dark:bg-soft-black/98 backdrop-blur-lg z-35 transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-start gap-8 p-8 text-xl font-serif tracking-tight text-deep-spruce dark:text-ivory-paper font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
            Home
          </Link>
          <Link href="/archives" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
            Archives
          </Link>
          <Link href="/history/archives" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
            History
          </Link>
          <Link href="/directory" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
            Directory
          </Link>
        </nav>
      </div>
    </header>
  )
}
