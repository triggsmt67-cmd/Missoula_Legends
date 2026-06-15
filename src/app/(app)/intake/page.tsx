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
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [listings, setListings] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  const fetchListings = async () => {
    setLoadingListings(true)
    const res = await getDirectoryListings()
    if (res.success && res.listings) {
      setListings(res.listings)
    }
    setLoadingListings(false)
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (id: string | number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return
    }

    try {
      const res = await deleteBusiness(String(id))
      if (res.success) {
        fetchListings()
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
      const res = await submitIntakeForm(formData)
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
        })
        fetchListings()
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
          <p className="text-sm text-smoked-olive dark:text-warm-stone mt-2">
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
            <p className="text-sm sm:text-base text-smoked-olive dark:text-warm-stone leading-relaxed max-w-[45ch] mx-auto mb-8">
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
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

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
                  <option value="food-drink">Food & Drink</option>
                  <option value="shopping">Shopping</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="automotive">Automotive</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="health-wellness">Health & Wellness</option>
                  <option value="arts-culture">Arts & Culture</option>
                  <option value="home-lodging">Home & Lodging</option>
                  <option value="septic-excavation">Septic & Excavation</option>
                  <option value="auto-repair">Auto Repair</option>
                  <option value="plumbing-hvac">Plumbing & HVAC</option>
                  <option value="electrical">Electrical</option>
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

      {/* Manage Listings Section */}
      <section className="max-w-[720px] mx-auto px-6 pb-24 text-left border-t border-warm-limestone/40 dark:border-warm-limestone/10 pt-12">
        <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white mb-6 font-serif">
          Manage Current Listings
        </h2>
        {loadingListings ? (
          <p className="text-sm text-smoked-olive dark:text-warm-stone animate-pulse">Loading directory entries...</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-smoked-olive dark:text-warm-stone">No business listings found in the directory.</p>
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
