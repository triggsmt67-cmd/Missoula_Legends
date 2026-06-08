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
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start py-8 border-b border-warm-limestone/40 dark:border-warm-limestone/10 last:border-b-0 animate-fade-in w-full">
      {/* Landscape Thumbnail Image - Matted Frame */}
      <div className="relative w-full md:w-72 aspect-[4/3] md:aspect-[1.5/1] p-2 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm flex-shrink-0 shadow-sm">
        <div className="relative w-full h-full overflow-hidden bg-[#faf8f5] dark:bg-slate-900">
          <Image
            src={imageSrc}
            alt={item.featuredImage?.alt || item.businessName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 288px"
            className="object-cover image-zoom-hover"
          />
        </div>
      </div>

      {/* Details Area */}
      <div className="flex-grow flex flex-col justify-between w-full md:w-auto min-w-0">
        <div>
          {/* Badges - Editorial typography style instead of chunky boxes */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-aged-brass">
              {categoryLabel}
            </span>
            <span className="h-3 border-r border-warm-limestone dark:border-warm-stone/30 mx-3" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-warm-stone">
              {neighborhoodLabel}
            </span>
          </div>

          {/* Business Name */}
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-deep-spruce dark:text-ivory-paper tracking-tight leading-snug mb-3">
            {item.businessName}
          </h2>

          {/* Expandable Description */}
          {isExpanded ? (
            <div className="mb-4 animate-fade-in">
              {typeof item.description === 'string' ? (
                <p className="text-soft-black dark:text-warm-stone text-sm leading-relaxed font-normal max-w-[70ch]">
                  {item.description}
                </p>
              ) : (
                <RichText data={item.description} className="text-sm font-normal text-soft-black dark:text-warm-stone max-w-[70ch]" />
              )}
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-oxblood-brown dark:text-aged-brass hover:text-deep-spruce dark:hover:text-ivory-paper font-mono font-bold text-xs uppercase tracking-widest mt-3 inline-flex items-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Show Less &uarr;
                </button>
              )}
            </div>
          ) : (
            <p className="text-soft-black dark:text-warm-stone text-sm leading-relaxed mb-4 font-normal max-w-[70ch]">
              {snippet}
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-oxblood-brown dark:text-aged-brass hover:text-deep-spruce dark:hover:text-ivory-paper font-mono font-bold text-xs uppercase tracking-widest underline underline-offset-4 transition-colors ml-2 cursor-pointer"
                >
                  Read more
                </button>
              )}
            </p>
          )}
        </div>

        {/* Contact Info Bottom Row */}
        <div className="border-t border-warm-limestone/55 dark:border-warm-limestone/15 pt-5 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-warm-stone flex flex-wrap gap-x-5 gap-y-2">
            {item.contactInfo?.address && (
              <div className="flex gap-2">
                <span className="text-aged-brass/70">LOC:</span>
                <span className="text-soft-black dark:text-warm-stone/90 font-normal truncate max-w-[180px] min-[375px]:max-w-[250px]">{item.contactInfo.address}</span>
              </div>
            )}
            {item.contactInfo?.phone && (
              <div className="flex gap-2">
                <span className="text-aged-brass/70">PH:</span>
                <span className="text-soft-black dark:text-warm-stone/90 font-normal">{item.contactInfo.phone}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {item.contactInfo?.website && (
              <a
                href={item.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold uppercase tracking-widest text-deep-spruce dark:text-aged-brass hover:bg-oxblood-brown hover:text-ivory-paper dark:hover:bg-aged-brass dark:hover:text-soft-black border border-deep-spruce/20 dark:border-aged-brass/35 px-3 py-1.5 rounded-sm transition-all duration-300 cursor-pointer shadow-sm hover:shadow"
              >
                Visit Website &rarr;
              </a>
            )}
            {item.contactInfo?.instagram && (
              <a
                href={`https://instagram.com/${item.contactInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-widest text-warm-stone hover:text-deep-spruce dark:hover:text-aged-brass transition-colors"
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
