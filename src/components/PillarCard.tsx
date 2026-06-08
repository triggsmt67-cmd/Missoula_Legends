'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  desc: string
  href: string
  icon: React.ReactNode
  backText: string
}

export function PillarCard({ title, desc, href, icon, backText }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFlipped(true)
    setTimeout(() => {
      router.push(href)
    }, 500) // Allow time for the 3D flip animation to finish
  }

  return (
    <div 
      onClick={handleClick}
      className="perspective-1000 w-full h-[260px] cursor-pointer text-left group"
    >
      <div 
        className={`relative w-full h-full duration-550 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : 'group-hover:[transform:rotateY(10deg)]'
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden p-6 bg-white dark:bg-blue-black border border-warm-limestone/55 dark:border-warm-limestone/15 rounded-sm flex flex-col justify-between shadow-sm hover:shadow transition-shadow">
          <div>
            <div className="w-10 h-10 flex items-center justify-center mb-5 text-aged-brass">
              {icon}
            </div>
            <h3 className="font-serif text-lg font-medium text-deep-spruce dark:text-white mb-2.5">
              {title}
            </h3>
            <p className="text-xs text-soft-black dark:text-warm-stone/90 font-normal leading-relaxed">
              {desc}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest text-oxblood-brown dark:text-aged-brass group-hover:translate-x-0.5 transition-transform duration-300">
            EXPLORE REGISTRY &rarr;
          </span>
        </div>

        {/* Back Side (Shown when transitioning) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 bg-deep-spruce text-ivory-paper border border-aged-brass/25 rounded-sm flex flex-col justify-between items-center text-center shadow-md">
          <div className="flex-grow flex flex-col items-center justify-center gap-3">
            {/* Spinning Compass Loader */}
            <svg className="w-8 h-8 text-aged-brass animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
            </svg>
            <p className="font-serif italic text-sm text-ivory-paper/90">
              {backText}
            </p>
          </div>
          <span className="font-mono text-[8px] tracking-[0.2em] text-aged-brass uppercase">
            MISSOULA LEGENDS
          </span>
        </div>
      </div>
    </div>
  )
}
