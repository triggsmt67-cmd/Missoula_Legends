'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Props = {
  title: string
  desc: string
  href: string
  icon: React.ReactNode
  backText: string
  bgImage?: string
}

export function PillarCard({ title, desc, href, icon, backText, bgImage }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFlipped(true)
    setTimeout(() => {
      router.push(href)
    }, 500) // Allow time for the 3D flip animation to finish
  }

  const isImageCard = !!bgImage

  return (
    <div 
      onClick={handleClick}
      className="perspective-1000 w-full h-[270px] cursor-pointer text-left group"
    >
      <div 
        className={`relative w-full h-full duration-550 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : 'group-hover:[transform:rotateY(12deg)]'
        }`}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden p-6 rounded-md flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-500 ${
          isImageCard 
            ? 'bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/15 group-hover:shadow-xl group-hover:border-aged-brass/30' 
            : 'bg-white dark:bg-blue-black border border-warm-limestone/55 dark:border-warm-limestone/15 hover:shadow-md'
        }`}>
          {/* Card Background Image (if provided) */}
          {isImageCard && (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={bgImage}
                  alt={title}
                  fill
                  sizes="350px"
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 brightness-[0.32] group-hover:brightness-[0.45] contrast-[1.05] sepia-[0.15] group-hover:sepia-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soft-black/85 via-soft-black/35 to-transparent pointer-events-none" />
              </div>
              
              {/* Inner coordinate grid border */}
              <div className="absolute inset-3 border border-white/5 group-hover:border-aged-brass/20 transition-colors duration-500 rounded-sm pointer-events-none z-10" />
              
              {/* Corner coordinate brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-aged-brass/35 group-hover:border-aged-brass/70 transition-colors pointer-events-none z-10" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-aged-brass/35 group-hover:border-aged-brass/70 transition-colors pointer-events-none z-10" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-aged-brass/35 group-hover:border-aged-brass/70 transition-colors pointer-events-none z-10" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-aged-brass/35 group-hover:border-aged-brass/70 transition-colors pointer-events-none z-10" />
            </>
          )}

          <div className="relative z-10">
            {/* Glassmorphic Icon Badge */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-5 transition-all duration-500 ${
              isImageCard 
                ? 'bg-white/5 backdrop-blur-md border border-white/10 text-aged-brass group-hover:bg-aged-brass group-hover:text-soft-black group-hover:border-aged-brass group-hover:scale-105 shadow-inner' 
                : 'text-aged-brass bg-warm-limestone/20 dark:bg-white/5'
            }`}>
              {icon}
            </div>
            
            <h3 className={`font-serif text-lg font-medium mb-2.5 transition-colors duration-300 ${
              isImageCard ? 'text-ivory-paper group-hover:text-aged-brass' : 'text-deep-spruce dark:text-white'
            }`}>
              {title}
            </h3>
            
            <p className={`text-xs font-normal leading-relaxed transition-colors duration-300 ${
              isImageCard ? 'text-ivory-paper/70 group-hover:text-ivory-paper/90' : 'text-soft-black dark:text-warm-stone/90'
            }`}>
              {desc}
            </p>
          </div>

          <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest relative z-10 transition-colors duration-300 ${
            isImageCard ? 'text-aged-brass group-hover:text-white' : 'text-oxblood-brown dark:text-aged-brass'
          }`}>
            EXPLORE REGISTRY <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </span>
        </div>

        {/* Back Side (Shown when transitioning) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 bg-deep-spruce text-ivory-paper border border-aged-brass/25 rounded-md flex flex-col justify-between items-center text-center shadow-md">
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

