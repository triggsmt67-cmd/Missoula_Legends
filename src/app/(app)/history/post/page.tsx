import React from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suggest a History Story',
  description: 'Suggest a historical monument, structure, or old story to add to Missoula Legends.',
  alternates: { canonical: '/history/post' },
  robots: { index: false, follow: false }, // Keep this out of search engines
}

export default function SuggestHistoryPage() {
  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
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
            CONTRIBUTE
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Suggest a Story
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-xl mx-auto mt-4">
            Help us document Missoula's local history and favorite old stories to preserve them for everyone.
          </p>
        </div>
      </section>

      {/* Instructions Container */}
      <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
        <div className="bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-[2rem] p-8 sm:p-12 shadow-xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-aged-brass/10 border border-aged-brass/25 rounded-2xl flex items-center justify-center mb-6 text-aged-brass">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-4">
              All Stories are Hand-Picked
            </h2>
            <p className="text-smoked-olive dark:text-ivory-paper/78 leading-relaxed max-w-[45ch]">
              To keep our stories accurate and high quality, Trevor reviews all suggestions before we post them.
            </p>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex gap-4 items-start">
              <span className="font-mono text-aged-brass text-[10px] font-bold tracking-widest w-6 flex-shrink-0 pt-1">01</span>
              <div>
                <span className="text-deep-spruce dark:text-white text-base font-semibold font-serif block mb-1">Gather the Details</span>
                <span className="text-smoked-olive dark:text-ivory-paper/78 text-sm leading-relaxed">Include the name of the location/monument, the approximate year it was built, its physical address, and a brief summary of its historical significance.</span>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="font-mono text-aged-brass text-[10px] font-bold tracking-widest w-6 flex-shrink-0 pt-1">02</span>
              <div>
                <span className="text-deep-spruce dark:text-white text-base font-semibold font-serif block mb-1">Historical Photos (Optional)</span>
                <span className="text-smoked-olive dark:text-ivory-paper/78 text-sm leading-relaxed">If you have archival photography or modern photos you took yourself, attach them. Do not send copyrighted images you do not own.</span>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="font-mono text-aged-brass text-[10px] font-bold tracking-widest w-6 flex-shrink-0 pt-1">03</span>
              <div>
                <span className="text-deep-spruce dark:text-white text-base font-semibold font-serif block mb-1">Send to the Editor</span>
                <span className="text-smoked-olive dark:text-ivory-paper/78 text-sm leading-relaxed">Email your story suggestion directly to us. We will review it, research further if necessary, and write an editorial piece for the registry.</span>
              </div>
            </div>
          </div>

          <a
            href="mailto:history@missoulalegends.com?subject=History%20Story%20Suggestion&body=Hi%20Trevor,%0A%0AI'd%20like%20to%20suggest%20a%20historical%20story%20for%20the%20registry.%0A%0ATitle/Landmark:%20%0AYear/Era:%20%0ALocation/Address:%20%0A%0AStory/Details:%20%0A%0A(Attach%20any%20photos%20you%20have%20to%20this%20email)"
            className="group flex items-center justify-center gap-3 w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper px-8 py-4.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98]"
          >
            Email Your Suggestion
            <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
