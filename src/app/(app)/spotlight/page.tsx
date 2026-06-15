'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function SpotlightPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactNameRole: '',
    businessEmailPhone: '',
    website: '',
    highlights: '',
    offer: '',
    consent: false,
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0
      const progressEl = document.getElementById('scroll-progress')
      if (progressEl) progressEl.style.width = `${scrolled}%`
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'spotlight',
          businessName: formData.businessName,
          contactNameRole: formData.contactNameRole,
          businessEmailPhone: formData.businessEmailPhone,
          website: formData.website,
          highlights: formData.highlights,
          offer: formData.offer,
          consent: formData.consent,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-[2px] bg-aged-brass z-50 transition-all duration-75"
        style={{ width: '0%' }}
      />

      {/* Header Navigation */}
      <Header />

      {/* Title Banner Section with Watermarks */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-28 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            THE REGISTRY'S HIGHEST SHELF
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-[1.1]">
            The Local Legends Spotlight
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-6">
            One business. One month. The full treatment.
          </p>
          <p className="text-sm text-smoked-olive/95 dark:text-warm-stone/80 font-normal leading-relaxed max-w-2xl mx-auto mt-4">
            Every month we pick one business from the Missoula Legends registry and put our whole weight behind it — a written feature, a professional marketing kit, and a push to our audience. It costs nothing. It can't be bought. It has to be earned.
          </p>

          {/* Not in the registry yet? Callout Box */}
          <div className="mt-8 bg-[#FAF7F2]/90 dark:bg-slate-900/60 border border-warm-limestone/60 dark:border-warm-limestone/15 p-6 rounded-md max-w-2xl mx-auto text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
            <div className="flex-1">
              <h4 className="font-serif text-base font-bold text-deep-spruce dark:text-white mb-1">
                Not in the registry yet?
              </h4>
              <p className="text-xs text-smoked-olive dark:text-warm-stone/95 leading-relaxed font-normal">
                Spotlights are chosen from businesses already listed — that's where every feature starts. Your listing is free and takes two minutes.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/claim"
                className="inline-flex items-center justify-center bg-deep-spruce hover:bg-oxblood-brown dark:bg-aged-brass dark:hover:bg-aged-brass/90 text-ivory-paper dark:text-soft-black font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-md transition-all active:scale-[0.98] shadow-sm"
              >
                Get Listed Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* Left Column: Editorial Program Details (7/12 width) */}
          <div className="lg:col-span-7 flex flex-col gap-12 text-left">
            
            {/* What is Spotlight? */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                What the Spotlight is
              </h2>
              <p className="text-sm text-smoked-olive dark:text-warm-stone/90 leading-relaxed font-normal">
                A no-cost monthly feature where we:
              </p>
              <ul className="list-disc pl-5 text-sm text-soft-black dark:text-warm-stone/90 space-y-2">
                <li>Tell your story to our audience across the site, email newsletter, and social channels</li>
                <li>Build you a complete, ready-to-use marketing kit — written, designed, and scheduled by us</li>
                <li>Give you assets you keep forever and can reuse anywhere</li>
              </ul>
              <p className="text-sm text-soft-black dark:text-warm-stone/90 leading-relaxed font-normal mt-2">
                One business per month. That's not a marketing gimmick — it's the most we can do at full quality, and full quality is the point.
              </p>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* How It Works */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                How it works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    01 / Selected
                  </span>
                  <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed">
                    Spotlights are chosen from the registry. We look for businesses with a story worth telling and work worth pointing at. You can apply below, or we may simply call you.
                  </p>
                </div>
                
                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    02 / Built
                  </span>
                  <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed">
                    We interview you (10 minutes, phone is fine), write your feature, and design your kit. You approve everything before any of it goes anywhere.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    03 / Launched
                  </span>
                  <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed">
                    Your feature goes live to our audience. You get the kit the same week — use it, save it, or ignore it. It's yours either way.
                  </p>
                </div>
              </div>
              <p className="text-xs text-warm-stone italic font-serif">
                Zero writing, zero design, zero scheduling required on your end.
              </p>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* What You Get */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                What's in the kit
              </h2>
              <ul className="list-disc pl-5 text-sm text-soft-black dark:text-warm-stone/90 space-y-2.5">
                <li><strong>The written feature</strong> — a real story about your business, the way we wrote about The Trough and Big Dipper. Not an ad. The kind of thing customers send to each other.</li>
                <li><strong>Social posts</strong> — square and story formats, captions written, images designed</li>
                <li><strong>Email copy</strong> — drop-in text if you have a newsletter (and nothing wasted if you don't)</li>
                <li><strong>Website blurb</strong> — a clean 75–100 word version for anywhere you need one</li>
                <li><strong>Optional extra</strong> — short interview questions for a quick video if you want one</li>
              </ul>
              <p className="text-sm text-soft-black dark:text-warm-stone/90 leading-relaxed font-normal mt-2">
                Everything is evergreen. Reuse it next year. Print it. Frame the feature if you want — businesses do.
              </p>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* Eligibility & Spotlight Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="flex flex-col gap-3">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  Who we pick
                </h3>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed">
                  We feature locally owned businesses that do right by this town — good work, honest dealings, the kind of place you'd send a friend.
                </p>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed font-normal">
                  Having your own audience to share the feature with is a bonus, not a requirement. <strong>If you don't have an email list or much of a social presence, that doesn't disqualify you — half the businesses we admire most don't.</strong> The registry and this Spotlight exist for exactly those businesses.
                </p>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed italic">
                  If you're not sure you qualify: you probably do. Apply.
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  The schedule
                </h3>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed">
                  One business per month, usually booked 1–3 months out. If you're selected, we confirm your month and deliver your full kit two weeks before launch, so there are no surprises.
                </p>
              </section>
            </div>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* The standard we hold features to */}
            <section className="bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-aged-brass font-bold">
                THE STANDARD
              </span>
              <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                The standard we hold features to
              </h3>
              <p className="text-xs text-warm-stone leading-relaxed font-normal">
                Want to know what a Missoula Legends feature actually reads like? Here's one:
              </p>
              <blockquote className="border-l-2 border-aged-brass pl-4 text-xs text-soft-black dark:text-warm-stone/90 font-serif leading-relaxed italic my-2">
                "The cow is still there. So is the dairy behind it — and the place underneath it still runs like a neighborhood stop, not a destination."
              </blockquote>
              <Link 
                href="/articles/under-the-cow-on-clements-road"
                className="text-xs text-aged-brass hover:text-deep-spruce dark:hover:text-white font-mono tracking-wide flex items-center gap-1.5 transition-colors"
              >
                &rarr; Read the full feature on The Trough
              </Link>
              <p className="text-xs text-warm-stone leading-relaxed font-normal mt-2">
                That's the bar. If we feature your business, that's the care your story gets.
              </p>
              <p className="text-[10px] text-warm-stone/60 leading-relaxed font-normal italic">
                *(NOTE: once the first official Spotlight partner is live, swap this section for that real spotlight — name, photo, links, and a one-line result if you have one.)*
              </p>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* FAQs */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    Is this really free?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    Yes. The Spotlight is how we invest back into the businesses that make this town worth writing about. Nobody can pay to be selected, and selection costs nothing.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    What's expected of my business?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    If you have your own audience — email, social, a corkboard by the register — we'd love you to share the feature during launch week, and we hand you everything ready to post. If you don't have an audience, that's fine. The feature still runs.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    How far in advance are features scheduled?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    Typically 1–3 months out. Apply early if you have a season that matters to you — we'll try to match your month to it.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    Do I have to offer a discount or deal?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    No. An exclusive offer for our readers can boost the launch, but it's entirely optional and never a factor in selection.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    I'm not in the registry yet. Can I still apply?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    Apply for both at once — start with your free listing at{' '}
                    <Link href="/claim" className="text-aged-brass hover:underline font-bold">
                      /claim
                    </Link>{' '}
                    (two minutes), then submit the Spotlight application below. Listings are unlimited and free; the Spotlight is the curated layer on top.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Spotlight Sticky Form (5/12 width) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 w-full">
            <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/55 dark:border-warm-limestone/15 p-8 rounded-sm shadow-md text-left">
              
              <h3 className="font-serif text-2xl font-bold text-deep-spruce dark:text-white mb-1">
                Apply for a Spotlight
              </h3>
              <p className="text-xs text-warm-stone mb-6 font-normal">
                A few questions so we can see the story. If writing isn't your thing, fill in the first three fields and put "call me" in the last one.
              </p>

              {status === 'success' ? (
                <div className="bg-warm-limestone/30 dark:bg-blue-black/40 border border-aged-brass/40 p-6 rounded-md text-deep-spruce dark:text-ivory-paper animate-fade-in text-center">
                  <svg className="w-12 h-12 text-aged-brass mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <h4 className="font-serif text-xl font-bold mb-2">Application Received.</h4>
                  <p className="text-sm font-normal text-soft-black dark:text-warm-stone leading-relaxed mb-6">
                    Thank you. Your application has been logged. We will send your marketing partner kit and confirm your spotlight date shortly.
                  </p>
                  <div className="text-xs text-warm-stone/80 text-left border-t border-warm-limestone/50 pt-4 font-mono space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[9px] mb-1.5">Spotlight Host Info</p>
                    <p><strong>Trevor Riggs</strong></p>
                    <p>trevor@missoulalegends.com</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
                  {/* Business Info Section */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                      Business Details
                    </span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="businessName" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Business Name *
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Legends Roastery"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contactNameRole" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Contact Name & Role *
                      </label>
                      <input
                        id="contactNameRole"
                        type="text"
                        name="contactNameRole"
                        required
                        value={formData.contactNameRole}
                        onChange={handleChange}
                        placeholder="e.g. Trevor Riggs, Founder & Curator"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="businessEmailPhone" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Email or Phone *
                      </label>
                      <input
                        id="businessEmailPhone"
                        type="text"
                        name="businessEmailPhone"
                        required
                        value={formData.businessEmailPhone}
                        onChange={handleChange}
                        placeholder="e.g. trevor@missoulalegends.com or 406-555-0199"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="website" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Website or Social Links (optional)
                      </label>
                      <input
                        id="website"
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="e.g. missoulalegends.com or @legends (optional)"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>
                  </div>

                  {/* Highlights Section */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                      Story Highlights
                    </span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="highlights" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        What makes your business worth featuring? 2–4 bullets *
                      </label>
                      <textarea
                        id="highlights"
                        name="highlights"
                        required
                        rows={4}
                        value={formData.highlights}
                        onChange={handleChange}
                        placeholder="e.g. &#10;- Hand-roasted in small batches in downtown Missoula.&#10;- Sourced from 100% organic, fair-trade family farms.&#10;- Cozy historic storefront on the Hip Strip."
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass font-sans text-xs placeholder:text-warm-stone/40 leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="offer" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Optional: an exclusive offer for our audience
                      </label>
                      <input
                        id="offer"
                        type="text"
                        name="offer"
                        value={formData.offer}
                        onChange={handleChange}
                        placeholder="e.g. Mention Local Legends for 15% off your first bag of coffee."
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="flex flex-col gap-4 py-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 rounded-sm border-warm-limestone text-deep-spruce focus:ring-deep-spruce focus:ring-opacity-20 accent-deep-spruce"
                      />
                      <span className="text-[11px] text-soft-black dark:text-warm-stone/90 leading-tight">
                        I'm OK with Missoula Legends featuring my business and sharing the content we create together on the site, email, and social media. *
                      </span>
                    </label>
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-4 rounded-sm transition-all duration-300 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                  >
                    {status === 'loading' ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                  
                  <p className="text-[11px] text-warm-stone/80 text-center leading-relaxed font-normal italic">
                    Trevor reads every application himself. You'll hear back either way — usually within a week.
                  </p>

                  {status === 'error' && (
                    <p className="text-xs text-oxblood-brown font-mono uppercase tracking-wider text-center">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
          
        </div>
      </main>

      {/* About Section (Missoula Legends) */}
      <section className="bg-gradient-to-br from-[#faf8f4] to-[#EBE5D8] dark:from-slate-900/60 dark:to-slate-950/40 border-t border-warm-limestone/40 dark:border-warm-limestone/10 py-16 md:py-24 text-left">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold">
                Program Sponsor
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-deep-spruce dark:text-white leading-tight font-normal">
                About Missoula Legends
              </h2>
              <p className="text-soft-black dark:text-warm-stone text-sm leading-relaxed max-w-[65ch] font-normal">
                Missoula Legends is an independent community registry highlighting the local makers, tradespeople, cultural cornerstones, and historic neighborhoods that define our town. Listings in the registry are always free — the Spotlight is the curated feature we build on top of them.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 mt-4 font-mono text-xs text-warm-stone">
                <div>
                  <span className="text-aged-brass font-bold block mb-1">CONTACT HOST</span>
                  <p className="text-soft-black dark:text-ivory-paper font-bold">Trevor Riggs</p>
                  <p>trevor@missoulalegends.com</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 border border-warm-limestone/60 dark:border-warm-limestone/15 p-6 bg-white dark:bg-blue-black rounded-md">
              <h3 className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold mb-3">
                Compliance & Permissions
              </h3>
              <p className="text-[11px] text-warm-stone leading-relaxed font-normal">
                By submitting your materials, you confirm you have rights to logos/images and grant Missoula Legends permission to publish and repurpose the content in our promotional channels. We will always credit your business and link back to your website/socials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
