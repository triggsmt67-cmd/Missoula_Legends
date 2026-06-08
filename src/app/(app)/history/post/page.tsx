'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { submitHistoryStory } from './actions'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function PostHistoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    location: '',
    excerpt: '',
    content: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.excerpt || !formData.content) {
      setErrorMessage('Please fill out the Title, Excerpt, and Story Content.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await submitHistoryStory(formData)
      if (res.success) {
        setStatus('success')
        setFormData({
          title: '',
          year: '',
          location: '',
          excerpt: '',
          content: '',
        })
        setTimeout(() => {
          router.push('/history')
        }, 2000)
      } else {
        setErrorMessage(res.error || 'Failed to submit history story.')
        setStatus('error')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during submission.')
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
            CONTRIBUTE
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Post a Story from History
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-xl mx-auto mt-4">
            Document Missoula's local historic monuments, structures, and legacy tales to preserve them in our public registry.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-left">
        {status === 'success' ? (
          <div className="bg-[#EBE5D8] dark:bg-blue-black/30 border border-warm-limestone dark:border-warm-limestone/15 rounded-[2rem] p-10 text-center shadow-lg animate-fade-in">
            <div className="w-16 h-16 bg-aged-brass/10 border border-aged-brass/25 rounded-full flex items-center justify-center mx-auto mb-6 text-aged-brass">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-4">
              Story Submitted Successfully
            </h2>
            <p className="text-sm sm:text-base text-smoked-olive dark:text-warm-stone leading-relaxed max-w-[45ch] mx-auto">
              Your historical story has been posted and saved directly into the registry. Redirecting you to the history archives...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

            {/* Field 1: Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Wilma Theatre: Missoula's Palace of Cinema"
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                required
              />
            </div>

            {/* Row 2: Era and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="year" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Era / Year Built
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 1921 or Late 1800s"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="location" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. 131 S Higgins Ave, Missoula"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                />
              </div>
            </div>

            {/* Field 3: Excerpt */}
            <div className="flex flex-col gap-2">
              <label htmlFor="excerpt" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                Brief Excerpt * (Short Summary)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Write a brief 1-2 sentence description shown in lists and sidebars..."
                rows={2}
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors resize-none"
                required
              />
            </div>

            {/* Field 4: Full Content */}
            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                Story Content * (Paragraphs)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the full historic account here..."
                rows={8}
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                required
              />
            </div>

            {/* Note on default image */}
            <div className="text-[11px] font-mono text-warm-stone/80">
              * Note: Submitting this form will automatically link a default historical image (The Wilma Theatre) to the story. You can upload customized images directly through the Payload admin panel at <code className="bg-warm-limestone/40 dark:bg-slate-800 px-1 py-0.5 rounded">/admin/collections/history</code>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper px-8 py-4.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98] w-full sm:w-fit disabled:opacity-50"
            >
              {status === 'loading' ? 'Publishing Story...' : 'Publish Story to Registry'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
