'use client'

import dynamicImport from 'next/dynamic'

export const HeroDynamic = dynamicImport(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-ivory-paper dark:bg-[#101411]">
      <span className="h-2 w-2 rounded-full bg-aged-brass animate-ping mb-3" />
      <span className="font-mono text-[10px] text-warm-stone uppercase tracking-[0.2em] font-bold animate-pulse">Loading Interactive Map Viewport...</span>
    </div>
  )
})
