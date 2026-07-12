"use client"

import React from 'react'
import Link from 'next/link'
import { FeaturedImage } from './FeaturedImage'
import { decodeUrl } from '@/lib/schema-utils'

type Props = {
  item: any
  categoryLabel: string
  neighborhoodLabel: string
}

export function DirectoryCard({ item, categoryLabel, neighborhoodLabel }: Props) {
  const imageSrc =
    decodeUrl(item.featuredImage?.sizes?.thumbnail?.url) ||
    decodeUrl(item.featuredImage?.url) ||
    ''

  // Render Short Description directly, avoiding fallback to full description/article text
  const snippet = item.shortDescription || ''

  return (
    <div className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-[2rem] bg-white/60 dark:bg-soft-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_15px_35px_rgb(0,0,0,0.3)] transition-all duration-500 overflow-hidden text-left w-full h-full">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-aged-brass/25 to-transparent" />

      <div className="flex flex-col flex-grow">
        {/* Landscape Framed Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] shadow-inner mb-5 bg-[#faf8f5] dark:bg-slate-900 border border-warm-limestone/20 dark:border-warm-limestone/5">
          <Link prefetch={false} href={`/directory/${item.slug || ''}`} className="relative block w-full h-full">
            <FeaturedImage
              src={imageSrc}
              alt={item.featuredImage?.alt || item.businessName}
              businessName={item.businessName}
              category={item.category}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="object-cover transition-transform duration-700 group-hover:scale-103"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold">
              {categoryLabel}
            </span>
            <span className="text-[9px] text-warm-stone/40 font-mono">•</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-warm-stone font-semibold">
              {neighborhoodLabel}
            </span>
          </div>

          {/* Business Name */}
          <h3 className="font-serif text-xl font-medium text-deep-spruce dark:text-white leading-snug mb-3 group-hover:text-aged-brass transition-colors">
            <Link prefetch={false} href={`/directory/${item.slug || ''}`}>
              {item.businessName}
            </Link>
          </h3>

          {/* Short description */}
          <p className="text-xs text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed mb-5 flex-grow">
            {snippet}
          </p>
        </div>
      </div>

      {/* Card bottom details */}
      <div className="pt-4 border-t border-dashed border-warm-limestone/40 dark:border-warm-stone/20 flex justify-between items-center mt-auto">
        <Link prefetch={false}
          href={`/directory/${item.slug || ''}`}
          className="text-[10px] font-mono uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300"
          aria-label={`Explore ${item.businessName}`}
        >
          Explore {item.businessName} &rarr;
        </Link>
        
        {item.contactInfo?.phone && (
          <span className="text-[10px] font-mono text-warm-stone/80">
            {item.contactInfo.phone}
          </span>
        )}
      </div>
    </div>
  )
}
