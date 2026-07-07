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
 * Unified branded gradient for the fallback.
 * Uses a consistent dark oxblood/burgundy tone inspired by the Missoula Legends brand
 * to create a premium, cohesive look when a featured image is unavailable.
 */
const BRAND_GRADIENT = 'from-[#4a1526] via-[#5c1a2a] to-[#3d111f]'

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

  if (hasError || !src) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br ${BRAND_GRADIENT}`}>
        {/* Dark inset border frame */}
        <div className="absolute inset-0 border-[3px] border-[#2a0d15]/60 pointer-events-none" />
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
