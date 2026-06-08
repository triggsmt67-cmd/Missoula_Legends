import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

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
            LEGAL REGISTRY
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
