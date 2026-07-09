'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitIntakeForm, getDirectoryListings, deleteBusiness } from './actions'
import { Header } from '@/components/Header'

export default function IntakeFormPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    neighborhood: '',
    description: '',
    phone: '',
    website: '',
    instagram: '',
    address: '',
    honeypot: '',
  })

  const [quickFacts, setQuickFacts] = useState<string[]>([])
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([])

  const [intakeSecret, setIntakeSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [listings, setListings] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIntakeSecret(localStorage.getItem('intakeSecret') || '')
    }
  }, [])

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setIntakeSecret(val)
    localStorage.setItem('intakeSecret', val)
  }

  const fetchListings = async (secret: string) => {
    if (!secret) return
    setLoadingListings(true)
    const res = await getDirectoryListings(secret)
    if (res.success && res.listings) {
      setListings(res.listings)
    }
    setLoadingListings(false)
  }

  useEffect(() => {
    if (intakeSecret) {
      fetchListings(intakeSecret)
    }
  }, [intakeSecret])

  const handleDelete = async (id: string | number, name: string) => {
    if (!intakeSecret) {
      alert('Please enter the access secret first.')
      return
    }

    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return
    }

    try {
      const res = await deleteBusiness(String(id), intakeSecret)
      if (res.success) {
        fetchListings(intakeSecret)
      } else {
        alert(res.error || 'Failed to delete business.')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.businessName || !formData.category || !formData.neighborhood || !formData.address) {
      setErrorMessage('Please fill out all required fields (*).')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const { honeypot, ...payloadData } = formData
      const res = await submitIntakeForm(payloadData, quickFacts, faqs, intakeSecret)
      if (res.success) {
        setStatus('success')
        
        // Also send an email notification
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formType: 'intake', ...formData }),
          })
        } catch (e) {
          console.error('Failed to send email notification', e)
        }

        setFormData({
          businessName: '',
          category: '',
          neighborhood: '',
          description: '',
          phone: '',
          website: '',
          instagram: '',
          address: '',
          honeypot: '',
        })
        setQuickFacts([])
        setFaqs([])
        fetchListings(intakeSecret)
        setTimeout(() => {
          setStatus('idle')
        }, 4000)
      } else {
        setErrorMessage(res.error || 'Failed to submit intake form.')
        setStatus('error')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during submission.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      <Header />

      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-12">
        <div className="relative z-10 max-w-[720px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] uppercase font-bold mb-3 block w-fit bg-warm-limestone/40 dark:bg-slate-900/40 px-3 py-1 rounded-full">
            CURATOR TOOLS
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif">
            New Business Intake
          </h1>
          <p className="text-sm text-smoked-olive dark:text-ivory-paper/78 mt-2">
            Add a local business to the Missoula Legends Directory. This form publishes directly to the live registry.
          </p>
        </div>
      </section>

      <section className="max-w-[720px] mx-auto px-6 py-12 md:py-16 text-left">
        {status === 'success' ? (
          <div className="bg-[#EBE5D8] dark:bg-blue-black/30 border border-warm-limestone dark:border-warm-limestone/15 rounded-[2rem] p-10 text-center shadow-lg animate-fade-in">
            <div className="w-16 h-16 bg-aged-brass/10 border border-aged-brass/25 rounded-full flex items-center justify-center mx-auto mb-6 text-aged-brass">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-4">
              Business Added to Registry!
            </h2>
            <p className="text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/78 leading-relaxed max-w-[45ch] mx-auto mb-8">
              The business is now live on the Directory page. Don't forget to upload a featured image for them through the admin panel later.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="font-mono text-[11px] uppercase tracking-widest font-bold text-aged-brass hover:text-deep-spruce dark:hover:text-white transition-colors"
            >
              Add Another Business &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
            />
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="intakeSecret" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold flex items-center justify-between">
                <span>Access Secret *</span>
                <span className="text-[9px] font-normal opacity-70">Saved to browser</span>
              </label>
              <input
                type="password"
                id="intakeSecret"
                name="intakeSecret"
                value={intakeSecret}
                onChange={handleSecretChange}
                placeholder="Enter passcode"
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="businessName" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Montgomery Distillery"
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="arts-culture">Arts & Culture</option>
                  <option value="auto-repair">Auto Repair</option>
                  <option value="automotive">Automotive</option>
                  <option value="electrical">Electrical</option>
                  <option value="food-drink">Food & Drink</option>
                  <option value="health-wellness">Health & Wellness</option>
                  <option value="home-lodging">Home & Lodging</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="plumbing-hvac">Plumbing & HVAC</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="septic-excavation">Septic & Excavation</option>
                  <option value="shopping">Shopping</option>
                  <option value="towing">Towing</option>
                  <option value="welding-fabrication">Welding & Fabrication</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="neighborhood" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Neighborhood *
                </label>
                <select
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select a neighborhood...</option>
                  <option value="downtown">Downtown</option>
                  <option value="hip-strip">Hip Strip</option>
                  <option value="slant-streets">Slant Streets</option>
                  <option value="university-district">University District</option>
                  <option value="northside">Northside</option>
                  <option value="westside">Westside</option>
                  <option value="rattlesnake">Rattlesnake</option>
                  <option value="grant-creek">Grant Creek</option>
                  <option value="orchard-homes-target-range">Orchard Homes / Target Range</option>
                  <option value="rose-park">Rose Park</option>
                  <option value="miller-creek-linda-vista">Miller Creek / Linda Vista</option>
                  <option value="south-hills">South Hills</option>
                  <option value="east-missoula">East Missoula</option>
                  <option value="bonner-milltown">Bonner-Milltown</option>
                  <option value="lolo">Lolo</option>
                  <option value="wye">Wye</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                Brief Description / Interview Notes
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What makes them a Missoula legend? Drop a few notes here..."
                rows={3}
                className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors resize-none"
              />
            </div>

            {/* Quick Facts */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Quick Facts
                </label>
                <button
                  type="button"
                  onClick={() => setQuickFacts((prev) => [...prev, ''])}
                  className="font-mono text-[10px] uppercase tracking-widest text-aged-brass hover:text-deep-spruce dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span className="text-base leading-none">+</span> Add Fact
                </button>
              </div>
              {quickFacts.length === 0 && (
                <p className="text-xs text-warm-stone/60 italic">No quick facts yet — click Add Fact to start.</p>
              )}
              {quickFacts.map((fact, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fact}
                    onChange={(e) => setQuickFacts((prev) => prev.map((f, idx) => idx === i ? e.target.value : f))}
                    placeholder={`e.g. Founded in 1952`}
                    className="flex-1 bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setQuickFacts((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none px-1"
                    aria-label="Remove fact"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  FAQs
                </label>
                <button
                  type="button"
                  onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
                  className="font-mono text-[10px] uppercase tracking-widest text-aged-brass hover:text-deep-spruce dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span className="text-base leading-none">+</span> Add FAQ
                </button>
              </div>
              {faqs.length === 0 && (
                <p className="text-xs text-warm-stone/60 italic">No FAQs yet — click Add FAQ to start.</p>
              )}
              {faqs.map((faq, i) => (
                <div key={i} className="flex flex-col gap-2 bg-warm-limestone/20 dark:bg-slate-900/40 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-warm-stone/70">FAQ {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqs((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none px-1"
                      aria-label="Remove FAQ"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, question: e.target.value } : f))}
                    placeholder="Question"
                    className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, answer: e.target.value } : f))}
                    placeholder="Answer"
                    rows={2}
                    className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-aged-brass transition-colors resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="address" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Physical Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 129 W Front St"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(406) 555-0100"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="instagram" className="font-mono text-[10px] uppercase tracking-wider text-warm-stone font-bold">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@handle"
                  className="w-full bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-aged-brass transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper px-8 py-4.5 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-[0.98] w-full mt-4 disabled:opacity-50"
            >
              {status === 'loading' ? 'Publishing to Directory...' : 'Add to Directory'}
            </button>
          </form>
        )}
      </section>

      {/* FAQ Section */}
      <section className="max-w-[720px] mx-auto px-6 pb-12 text-left border-t border-warm-limestone/40 dark:border-warm-limestone/10 pt-12">
        <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] uppercase font-bold mb-3 block w-fit bg-warm-limestone/40 dark:bg-slate-900/40 px-3 py-1 rounded-full">
          FAIR QUESTIONS
        </span>
        <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white mb-6">
          The stuff you&rsquo;re actually wondering.
        </h2>
        <div className="flex flex-col divide-y divide-warm-limestone/40 dark:divide-warm-limestone/10">
          {[
            {
              q: 'Is this really free? What\u2019s the catch?',
              a: 'Yes, and here\u2019s the honest answer about the catch. I run a marketing business in town. Building this registry is how I meet good local businesses and give them something useful before I\u2019ve earned the right to ask for anything. Their listing is free forever whether we ever talk business or not. No follow-up sales calls, no \u201cupgrade\u201d emails. If they ever want help, they\u2019ll come to me \u2014 that\u2019s the bet I\u2019m making.',
            },
            {
              q: 'I don\u2019t have a website. Is that a problem?',
              a: 'It\u2019s the opposite of a problem \u2014 it\u2019s half the reason this registry exists. Their listing becomes the page people find when they Google the business name. They don\u2019t need a website, a Facebook page, or an email list to be in it.',
            },
            {
              q: 'Do businesses have to promote it, share it, or post anything?',
              a: 'No. Some directories make you do their marketing for them. Businesses don\u2019t have to share, post, or link to anything. It\u2019s their page; use it or ignore it.',
            },
            {
              q: 'What happens after the intake form is submitted?',
              a: 'Trevor reads it, looks up the business, and drafts their page. They get it within a few days to check for mistakes. Once they approve it, it goes live and he sends them the link.',
            },
            {
              q: 'Who decides what gets written about a business?',
              a: 'The business sees and approves everything before it publishes. The registry is editorial \u2014 meaning it\u2019s written like a story, not an ad \u2014 but nothing goes up without sign-off, and they can request changes or removal any time.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                <span className="font-serif font-bold text-deep-spruce dark:text-white text-base leading-snug">
                  {q}
                </span>
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-aged-brass/50 flex items-center justify-center text-aged-brass text-xs transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-smoked-olive dark:text-ivory-paper/78 leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Manage Listings Section */}
      <section className="max-w-[720px] mx-auto px-6 pb-24 text-left border-t border-warm-limestone/40 dark:border-warm-limestone/10 pt-12">
        <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white mb-6 font-serif">
          Manage Current Listings
        </h2>
        {loadingListings ? (
          <p className="text-sm text-smoked-olive dark:text-ivory-paper/78 animate-pulse">Loading directory entries...</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-smoked-olive dark:text-ivory-paper/78">No business listings found in the directory.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-[#fcfbf9] dark:bg-blue-black border border-warm-limestone dark:border-warm-limestone/15 rounded-lg hover:border-aged-brass transition-colors"
              >
                <div>
                  <h3 className="font-serif font-bold text-deep-spruce dark:text-white text-base font-serif">
                    {item.businessName}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-mono uppercase bg-warm-limestone/30 dark:bg-slate-800 px-2 py-0.5 rounded text-warm-stone">
                      {String(item.category).replace(/-/g, ' ')}
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-warm-limestone/30 dark:bg-slate-800 px-2 py-0.5 rounded text-warm-stone">
                      {String(item.neighborhood).replace(/-/g, ' ')}
                    </span>
                    {item._status === 'draft' && (
                      <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id, item.businessName)}
                  className="px-3.5 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
