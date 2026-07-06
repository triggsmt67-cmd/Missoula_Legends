'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileStoriesOpen, setIsMobileStoriesOpen] = useState(false)
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-40 bg-ivory-paper/95 dark:bg-soft-black/95 backdrop-blur-md border-b border-warm-limestone/40 dark:border-warm-limestone/10">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center z-50 focus:outline-none"
        >
          {/* Light Mode Logo */}
          <img 
            src="/logo.png" 
            alt="Missoula Legends" 
            className="h-10 sm:h-12 w-auto object-contain dark:hidden transition-all duration-300"
          />
          {/* Dark Mode Logo */}
          <img 
            src="/logo-dark.png" 
            alt="Missoula Legends" 
            className="h-10 sm:h-12 w-auto object-contain hidden dark:block transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-[10px] font-mono uppercase tracking-widest font-bold">
          <Link href="/" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Home
          </Link>
          <Link href="/directory" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Directory
          </Link>
          
          {/* Stories Dropdown */}
          <div className="relative group py-2">
            <button className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors flex items-center gap-1 cursor-pointer font-mono text-[10px] uppercase tracking-widest font-bold focus:outline-none">
              Stories
              <svg className="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-350" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-warm-limestone/50 dark:border-white/10 rounded-xl shadow-xl py-2.5 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 text-left">
              <Link 
                href="/stories"
                className="block px-4 py-2 text-[10px] tracking-wider text-warm-stone hover:text-deep-spruce dark:hover:text-white hover:bg-warm-limestone/20 dark:hover:bg-white/5 transition-colors"
              >
                All Stories
              </Link>
              <Link 
                href="/spotlight"
                className="block px-4 py-2 text-[10px] tracking-wider text-warm-stone hover:text-deep-spruce dark:hover:text-white hover:bg-warm-limestone/20 dark:hover:bg-white/5 transition-colors border-t border-warm-limestone/30 dark:border-warm-limestone/10"
              >
                Local Spotlight
              </Link>
            </div>
          </div>

          {/* History Dropdown */}
          <div className="relative group py-2">
            <button className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors flex items-center gap-1 cursor-pointer font-mono text-[10px] uppercase tracking-widest font-bold focus:outline-none">
              History
              <svg className="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-350" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-warm-limestone/50 dark:border-white/10 rounded-xl shadow-xl py-2.5 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 text-left">
              <Link 
                href="/history/stories"
                className="block px-4 py-2 text-[10px] tracking-wider text-warm-stone hover:text-deep-spruce dark:hover:text-white hover:bg-warm-limestone/20 dark:hover:bg-white/5 transition-colors"
              >
                Historical Vault
              </Link>
              <Link 
                href="/history/post"
                className="block px-4 py-2 text-[10px] tracking-wider text-warm-stone hover:text-deep-spruce dark:hover:text-white hover:bg-warm-limestone/20 dark:hover:bg-white/5 transition-colors border-t border-warm-limestone/30 dark:border-warm-limestone/10"
              >
                Suggest a Story
              </Link>
            </div>
          </div>

          <Link href="/gallery" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Gallery
          </Link>
          <Link href="/mission" className="text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors hover-draw-underline">
            Mission
          </Link>
          <Link
            href="/claim"
            className="group inline-flex items-center gap-1.5 bg-transparent text-aged-brass hover:text-soft-black px-4 py-2.5 rounded-lg hover:bg-aged-brass border border-aged-brass/30 hover:border-aged-brass font-mono text-[10px] tracking-widest font-bold transition-all duration-500 shadow-sm hover:shadow-[0_0_15px_rgba(204,166,119,0.2)] active:scale-[0.98] whitespace-nowrap"
          >
            Get Listed Free
            <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
          </Link>
        </nav>

        {/* Mobile menu toggle & button */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden z-50">
          <Link
            href="/claim"
            onClick={() => setIsOpen(false)}
            className="hidden sm:inline-flex bg-transparent text-aged-brass hover:text-soft-black px-3 py-2 rounded-md hover:bg-aged-brass border border-aged-brass/30 font-mono text-[9px] tracking-wider font-bold transition-all duration-500 shadow-sm active:scale-[0.97] whitespace-nowrap"
          >
            Get Listed Free
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

      {/* Mobile Drawer (Escapes containing blocks using React Portal) */}
      {mounted && createPortal(
        <div
          className={`fixed top-20 left-0 right-0 bottom-0 bg-[#F3EFE6] dark:bg-[#101411] z-[60] overflow-y-auto transition-all duration-300 ease-out lg:hidden ${
            isOpen ? 'translate-x-0 opacity-100 pointer-events-auto visible' : 'translate-x-full opacity-0 pointer-events-none invisible'
          }`}
        >
          <nav className="flex flex-col items-start gap-8 p-8 text-xl font-serif tracking-tight text-deep-spruce dark:text-ivory-paper font-semibold">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
              Home
            </Link>
            <Link href="/directory" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
              Directory
            </Link>
            
            {/* Mobile Stories Dropdown */}
            <div className="w-full text-left">
              <button 
                onClick={() => setIsMobileStoriesOpen(!isMobileStoriesOpen)}
                className="flex items-center justify-between w-full hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif text-xl font-semibold text-left focus:outline-none"
              >
                <span>Stories</span>
                <svg className={`w-5 h-5 transform transition-transform duration-300 ${isMobileStoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`mt-4 pl-4 flex flex-col gap-4 border-l border-warm-limestone/50 dark:border-warm-limestone/15 transition-all duration-300 overflow-hidden ${isMobileStoriesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <Link href="/stories" onClick={() => setIsOpen(false)} className="text-base text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif font-normal">
                  All Stories
                </Link>
                <Link href="/spotlight" onClick={() => setIsOpen(false)} className="text-base text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif font-normal">
                  Local Spotlight
                </Link>
              </div>
            </div>

            {/* Mobile History Dropdown */}
            <div className="w-full text-left">
              <button 
                onClick={() => setIsMobileHistoryOpen(!isMobileHistoryOpen)}
                className="flex items-center justify-between w-full hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif text-xl font-semibold text-left focus:outline-none"
              >
                <span>History</span>
                <svg className={`w-5 h-5 transform transition-transform duration-300 ${isMobileHistoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`mt-4 pl-4 flex flex-col gap-4 border-l border-warm-limestone/50 dark:border-warm-limestone/15 transition-all duration-300 overflow-hidden ${isMobileHistoryOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <Link href="/history/stories" onClick={() => setIsOpen(false)} className="text-base text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif font-normal">
                  Historical Vault
                </Link>
                <Link href="/history/post" onClick={() => setIsOpen(false)} className="text-base text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors font-serif font-normal">
                  Suggest a Story
                </Link>
              </div>
            </div>

            <Link href="/gallery" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
              Gallery
            </Link>
            <Link href="/mission" onClick={() => setIsOpen(false)} className="hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
              Mission
            </Link>
            <Link
              href="/claim"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-aged-brass hover:bg-aged-brass/90 text-soft-black py-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-all mt-4"
            >
              Get Listed Free
            </Link>
          </nav>
        </div>,
        document.body
      )}
    </header>
  )
}
