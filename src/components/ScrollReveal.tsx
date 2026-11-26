'use client'

import React, { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in'
  durationMs?: number
  delayMs?: number
}

export function ScrollReveal({ 
  children, 
  className = '', 
  animation = 'fade-up',
  durationMs = 800,
  delayMs = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentRef.removeAttribute('data-reveal-pending')
          observer.disconnect()
        }
      },
      // A percentage threshold can be impossible to reach for tall sections.
      { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0 }
    )

    // Do not hide content already in view, including a restored scroll position.
    const { top } = currentRef.getBoundingClientRect()
    if (top >= window.innerHeight) {
      currentRef.setAttribute('data-reveal-pending', '')
    }
    observer.observe(currentRef)
    return () => {
      observer.disconnect()
      currentRef.removeAttribute('data-reveal-pending')
    }
  }, [])

  return (
    <div
      ref={ref}
      data-reveal-animation={animation}
      className={`scroll-reveal transition-[opacity,translate] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ 
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms` 
      }}
    >
      {children}
    </div>
  )
}
