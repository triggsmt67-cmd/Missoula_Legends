import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Use Policy | Missoula Legends',
  description: 'Read about our photo licensing, content sharing, and reproduction permissions on Missoula Legends.',
  alternates: { canonical: '/content-use' },
}

export default function ContentUsePolicyPage() {
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
            POLICIES
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Content Use Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            At Missoula Legends, we produce and curate high-fidelity original editorial content, photos, blueprints, and local guides. This Content Use Policy outlines standard guidelines for sharing our materials.
          </p>
          
          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">1. Non-Commercial Sharing</h3>
          <p>
            You are welcome to share snippets or excerpts of our articles, maps, or local reviews on social media or personal blogs, provided you include a clear link back to the original source on <code className="bg-warm-limestone/40 dark:bg-slate-800 px-1 py-0.5 rounded">missoulalegends.com</code>.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">2. Commercial Use & Reprints</h3>
          <p>
            Using our text, custom-designed historical blueprints, or photography for commercial purposes, prints, merchandise, or advertisement placement is strictly prohibited without written consent and a licensing agreement from the site curators.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">3. Attribution Guidelines</h3>
          <p>
            Proper attribution requires citing **Missoula Legends** as the creator, followed by the specific author/curator name (e.g., *Trevor Riggs*) and the hyperlink.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">4. Use of Public Business Information</h3>
          <p>
            Missoula Legends may publish basic business information gathered from publicly available sources, including business websites, public profiles, directories, social platforms, and owner-submitted updates.
          </p>
          <p>
            This may include business name, address, phone number, website, category, general services, and publicly available social links.
          </p>
          <p>
            We do not claim ownership of listed business names, trademarks, logos, or third-party materials. Business names and marks are used only to identify the businesses being listed or discussed.
          </p>
          <p>
            If you own or manage a listed business and would like information corrected, credited differently, or removed, contact us using our{' '}
            <Link href="/business-update" className="underline hover:text-aged-brass transition-colors">
              update form
            </Link>{' '}
            and we will review the request.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">5. Photos, Logos, and Creative Materials</h3>
          <p>
            Missoula Legends should only publish photos, logos, descriptions, and other creative materials when they are:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-soft-black dark:text-warm-stone">
            <li>Created by our team</li>
            <li>Submitted by the business owner or authorized representative</li>
            <li>Licensed for use</li>
            <li>Used with permission</li>
            <li>Clearly allowed by the source or platform terms</li>
          </ul>
          <p className="mt-4">
            Do not copy business website text word-for-word. Directory descriptions should be written in our own words.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
