'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function NominatePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    website: '',
    nominatorName: '',
    nominatorEmail: '',
    reason: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'nominate', ...formData }),
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', () => {
              const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
              const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
              const progressEl = document.getElementById('scroll-progress');
              if (progressEl) progressEl.style.width = scrolled + '%';
            });
          `
        }}
      />

      {/* Header Navigation */}
      <Header />

      {/* Hero Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-16 md:py-24 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            COMMUNITY SELECTION BOARD
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-tight">
            Nominate a Legend
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-xl mx-auto mt-4">
            Help us identify and preserve the stories of Missoula's defining independent businesses and pioneers.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[800px] mx-auto px-6 sm:px-8 py-12 md:py-20">
        
        {/* Process Card: How We Work */}
        <div className="bg-[#FAF7F2] dark:bg-[#1C2321]/45 border border-warm-limestone/55 dark:border-warm-limestone/15 p-8 rounded-sm mb-12 shadow-sm text-left">
          <h2 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-4">
            The Selection Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold">
                01 / Nominate
              </span>
              <p className="text-xs text-soft-black dark:text-warm-stone/95 leading-relaxed font-normal">
                Submit the business credentials below. No long essay required.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-warm-limestone/55 dark:border-warm-limestone/15 pt-4 md:pt-0 md:pl-6">
              <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold">
                02 / Review
              </span>
              <p className="text-xs text-soft-black dark:text-warm-stone/95 leading-relaxed font-normal">
                Our board vets the nominee's local impact, history, and community presence.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-warm-limestone/55 dark:border-warm-limestone/15 pt-4 md:pt-0 md:pl-6">
              <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold">
                03 / Directory
              </span>
              <p className="text-xs text-soft-black dark:text-warm-stone/95 leading-relaxed font-normal">
                Selected legends are listed in our directory and featured in our spotlight.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container with Prestigious Borders */}
        <div className="relative bg-[#FCFAF6] dark:bg-[#1A201E]/80 border-2 border-aged-brass/35 dark:border-aged-brass/25 p-8 sm:p-12 rounded-sm shadow-md text-left">
          
          {/* Certificate Inner Frame Border */}
          <div className="absolute inset-2 border border-aged-brass/15 dark:border-aged-brass/10 pointer-events-none" />

          {/* Registry Seal Graphic */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-aged-brass/45 flex items-center justify-center font-serif text-sm font-bold text-aged-brass bg-ivory-paper dark:bg-slate-900 shadow-sm">
              ML
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-center text-deep-spruce dark:text-white tracking-tight leading-snug mb-2">
            Local Nomination Form
          </h3>
          <p className="text-[10px] font-mono uppercase tracking-widest text-center text-warm-stone mb-10 pb-6 border-b border-warm-limestone/50 dark:border-warm-limestone/15 max-w-md mx-auto">
            Missoula Legends Selection Board
          </p>

          {status === 'success' ? (
            <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-aged-brass/40 p-8 rounded-sm text-center animate-fade-in relative z-10 my-8">
              <svg className="w-12 h-12 text-aged-brass mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              <h4 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-2">Nomination Received.</h4>
              <p className="text-sm font-normal text-soft-black dark:text-warm-stone leading-relaxed mb-6 max-w-md mx-auto">
                Thank you for honoring this local business. We have saved your nomination and will review it soon. We will contact you or the business owner if we need any more details.
              </p>
              <div className="text-[11px] text-warm-stone/80 text-left border-t border-warm-limestone/40 pt-4 font-mono max-w-xs mx-auto space-y-1">
                <p className="font-bold uppercase tracking-wider text-[9px] mb-1.5">Contact Details</p>
                <p><strong>Trevor Riggs</strong></p>
                <p>trevor@truepath406.com</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm relative z-10">
              
              {/* Nominee Details */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                  Nominee Credentials
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
                    placeholder="e.g. Rockin' Rudy's"
                    className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                    Business Address / Neighborhood *
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 237 Blaine St, Hip Strip"
                    className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="website" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                    Website or Social Link
                  </label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://www.rockinrudys.com"
                    className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                  />
                </div>
              </div>

              {/* Optional Nominator Details */}
              <div className="flex flex-col gap-4 mt-2">
                <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                  Nominator (Optional)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nominatorName" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                      Your Name
                    </label>
                    <input
                      id="nominatorName"
                      type="text"
                      name="nominatorName"
                      value={formData.nominatorName}
                      onChange={handleChange}
                      placeholder="e.g. Jane Miller"
                      className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nominatorEmail" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                      Your Email
                    </label>
                    <input
                      id="nominatorEmail"
                      type="email"
                      name="nominatorEmail"
                      value={formData.nominatorEmail}
                      onChange={handleChange}
                      placeholder="e.g. jane@example.com"
                      className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reason" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                    Why does this business deserve to be a Legend?
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="e.g. Rockin' Rudy's has been a welcoming community hub and record store for over 40 years, employing dozens of locals and keeping Missoula's unique culture alive."
                    className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40 font-sans"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-4 rounded-sm transition-all duration-300 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow mt-4"
              >
                {status === 'loading' ? 'Logging Nomination...' : 'Submit Nomination to Board'}
              </button>

              {status === 'error' && (
                <p className="text-xs text-oxblood-brown font-mono uppercase tracking-wider text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
