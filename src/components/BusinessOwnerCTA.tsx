import React from 'react'
import Link from 'next/link'

export function BusinessOwnerCTA() {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 py-8 lg:py-12">
      <div className="bg-[#2C3B34] dark:bg-[#1E2C26] rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative isolate">
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }} />

        {/* Left Column */}
        <div className="flex-1 flex flex-col items-start relative z-10 lg:pr-8">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-[#D0AB7B] mb-6">
            For Business Owners
          </span>
          <h2 className="font-serif text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] text-[#FAF7F2] leading-[1.1] mb-6 font-normal drop-shadow-sm tracking-tight">
            If your business is part of Missoula, it should be presented like it matters.
          </h2>
          <p className="font-serif text-[#FAF7F2]/90 text-base sm:text-lg leading-[1.6] max-w-[42ch] mb-8">
            Claim your page, correct your details, add your photos, and make sure the people looking for you find something stronger than a thin listing or an empty result.
          </p>
          <Link href="/claim" className="group font-serif font-bold text-[#FAF7F2] text-lg hover:text-[#D0AB7B] transition-colors flex items-center gap-2">
            Get Listed Free <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </Link>
        </div>

        {/* Right Column */}
        <div className="flex-[0.9] relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-8 sm:p-10 shadow-inner h-full flex flex-col justify-center">
            <p className="font-serif text-[1.5rem] sm:text-[1.75rem] text-[#FAF7F2] leading-tight mb-6 tracking-tight">
              &ldquo;This feels less like being added to a directory and more like being included in the city&apos;s record.&rdquo;
            </p>
            <p className="font-serif text-[#FAF7F2]/80 text-sm sm:text-base leading-relaxed mb-8">
              Free listings open the door. Stronger editorial profiles, category placement, and better visibility create the upgrade path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                href="/claim"
                className="inline-flex items-center justify-center bg-[#17231D] text-[#FAF7F2] hover:bg-[#D0AB7B] hover:text-[#17231D] px-6 py-4 rounded-full font-serif text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold transition-all duration-300 shadow-md hover:-translate-y-[2px] active:scale-[0.98] w-full sm:w-auto"
              >
                Get Listed Free
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
