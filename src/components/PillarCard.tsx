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
      className="perspective-1000 w-full h-[340px] cursor-pointer text-left group"
    >
      <div 
        className={`relative w-full h-full duration-550 transform-style-3d transition-all ease-out ${
          isFlipped ? 'rotate-y-180' : 'group-hover:[transform:rotateY(12deg)] group-hover:-translate-y-3'
        }`}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden p-6 rounded-md flex flex-col justify-between overflow-hidden transition-all duration-500 ease-out ${
          isImageCard 
            ? 'bg-slate-950/40 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_30px_60px_-15px_rgba(23,35,29,0.35)] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_35px_70px_-15px_rgba(0,0,0,0.85)] group-hover:border-aged-brass/40' 
            : 'bg-white/90 dark:bg-blue-black/90 border border-warm-limestone/55 dark:border-warm-limestone/15 shadow-sm group-hover:shadow-[0_20px_40px_rgba(23,35,29,0.15)] group-hover:border-aged-brass/30'
        }`}>
          {/* Card Background Image (if provided) */}
          {isImageCard && (
            <>
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={bgImage}
                  alt={title}
                  fill
                  sizes="350px"
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 brightness-[0.45] group-hover:brightness-[0.55] contrast-[1.05] sepia-[0.1] group-hover:sepia-0"
                />
              </div>
              
              {/* Glass Refraction Layer */}
              <div className="absolute inset-0 z-5 bg-slate-950/50 backdrop-blur-[3px] group-hover:bg-slate-950/30 group-hover:backdrop-blur-[0.5px] transition-all duration-500 pointer-events-none" />
              
              {/* Inner coordinate grid border */}
              <div className="absolute inset-3 border border-white/5 group-hover:border-aged-brass/25 transition-colors duration-500 rounded-sm pointer-events-none z-10" />
              
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
            
            <h3 className={`font-serif text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
              isImageCard ? 'text-ivory-paper group-hover:text-aged-brass' : 'text-deep-spruce dark:text-white'
            }`}>
              {title}
            </h3>
            
            <p className={`text-xs md:text-sm font-normal leading-relaxed transition-colors duration-300 ${
              isImageCard ? 'text-ivory-paper/75 group-hover:text-ivory-paper/90' : 'text-soft-black dark:text-warm-stone/90'
            }`}>
              {desc}
            </p>
          </div>

          <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-widest relative z-10 transition-colors duration-300 ${
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

