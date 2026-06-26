'use client'

import Image from 'next/image'
import { useState } from 'react'

interface FeaturedImageProps {
  src: string
  alt: string
  businessName: string
  category?: string
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Gradient backgrounds themed to each business category.
 * Provides a premium, visually rich fallback when a featured image is unavailable or broken.
 */
const CATEGORY_GRADIENTS: Record<string, string> = {
  'food-drink': 'from-amber-900/80 via-amber-800/60 to-amber-700/40',
  shopping: 'from-rose-900/80 via-rose-800/60 to-rose-700/40',
  lifestyle: 'from-emerald-900/80 via-emerald-800/60 to-emerald-700/40',
  automotive: 'from-slate-900/80 via-slate-800/60 to-slate-700/40',
  'professional-services': 'from-blue-900/80 via-blue-800/60 to-blue-700/40',
  'health-wellness': 'from-teal-900/80 via-teal-800/60 to-teal-700/40',
  'arts-culture': 'from-purple-900/80 via-purple-800/60 to-purple-700/40',
  'home-lodging': 'from-orange-900/80 via-orange-800/60 to-orange-700/40',
  'septic-excavation': 'from-stone-900/80 via-stone-800/60 to-stone-700/40',
  'auto-repair': 'from-zinc-900/80 via-zinc-800/60 to-zinc-700/40',
  'plumbing-hvac': 'from-sky-900/80 via-sky-800/60 to-sky-700/40',
  electrical: 'from-yellow-900/80 via-yellow-800/60 to-amber-700/40',
  towing: 'from-red-900/80 via-red-800/60 to-red-700/40',
  'welding-fabrication': 'from-orange-950/80 via-amber-900/60 to-orange-800/40',
}

const DEFAULT_GRADIENT = 'from-stone-900/80 via-stone-800/60 to-stone-700/40'

export function FeaturedImage({
  src,
  alt,
  businessName,
  category,
  priority = true,
  sizes = '(max-width: 1200px) 100vw, 800px',
  className = '',
}: FeaturedImageProps) {
  const [hasError, setHasError] = useState(false)
  const gradient = CATEGORY_GRADIENTS[category || ''] || DEFAULT_GRADIENT

  if (hasError || !src) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative text-center px-8">
          <div className="font-serif text-2xl md:text-3xl text-white/90 font-medium tracking-tight mb-2">
            {businessName}
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            Missoula Legends
          </div>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover object-center scale-100 hover:scale-103 transition-transform duration-1000 ease-out ${className}`}
      onError={() => setHasError(true)}
    />
  )
}
