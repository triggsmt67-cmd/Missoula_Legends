'use client'

import React, { useState } from 'react'

type Props = {
  children: React.ReactNode
}

export function ReadMoreDescription({ children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative w-full">
      <div
        className={`relative overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'max-h-[4000px]' : 'max-h-[380px]'
        }`}
      >
        {children}
        
        {/* Fade overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory-paper via-ivory-paper/90 to-transparent dark:from-soft-black dark:via-soft-black/90 pointer-events-none" />
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-deep-spruce hover:text-oxblood-brown dark:text-aged-brass dark:hover:text-ivory-paper border border-warm-limestone/80 hover:border-aged-brass dark:border-warm-limestone/25 dark:hover:border-aged-brass px-6 py-3 rounded-sm transition-all duration-300 shadow-sm cursor-pointer"
        >
          {isExpanded ? (
            <>
              Read Less
              <svg className="w-3.5 h-3.5 transform rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <>
              Read More
              <svg className="w-3.5 h-3.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
