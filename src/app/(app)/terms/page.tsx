import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Missoula Legends',
  description: 'Read the terms of service and rules for using the Missoula Legends website and directories.',
  alternates: { canonical: '/terms' },
}

export default function TermsPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Header Navigation */}
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
            POLICIES
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Terms Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            Welcome to Missoula Legends. By accessing this website and our published local guides, you agree to comply with and be bound by the following Terms Policy.
          </p>
          
          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">1. Use of Site Content</h3>
          <p>
            All content published on Missoula Legends—including text, layout designs, and curated registry metadata—is protected by copyright. You may view and print articles for personal use, but reproduction or distribution without explicit permission is strictly prohibited.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">2. Business Submissions</h3>
          <p>
            When applying to be featured in the Local Legends Spotlight or submitting registry updates, you warrant that all provided information is accurate, truthful, and owned by your business. We reserve the right to edit, decline, or remove any registry submissions at our sole discretion.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">3. Disclaimers</h3>
          <p>
            The content provided on Missoula Legends is for informational and educational purposes. While we strive to personally verify listing hours, details, and heritage facts, we make no guarantees about absolute accuracy or availability of external services.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">4. Governing Law</h3>
          <p>
            These terms are governed by the laws of the State of Montana. Any disputes arising from or relating to your use of this site will be handled in local jurisdiction.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
