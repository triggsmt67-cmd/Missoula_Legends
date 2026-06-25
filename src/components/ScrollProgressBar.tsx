'use client'

import React, { useEffect } from 'react'

export function ScrollProgressBar() {
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0
      const progressEl = document.getElementById('scroll-progress')
      if (progressEl) progressEl.style.width = `${scrolled}%`
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      id="scroll-progress"
      className="fixed top-0 left-0 h-[2px] bg-aged-brass z-50 transition-all duration-75"
      style={{ width: '0%' }}
    />
  )
}
