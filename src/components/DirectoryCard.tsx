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

export function DirectoryCard({ item, categoryLabel, neighborhoodLabel }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const imageSrc =
    item.featuredImage?.sizes?.thumbnail?.url || item.featuredImage?.url || '/media/placeholder.jpg'

  const plainText = getPlainText(item.description)
  const shouldTruncate = plainText.length > 160
  const snippet = shouldTruncate ? plainText.slice(0, 160) + '...' : plainText

  return (
    <div className="bg-white dark:bg-slate-900/20 border border-slate-250/40 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] p-7 rounded-[2rem] flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.025)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)] transition-all duration-300 animate-fade-in">
      <div>
        {/* Thumbnail Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] mb-6 shadow-sm border border-slate-200/10 dark:border-slate-800/20">
          <Image
            src={imageSrc}
            alt={item.featuredImage?.alt || item.businessName}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
            {categoryLabel}
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200/30 dark:border-slate-700/30">
            {neighborhoodLabel}
          </span>
        </div>

        {/* Business Details */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white tracking-tight leading-tight mb-3">
          {item.businessName}
        </h2>

        {/* Expandable Description */}
        {isExpanded ? (
          <div className="mb-6 animate-fade-in">
            {typeof item.description === 'string' ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            ) : (
              <RichText data={item.description} className="text-sm font-light" />
            )}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-350 font-semibold text-xs uppercase tracking-wider font-mono mt-3 inline-flex items-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
              >
                Show Less &uarr;
              </button>
            )}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-light">
            {snippet}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold text-sm underline underline-offset-4 transition-colors ml-2 cursor-pointer"
              >
                Read more
              </button>
            )}
          </p>
        )}
      </div>

      {/* Contact & Link Bottom Section */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-4 flex flex-col gap-3">
        <div className="text-xs text-slate-400 dark:text-slate-550 font-light flex flex-col gap-1.5 font-mono uppercase tracking-wider">
          {item.contactInfo?.address && (
            <div className="flex gap-2">
              <span className="text-slate-350 dark:text-slate-650">LOC:</span>
              <span className="text-slate-600 dark:text-slate-350 truncate max-w-[250px]">{item.contactInfo.address}</span>
            </div>
          )}
          {item.contactInfo?.phone && (
            <div className="flex gap-2">
              <span className="text-slate-350 dark:text-slate-650">PH:</span>
              <span className="text-slate-600 dark:text-slate-350">{item.contactInfo.phone}</span>
            </div>
          )}
        </div>
        {item.contactInfo?.website && (
          <div className="pt-2 flex justify-between items-center">
            <a
              href={item.contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 underline underline-offset-4 active:scale-[0.98] transition-all"
            >
              Visit Website &rarr;
            </a>
            {item.contactInfo.instagram && (
              <a
                href={`https://instagram.com/${item.contactInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-350 transition-colors"
              >
                {item.contactInfo.instagram}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
