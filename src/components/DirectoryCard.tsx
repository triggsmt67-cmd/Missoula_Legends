"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { RichText } from './RichText'

type Props = {
  item: any
  categoryLabel: string
  neighborhoodLabel: string
}

function getPlainText(data: any): string {
  if (!data) return ''
  if (typeof data === 'string') return data
  
  try {
    let text = ''
    const traverse = (node: any) => {
      if (!node) return
      if (node.text && typeof node.text === 'string') {
        text += node.text
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
    }
    
    if (data.root) {
      traverse(data.root)
    } else if (Array.isArray(data.children)) {
      data.children.forEach(traverse)
    }
    return text.trim()
  } catch (e) {
    console.error('Error extracting plain text from richText:', e)
    return ''
  }
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export function DirectoryCard({ item, categoryLabel, neighborhoodLabel }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const imageSrc =
    decodeUrl(item.featuredImage?.sizes?.thumbnail?.url) ||
    decodeUrl(item.featuredImage?.url) ||
    '/media/placeholder.jpg'

  const plainText = getPlainText(item.description)
  const shouldTruncate = plainText.length > 160
  const snippet = shouldTruncate ? plainText.slice(0, 160) + '...' : plainText

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start py-8 border-b border-slate-200/60 dark:border-slate-850/60 last:border-b-0 animate-fade-in w-full">
      {/* Landscape Thumbnail Image */}
      <div className="relative w-full md:w-72 aspect-[4/3] md:aspect-[1.5/1] overflow-hidden bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex-shrink-0 shadow-sm border border-slate-200/10 dark:border-slate-800/20">
        <Image
          src={imageSrc}
          alt={item.featuredImage?.alt || item.businessName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover image-zoom-hover"
        />
      </div>

      {/* Details Area */}
      <div className="flex-grow flex flex-col justify-between w-full">
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-900 text-white px-2.5 py-1 rounded">
              {categoryLabel}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-2.5 py-1 rounded border border-slate-200/30 dark:border-slate-700/30">
              {neighborhoodLabel}
            </span>
          </div>

          {/* Business Name */}
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight leading-snug mb-3">
            {item.businessName}
          </h2>

          {/* Expandable Description */}
          {isExpanded ? (
            <div className="mb-4 animate-fade-in">
              {typeof item.description === 'string' ? (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              ) : (
                <RichText data={item.description} className="text-sm font-light" />
              )}
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-350 font-semibold text-xs uppercase tracking-wider font-mono mt-3 inline-flex items-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Show Less &uarr;
                </button>
              )}
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 font-light">
              {snippet}
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-emerald-800 dark:text-emerald-450 hover:text-emerald-355 font-semibold text-sm underline underline-offset-4 transition-colors ml-2 cursor-pointer"
                >
                  Read more
                </button>
              )}
            </p>
          )}
        </div>

        {/* Contact Info Bottom Row */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-xs text-slate-400 dark:text-slate-550 font-light flex flex-wrap gap-x-4 gap-y-2 font-mono uppercase tracking-wider">
            {item.contactInfo?.address && (
              <div className="flex gap-2">
                <span className="text-slate-350 dark:text-slate-650">LOC:</span>
                <span className="text-slate-600 dark:text-slate-350 truncate max-w-[180px] min-[375px]:max-w-[250px]">{item.contactInfo.address}</span>
              </div>
            )}
            {item.contactInfo?.phone && (
              <div className="flex gap-2">
                <span className="text-slate-350 dark:text-slate-650">PH:</span>
                <span className="text-slate-600 dark:text-slate-350">{item.contactInfo.phone}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {item.contactInfo?.website && (
              <a
                href={item.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-300 underline underline-offset-4 active:scale-[0.98] transition-all"
              >
                Visit Website &rarr;
              </a>
            )}
            {item.contactInfo?.instagram && (
              <a
                href={`https://instagram.com/${item.contactInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-450 dark:text-slate-550 hover:text-slate-655 dark:hover:text-slate-300 transition-colors"
              >
                {item.contactInfo.instagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
