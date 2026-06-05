'use client'

import React, { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    // Simulate API request with realistic network latency
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 p-6 rounded-2xl text-emerald-900 dark:text-emerald-300 transition-all duration-500 hover:scale-[1.005] shadow-[0_10px_30px_rgba(16,185,129,0.05)]">
        <h3 className="font-bold text-lg mb-1">Welcome to the registry.</h3>
        <p className="text-sm font-light text-emerald-800 dark:text-emerald-400">
          Check your inbox soon for our latest curated guide and local profiles.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          placeholder="Enter your email address"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-800 dark:focus:border-emerald-600 focus:ring-4 focus:ring-emerald-800/5 dark:focus:ring-emerald-600/5 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-8 py-4.5 rounded-2xl active:scale-[0.98] hover:scale-[1.01] transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
        >
          {status === 'loading' ? 'Joining...' : 'Join Newsletter'}
        </button>
      </form>
      {status === 'error' && (
        <span className="text-xs text-red-500 mt-2 block pl-2 font-medium">
          Something went wrong. Please try again.
        </span>
      )}
    </div>
  )
}
