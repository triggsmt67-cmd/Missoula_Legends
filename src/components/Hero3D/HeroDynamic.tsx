'use client'

import dynamicImport from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Hero3DErrorBoundary } from './Hero3DErrorBoundary'

const HeroCanvas = dynamicImport(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gradient-to-l from-warm-limestone/20 to-transparent dark:from-deep-spruce/20" />
  ),
})

export function HeroDynamic() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection

    if (!desktop.matches || reducedMotion.matches || connection?.saveData) return

    // Keep this decorative layer completely outside the initial page-load window.
    const handle = window.setTimeout(() => setShouldLoad(true), 12_000)

    return () => {
      window.clearTimeout(handle)
    }
  }, [])

  return shouldLoad ? (
    <Hero3DErrorBoundary>
      <HeroCanvas />
    </Hero3DErrorBoundary>
  ) : null
}
