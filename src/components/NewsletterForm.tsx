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
      <div className="bg-warm-limestone/30 dark:bg-blue-black/40 border border-aged-brass/40 p-6 rounded-md text-deep-spruce dark:text-ivory-paper animate-fade-in">
        <h3 className="font-serif text-xl font-medium mb-2">Welcome to the registry.</h3>
        <p className="text-sm font-normal text-soft-black dark:text-warm-stone">
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
          className="w-full bg-white dark:bg-blue-black border border-warm-limestone dark:border-warm-stone/40 rounded-md px-6 py-4 text-soft-black dark:text-ivory-paper placeholder:text-warm-stone/70 focus:outline-none focus:border-aged-brass dark:focus:border-aged-brass focus:ring-1 focus:ring-aged-brass/20 transition-all duration-300 disabled:opacity-70 text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-md active:scale-[0.98] transition-all duration-300 whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
        >
          {status === 'loading' ? 'Joining...' : 'Join Newsletter'}
        </button>
      </form>
      {status === 'error' && (
        <span className="text-xs text-oxblood-brown dark:text-aged-brass mt-2 block pl-2 font-mono uppercase tracking-wider">
          Something went wrong. Please try again.
        </span>
      )}
    </div>
  )
}

