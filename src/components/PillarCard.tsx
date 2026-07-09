import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  title: string
  desc: string
  href: string
  icon: React.ReactNode
  backText: string
  bgImage?: string
}

export function PillarCard({ title, desc, href, icon, backText, bgImage }: Props) {
  return (
    <Link 
      href={href}
      className="group relative flex flex-col justify-end p-5 sm:p-8 rounded-[2.5rem] border border-white/20 shadow-lg hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] transition-all duration-500 overflow-hidden text-left cursor-pointer min-h-[350px] lg:min-h-[400px]"
    >
      {/* Full Bleed Background Image */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="350px"
            className="object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.4] contrast-[1.1] sepia-[0.2] group-hover:sepia-0"
          />
        </div>
      )}

      {/* Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 z-10 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

      {/* Floating Glass Icon at Top Right */}
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-lg group-hover:bg-aged-brass group-hover:text-black group-hover:border-aged-brass transition-all duration-500 z-20">
        {icon}
      </div>

      {/* Content Area */}
      <div className="relative z-20 mt-auto transform transition-transform duration-500 group-hover:-translate-y-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-tight mb-2 sm:mb-3 group-hover:text-aged-brass transition-colors drop-shadow-md">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-ivory-paper/90 font-normal leading-relaxed mb-4 sm:mb-6 drop-shadow">
          {desc}
        </p>
        
        <div className="pt-5 border-t border-white/20 flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-white transition-colors group-hover:text-aged-brass duration-300">
            Explore Category &rarr;
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/80 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
            {backText.replace('Entering the ', '').replace('...', '')}
          </span>
        </div>
      </div>
    </Link>
  )
}

