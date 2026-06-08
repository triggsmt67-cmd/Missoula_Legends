import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24 text-left">
        <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed">
          <p className="text-xs font-mono uppercase tracking-wider text-warm-stone mb-8">Last Updated: June 2026</p>
          <p>
            At Missoula Legends, we value your trust and are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and protect your information when you interact with our platform, directory, and editorial newsletters.
          </p>
          
          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">1. Information We Collect</h3>
          <p>
            We collect information you voluntarily provide to us, such as your email address when signing up for our newsletter or business details when submitting your registry application for local business features.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">2. How We Use Your Information</h3>
          <p>
            Your details are used strictly to curate the Missoula Legends local directory, deliver newsletter editions, communicate about submissions, and ensure quality control. We do not sell or lease your personal data.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">3. Cookies & Tracking</h3>
          <p>
            We use basic cookies to enhance user experience, save preference selections (such as light/dark mode settings), and gather anonymous analytics about visitor traffic patterns.
          </p>

          <h3 className="font-serif text-2xl text-deep-spruce dark:text-white mt-10 mb-4">4. Third-Party Integrations</h3>
          <p>
            Our website links to external sites (such as local business websites or reservation links). We are not responsible for the privacy practices of external platforms, and we encourage you to read their respective policy agreements.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
