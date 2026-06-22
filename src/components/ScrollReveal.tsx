'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in'
  durationMs?: number
  delayMs?: number
  threshold?: number
}

export function ScrollReveal({ 
  children, 
  className = '', 
  animation = 'fade-up',
  durationMs = 800,
  delayMs = 0,
  threshold = 0.15
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (currentRef) observer.unobserve(currentRef)
        }
      },
      { root: null, rootMargin: '0px 0px -5% 0px', threshold }
    )

    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [threshold])

  // Compute base vs visible classes based on animation type
  const baseClass = animation === 'fade-up' ? 'opacity-0 translate-y-12' : 'opacity-0'
  const visibleClass = animation === 'fade-up' ? 'opacity-100 translate-y-0' : 'opacity-100'

  return (
    <div
      ref={ref}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? visibleClass : baseClass} ${className}`}
      style={{ 
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms` 
      }}
    >
      {children}
    </div>
  )
}
