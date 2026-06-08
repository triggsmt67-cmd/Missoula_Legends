'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function SpotlightPage() {
  // Form state initialized as empty, values moved to placeholders (watermarks)
  const [formData, setFormData] = useState({
    businessName: '',
    contactNameRole: '',
    businessEmailPhone: '',
    website: '',
    socialHandles: '',
    highlights: '',
    offer: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
    consent: false,
    smsConsent: false,
  })

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

    // Simulate database submission with a realistic delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
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

      {/* Title Banner Section with Watermarks */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-28 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            COMMUNITY SHOWCASE
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-[1.1]">
            Local Legends Spotlight
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-6">
            Celebrating our community, one business at a time.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* Left Column: Editorial Program Details (7/12 width) */}
          <div className="lg:col-span-7 flex flex-col gap-12 text-left">
            
            {/* Intro Paragraph */}
            <div>
              <p className="text-lg md:text-xl text-soft-black dark:text-warm-stone font-serif leading-relaxed mb-6 italic border-l-2 border-aged-brass pl-6">
                Each month, we feature a standout local business to our audience—and give that partner a turnkey marketing kit to share with theirs. It’s free, simple, and built to grow awareness and customers for everyone involved.
              </p>
            </div>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* What is Spotlight? */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                What is Local Legends Spotlight?
              </h2>
              <p className="text-sm text-smoked-olive dark:text-warm-stone/90 leading-relaxed font-normal">
                A no-cost, monthly cross-promotion where we:
              </p>
              <ul className="list-disc pl-5 text-sm text-soft-black dark:text-warm-stone/90 space-y-2">
                <li>Feature one local business across our email newsletter and social channels</li>
                <li>Create and deliver a ready-to-use marketing kit for the partner to share on their channels</li>
                <li>Drive organic exposure and conversions for both brands—without extra work</li>
              </ul>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* How It Works */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">
                How It Works (Simple & Seamless)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    01 / Apply
                  </span>
                  <h4 className="font-serif text-base font-bold text-deep-spruce dark:text-white mb-2">
                    2 Minutes
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed">
                    Submit the short form with your business highlights and details.
                  </p>
                </div>
                
                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    02 / Design
                  </span>
                  <h4 className="font-serif text-base font-bold text-deep-spruce dark:text-white mb-2">
                    We Create Everything
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed">
                    Our team writes your feature, designs social/email assets, and sets your launch date.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/45 p-6 rounded-md shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold block mb-2">
                    03 / Launch
                  </span>
                  <h4 className="font-serif text-base font-bold text-deep-spruce dark:text-white mb-2">
                    Go Live Together
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed">
                    We publish your feature to our audience and send you the ready-to-post kit for yours.
                  </p>
                </div>
              </div>
              <p className="text-xs text-warm-stone italic font-serif">
                That’s it—zero design or copywriting required on your end.
              </p>
            </section>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* Why Join & What You Get */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="flex flex-col gap-4">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  Why Join?
                </h3>
                <ul className="list-disc pl-5 text-xs text-soft-black dark:text-warm-stone/90 space-y-2.5">
                  <li><strong>$0 Cost</strong> — professional promotion at no charge</li>
                  <li><strong>Turnkey</strong> — we handle the strategy, copy, and design</li>
                  <li><strong>Audience Growth</strong> — reach our community while engaging yours</li>
                  <li><strong>Credibility & Trust</strong> — featured by a respected, service-driven brand</li>
                  <li><strong>Evergreen Assets</strong> — reuse your graphics and copy anytime</li>
                </ul>
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  What You Get (Your Partner Kit)
                </h3>
                <ul className="list-disc pl-5 text-xs text-soft-black dark:text-warm-stone/90 space-y-2.5">
                  <li><strong>Email Feature Copy</strong> — drop-in text for your newsletter</li>
                  <li><strong>Social Media Posts</strong> — square + story captions and images</li>
                  <li><strong>Story Graphics</strong> — IG/FB stories, Reels cover</li>
                  <li><strong>Website Blurb</strong> — clean, polished blurb (~75–100 words)</li>
                  <li><strong>Optional Extra</strong> — 30–60s interview questions for a quick Reel</li>
                </ul>
              </section>
            </div>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* Eligibility & Spotlight Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="flex flex-col gap-3">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  Eligibility
                </h3>
                <p className="text-xs text-warm-stone leading-relaxed mb-2 font-normal">
                  We prioritize locally owned or locally managed businesses that:
                </p>
                <ul className="list-disc pl-5 text-xs text-soft-black dark:text-warm-stone/90 space-y-1.5">
                  <li>Serve our community with integrity and great experience</li>
                  <li>Provide clear benefits or value to local families</li>
                  <li>Can share the collaboration on their email and social channels</li>
                </ul>
                <p className="text-xs text-warm-stone italic mt-2">
                  (If you’re not sure you qualify, apply anyway—we’re friendly!)
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                  Spotlight Schedule
                </h3>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed font-normal">
                  We feature one business per month to keep the series curated and special. 
                </p>
                <p className="text-xs text-soft-black dark:text-warm-stone/90 leading-relaxed font-normal">
                  If selected, we will confirm your month and deliver your turnkey partner kit 2 weeks before the go-live date.
                </p>
              </section>
            </div>

            <hr className="border-warm-limestone/40 dark:border-warm-limestone/15" />

            {/* Example Feature Card */}
            <section className="bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-aged-brass font-bold">
                EXAMPLE SPOTLIGHT
              </span>
              <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
                Local Legends Spotlight: [Business Name]
              </h3>
              <p className="text-xs text-soft-black dark:text-warm-stone/90 font-serif leading-relaxed italic">
                "[Business Name] is our go-to for coffee and curated items in the Slant Streets. We love them for their exceptional organic blends, their local artist display, and their support for local public radio."
              </p>
              <div className="border-t border-warm-limestone/40 dark:border-warm-limestone/15 pt-4 text-xs font-mono tracking-wide text-warm-stone space-y-1">
                <p>📍 Slant Streets, Missoula, MT</p>
                <p>🌐 www.businessname.com</p>
                <p>📱 @InstagramHandle</p>
              </div>
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
                    Yes. This is our way of investing back into the community we serve.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    What’s expected of my business?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    Share your feature to your audience during the same week we go live (we’ll give you everything to copy-paste).
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    How far in advance are features scheduled?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    Typically 1–3 months out. Submit early to secure your preferred month.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-deep-spruce dark:text-white mb-1">
                    Do I have to offer a discount?
                  </h4>
                  <p className="text-xs text-warm-stone/90 leading-relaxed font-normal">
                    No, but an exclusive perk can boost engagement.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Spotlight Sticky Form (5/12 width) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 w-full">
            <div className="bg-[#FAF7F2] dark:bg-blue-black/40 border border-warm-limestone/55 dark:border-warm-limestone/15 p-8 rounded-sm shadow-md text-left">
              
              <h3 className="font-serif text-2xl font-bold text-deep-spruce dark:text-white mb-1">
                Apply to Be Featured
              </h3>
              <p className="text-xs text-warm-stone mb-6 font-mono uppercase tracking-wider">
                Partner Registration
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
                    <p>trevor@truepath406.com</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
                  {/* Business Info Section */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                      Business Info
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
                        Business Email & Phone *
                      </label>
                      <input
                        id="businessEmailPhone"
                        type="text"
                        name="businessEmailPhone"
                        required
                        value={formData.businessEmailPhone}
                        onChange={handleChange}
                        placeholder="e.g. trevor@missoulalegends.com / 406-555-0199"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="website" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Website *
                      </label>
                      <input
                        id="website"
                        type="url"
                        name="website"
                        required
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="e.g. https://missoulalegends.com"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="socialHandles" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Social Handles *
                      </label>
                      <input
                        id="socialHandles"
                        type="text"
                        name="socialHandles"
                        required
                        value={formData.socialHandles}
                        onChange={handleChange}
                        placeholder="e.g. @legends_roastery (Instagram)"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>
                  </div>

                  {/* Highlights Section */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                      Spotlight Highlights
                    </span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="highlights" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        2–4 bullet points that make you unique *
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
                        Optional: Time-bound offer for our audience
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

                  {/* Contact Info (Prefilled with Trevor Riggs info) */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] text-aged-brass uppercase tracking-widest font-bold border-b border-warm-limestone/30 pb-1">
                      Applicant Contact Info
                    </span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="firstName" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="e.g. Trevor"
                          className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="lastName" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="e.g. Riggs"
                          className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. trevor@missoulalegends.com"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Home Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 406-555-0199"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="comments" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone">
                        Comments *
                      </label>
                      <textarea
                        id="comments"
                        name="comments"
                        required
                        rows={3}
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="e.g. Celebrating our community, one business at a time. Missoula, Montana"
                        className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-sm px-4 py-2.5 text-soft-black dark:text-ivory-paper focus:outline-none focus:border-aged-brass placeholder:text-warm-stone/40"
                      />
                    </div>
                  </div>

                  {/* Consents & Checklist */}
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
                        I agree to be featured by Missoula Legends and allow submitted content to be shared across email and social media. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="smsConsent"
                        checked={formData.smsConsent}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 rounded-sm border-warm-limestone text-deep-spruce focus:ring-deep-spruce focus:ring-opacity-20 accent-deep-spruce"
                      />
                      <span className="text-[10px] text-warm-stone leading-tight">
                        By clicking "Submit", I consent to receive SMS messages from Missoula Legends. Message and data rates may apply. Reply STOP to opt-out, HELP for help. SMS Policy: We will not share your opt-in details with third parties. *
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
                Missoula Legends is an independent community registry dedicated to highlighting the local makers, cultural cornerstones, and historic neighborhoods that define our town. We believe in supporting local business through collaboration and storytelling.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 mt-4 font-mono text-xs text-warm-stone">
                <div>
                  <span className="text-aged-brass font-bold block mb-1">CONTACT HOST</span>
                  <p className="text-soft-black dark:text-ivory-paper font-bold">Trevor Riggs</p>
                  <p>trevor@truepath406.com</p>
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
