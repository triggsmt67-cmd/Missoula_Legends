'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

function BusinessUpdateForm() {
  const searchParams = useSearchParams()
  const businessParam = searchParams.get('business') || ''

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    requestedUpdate: '',
    correction: '',
    removalRequest: false,
    sourceProof: '',
    message: '',
  })

  // Pre-fill business name from URL query parameter
  useEffect(() => {
    if (businessParam) {
      setFormData((prev) => ({ ...prev, businessName: businessParam }))
    }
  }, [businessParam])

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
          formType: 'business-update',
          requesterName: formData.name,
          requesterEmail: formData.email,
          businessName: formData.businessName,
          updateDetails: formData.requestedUpdate + '\\n' + formData.correction,
          ...formData
        }),
      })

      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
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
        Request a Business Update
      </h3>
      <p className="text-[10px] font-mono uppercase tracking-widest text-center text-warm-stone mb-10 pb-6 border-b border-warm-limestone/50 dark:border-warm-limestone/15 max-w-md mx-auto">
        Registry Operations & Verification
      </p>

      {status === 'success' ? (
        <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-aged-brass/40 p-8 rounded-sm text-center animate-fade-in relative z-10 my-8">
          <svg className="w-12 h-12 text-aged-brass mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          <h4 className="font-serif text-xl font-bold text-deep-spruce dark:text-white mb-2">Request Received.</h4>
          <p className="text-sm font-normal text-soft-black dark:text-warm-stone leading-relaxed mb-6 max-w-md mx-auto">
            Thank you for helping us maintain accuracy. We have saved your update request and will verify the details soon. We will follow up if we need further confirmation.
          </p>
          <div className="text-[11px] text-warm-stone/80 text-left border-t border-warm-limestone/40 pt-4 font-mono max-w-xs mx-auto space-y-1">
            <p className="font-bold uppercase tracking-wider text-[9px] mb-1.5">Contact Details</p>
            <p><strong>Trevor Riggs</strong></p>
            <p>trevor@truepath406.com</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm relative z-10">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
              Contact Verification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
              Business Information
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
              <label htmlFor="requestedUpdate" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                Requested Update
              </label>
              <input
                id="requestedUpdate"
                type="text"
                name="requestedUpdate"
                value={formData.requestedUpdate}
                onChange={handleChange}
                placeholder="e.g. Change operating hours / Correct phone number"
                className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="correction" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                Correction Details
              </label>
              <textarea
                id="correction"
                name="correction"
                rows={3}
                value={formData.correction}
                onChange={handleChange}
                placeholder="Please describe the correction or details to change."
                className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40 font-sans"
              />
            </div>

            <div className="flex items-center gap-2.5 py-2">
              <input
                id="removalRequest"
                type="checkbox"
                name="removalRequest"
                checked={formData.removalRequest}
                onChange={handleChange}
                className="w-4 h-4 text-deep-spruce focus:ring-aged-brass border-warm-limestone rounded-sm cursor-pointer accent-aged-brass"
              />
              <label htmlFor="removalRequest" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone cursor-pointer select-none">
                Request listing removal from directory
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="sourceProof" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                Source / Proof of Association (Optional)
              </label>
              <input
                id="sourceProof"
                type="text"
                name="sourceProof"
                value={formData.sourceProof}
                onChange={handleChange}
                placeholder="e.g. Link to official announcement / Business license reference"
                className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Any other comments for the verification team..."
                className="w-full bg-white dark:bg-blue-black/60 border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-4 rounded-sm transition-all duration-300 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow mt-4"
          >
            {status === 'loading' ? 'Submitting Request...' : 'Submit Request'}
          </button>

          {status === 'error' && (
            <p className="text-xs text-oxblood-brown font-mono uppercase tracking-wider text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}
    </div>
  )
}

export default function BusinessUpdatePage() {
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
            DIRECTORY ADMINISTRATION
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-tight">
            Request a Business Update
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-xl mx-auto mt-4">
            Own or manage a business listed on Missoula Legends? Use this form to request an update, correction, credit change, or removal. We review requests to keep the directory accurate and fair.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[800px] mx-auto px-6 sm:px-8 py-12 md:py-20">
        <Suspense fallback={
          <div className="py-20 text-center text-warm-stone">
            <p className="text-lg font-normal mb-2 animate-pulse">Loading update form...</p>
          </div>
        }>
          <BusinessUpdateForm />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
