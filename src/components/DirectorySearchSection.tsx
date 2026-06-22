'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { DirectoryCard } from './DirectoryCard'

interface DirectorySearchSectionProps {
  listings: any[]
  initialCategory?: string
}

const CATEGORY_INFO: { [key: string]: { label: string; icon: React.ReactNode } } = {
  'food-drink': {
    label: 'Food & Drink',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-[8deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-4.142 0-7.5 3.358-7.5 7.5v1.5h15v-1.5c0-4.142-3.358-7.5-7.5-7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V2.25M3 13.5h18M5.25 13.5v2.25c0 1.243.5 2.368 1.32 3.18.811.812 1.936 1.32 3.18 1.32h4.5c1.243 0 2.368-.508 3.18-1.32.82-.812 1.32-1.937 1.32-3.18v-2.25" />
      </svg>
    ),
  },
  'shopping': {
    label: 'Shopping',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 13.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
      </svg>
    ),
  },
  'lifestyle': {
    label: 'Lifestyle',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21L12 3l9.75 18M12 13l-4.5 8M12 13l4.5 8M7.5 11.5L5 15M16.5 11.5L19 15" />
      </svg>
    ),
  },
  'automotive': {
    label: 'Automotive',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3m12 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.75M9 15h9.75M9 15a1.5 1.5 0 11-3 0m3 0H3.75M9 15V9m9.75 6v-3.75m0 0a1.5 1.5 0 00-1.5-1.5H12M18.75 11.25v-3.75m0 3.75h1.5m-1.5-3.75a1.5 1.5 0 00-1.5-1.5H15M18.75 7.5h1.5m-3 0V3.75m0 3.75H12M3 15V9.75" />
      </svg>
    ),
  },
  'professional-services': {
    label: 'Professional Services',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-[4deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v2.63c0 .82-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.68-1.5-1.5v-2.63m18-4.5V7.125c0-.828-.672-1.5-1.5-1.5H3.75c-.828 0-1.5.672-1.5 1.5V9.65m18 0A11.954 11.954 0 0112 10.5c-2.905 0-5.63-.615-8.083-1.725m16.083 0V9.65M3.75 5.625h16.5M3.75 2.25h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25v-1.5M15 14.25v-1.5M12 14.25v-1.5" />
      </svg>
    ),
  },
  'health-wellness': {
    label: 'Health & Wellness',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-5.5 4.5-9 9-9s9 3.5 9 9a9 9 0 01-9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M12 18v3M3 12h3M18 12h3M5.636 5.636l2.121 2.121M16.243 16.243l2.121 2.121M5.636 18.364l2.121-2.121M16.243 7.757l2.121-2.121" />
      </svg>
    ),
  },
  'arts-culture': {
    label: 'Arts & Culture',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:-rotate-[10deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25l7.22-7.22c.983-.983 2.583-.983 3.566 0l2.186 2.186c.983.983.983 2.583 0 3.566l-9.222 9.222z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5l3 3M19.5 4.5l-3 3" />
      </svg>
    ),
  },
  'home-lodging': {
    label: 'Home & Lodging',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v2.25M10.5 16.5h3" />
      </svg>
    ),
  },
  'tradesmen': {
    label: 'Tradesmen',
    icon: (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 1019.4 18.85l-5.83-5.83M11.42 15.17a4.99 4.99 0 01-7.07-7.07c1.7-1.7 4.38-1.92 6.32-.67l-2.83 2.83a2 2 0 000 2.83l.08.08a2 2 0 002.83 0l2.83-2.83c1.25 1.94 1.03 4.62-.67 6.32z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l3 3M4 5l4 4" />
      </svg>
    ),
  },
}

const CATEGORY_THEME: {
  [key: string]: {
    bgLight: string
    bgDark: string
    textLight: string
    textDark: string
    borderLight: string
    borderDark: string
    glow: string
    activeBg: string
    activeBorder: string
    activeText: string
  }
} = {
  'food-drink': {
    bgLight: 'bg-rose-50/70',
    bgDark: 'dark:bg-rose-950/20',
    textLight: 'text-rose-700',
    textDark: 'dark:text-rose-400',
    borderLight: 'border-rose-100/50',
    borderDark: 'dark:border-rose-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(244,63,94,0.08)] dark:hover:shadow-[0_8px_20px_rgba(244,63,94,0.15)] hover:border-rose-300 dark:hover:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-900/40',
    activeBg: 'bg-rose-600 dark:bg-rose-600',
    activeBorder: 'border-rose-600 dark:border-rose-600',
    activeText: 'text-white dark:text-white',
  },
  shopping: {
    bgLight: 'bg-amber-50/70',
    bgDark: 'dark:bg-amber-950/20',
    textLight: 'text-amber-700',
    textDark: 'dark:text-amber-400',
    borderLight: 'border-amber-100/50',
    borderDark: 'dark:border-amber-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_8px_20px_rgba(245,158,11,0.15)] hover:border-amber-300 dark:hover:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-900/40',
    activeBg: 'bg-amber-500 dark:bg-amber-500',
    activeBorder: 'border-amber-500 dark:border-amber-500',
    activeText: 'text-white dark:text-soft-black',
  },
  lifestyle: {
    bgLight: 'bg-emerald-50/70',
    bgDark: 'dark:bg-emerald-950/20',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-400',
    borderLight: 'border-emerald-100/50',
    borderDark: 'dark:border-emerald-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_8px_20px_rgba(16,185,129,0.15)] hover:border-emerald-300 dark:hover:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/40',
    activeBg: 'bg-emerald-600 dark:bg-emerald-600',
    activeBorder: 'border-emerald-600 dark:border-emerald-600',
    activeText: 'text-white dark:text-white',
  },
  automotive: {
    bgLight: 'bg-blue-50/70',
    bgDark: 'dark:bg-blue-950/20',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-400',
    borderLight: 'border-blue-100/50',
    borderDark: 'dark:border-blue-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(59,130,246,0.08)] dark:hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] hover:border-blue-300 dark:hover:border-blue-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/40',
    activeBg: 'bg-blue-600 dark:bg-blue-600',
    activeBorder: 'border-blue-600 dark:border-blue-600',
    activeText: 'text-white dark:text-white',
  },
  'professional-services': {
    bgLight: 'bg-indigo-50/70',
    bgDark: 'dark:bg-indigo-950/20',
    textLight: 'text-indigo-700',
    textDark: 'dark:text-indigo-400',
    borderLight: 'border-indigo-100/50',
    borderDark: 'dark:border-indigo-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_8px_20px_rgba(99,102,241,0.15)] hover:border-indigo-300 dark:hover:border-indigo-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/40',
    activeBg: 'bg-indigo-600 dark:bg-indigo-600',
    activeBorder: 'border-indigo-600 dark:border-indigo-600',
    activeText: 'text-white dark:text-white',
  },
  'health-wellness': {
    bgLight: 'bg-teal-50/70',
    bgDark: 'dark:bg-teal-950/20',
    textLight: 'text-teal-700',
    textDark: 'dark:text-teal-400',
    borderLight: 'border-teal-100/50',
    borderDark: 'dark:border-teal-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(20,184,166,0.08)] dark:hover:shadow-[0_8px_20px_rgba(20,184,166,0.15)] hover:border-teal-300 dark:hover:border-teal-800/60 hover:bg-teal-50 dark:hover:bg-teal-900/40',
    activeBg: 'bg-teal-600 dark:bg-teal-600',
    activeBorder: 'border-teal-600 dark:border-teal-600',
    activeText: 'text-white dark:text-white',
  },
  'arts-culture': {
    bgLight: 'bg-violet-50/70',
    bgDark: 'dark:bg-violet-950/20',
    textLight: 'text-violet-700',
    textDark: 'dark:text-violet-400',
    borderLight: 'border-violet-100/50',
    borderDark: 'dark:border-violet-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(139,92,246,0.08)] dark:hover:shadow-[0_8px_20px_rgba(139,92,246,0.15)] hover:border-violet-300 dark:hover:border-violet-800/60 hover:bg-violet-50 dark:hover:bg-violet-900/40',
    activeBg: 'bg-violet-600 dark:bg-violet-600',
    activeBorder: 'border-violet-600 dark:border-violet-600',
    activeText: 'text-white dark:text-white',
  },
  'home-lodging': {
    bgLight: 'bg-orange-50/70',
    bgDark: 'dark:bg-orange-950/20',
    textLight: 'text-orange-700',
    textDark: 'dark:text-orange-400',
    borderLight: 'border-orange-100/50',
    borderDark: 'dark:border-orange-900/30',
    glow: 'hover:shadow-[0_8px_20px_rgba(249,115,22,0.08)] dark:hover:shadow-[0_8px_20px_rgba(249,115,22,0.15)] hover:border-orange-350 dark:hover:border-orange-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/40',
    activeBg: 'bg-orange-500 dark:bg-orange-500',
    activeBorder: 'border-orange-500 dark:border-orange-500',
    activeText: 'text-white dark:text-soft-black',
  },
  'tradesmen': {
    bgLight: 'bg-zinc-100/70',
    bgDark: 'dark:bg-zinc-900/40',
    textLight: 'text-zinc-700',
    textDark: 'dark:text-zinc-350',
    borderLight: 'border-zinc-200/60',
    borderDark: 'dark:border-zinc-800/40',
    glow: 'hover:shadow-[0_8px_20px_rgba(113,113,122,0.08)] dark:hover:shadow-[0_8px_20px_rgba(113,113,122,0.15)] hover:border-zinc-350 dark:hover:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/60',
    activeBg: 'bg-zinc-700 dark:bg-zinc-500',
    activeBorder: 'border-zinc-700 dark:border-zinc-500',
    activeText: 'text-white dark:text-white',
  },
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
  automotive: 'Automotive',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'auto-repair': 'Auto Repair',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical',
  'towing': 'Towing',
  'welding-fabrication': 'Welding & Fabrication',
  'tradesmen': 'Tradesmen',
}

const CATEGORY_MAPPING: { [key: string]: string } = {
  'septic-excavation': 'tradesmen',
  'plumbing-hvac': 'tradesmen',
  'electrical': 'tradesmen',
  'welding-fabrication': 'tradesmen',
  'auto-repair': 'automotive',
  'towing': 'automotive',
}

const getFilterCategory = (slug: string) => CATEGORY_MAPPING[slug] || slug

const NEIGHBORHOOD_LABELS: { [key: string]: string } = {
  downtown: 'Downtown',
  'hip-strip': 'Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  northside: 'Northside',
  westside: 'Westside',
  rattlesnake: 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'orchard-homes-target-range': 'Orchard Homes / Target Range',
  'rose-park': 'Rose Park',
  'miller-creek-linda-vista': 'Miller Creek / Linda Vista',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  'bonner-milltown': 'Bonner-Milltown',
  lolo: 'Lolo',
  wye: 'Wye',
}

export function DirectorySearchSection({ listings, initialCategory }: DirectorySearchSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Count active listings per category slug
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    listings.forEach((item) => {
      if (item.category) {
        const cat = getFilterCategory(item.category)
        counts[cat] = (counts[cat] || 0) + 1
      }
    })
    return counts
  }, [listings])

  // Sort categories alphabetically by label
  const sortedCategories = useMemo(() => {
    return Object.entries(CATEGORY_INFO).sort((a, b) => a[1].label.localeCompare(b[1].label))
  }, [])

  // Filter and sort listings based on search text and selected category
  const filteredListings = useMemo(() => {
    const filtered = listings.filter((item) => {
      // Category filter
      if (selectedCategory && getFilterCategory(item.category) !== selectedCategory) {
        return false
      }
      // Search text filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const nameMatch = item.businessName?.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood || ''
        const neighborMatch = neighborhoodLabel.toLowerCase().includes(query)
        const categoryLabel = CATEGORY_LABELS[item.category] || item.category || ''
        const filterCatLabel = CATEGORY_LABELS[getFilterCategory(item.category)] || ''
        const categoryMatch = categoryLabel.toLowerCase().includes(query) || filterCatLabel.toLowerCase().includes(query)
        
        return nameMatch || descMatch || neighborMatch || categoryMatch
      }
      return true
    })

    // Sort alphabetically by Filtered Category label, then by Business Name
    return filtered.sort((a, b) => {
      const catA = CATEGORY_LABELS[getFilterCategory(a.category)] || getFilterCategory(a.category) || ''
      const catB = CATEGORY_LABELS[getFilterCategory(b.category)] || getFilterCategory(b.category) || ''
      const catCompare = catA.localeCompare(catB)
      if (catCompare !== 0) return catCompare

      const nameA = a.businessName || ''
      const nameB = b.businessName || ''
      return nameA.localeCompare(nameB)
    })
  }, [listings, selectedCategory, searchQuery])

  const handleCategoryClick = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      setSelectedCategory(null) // deselect to show all
    } else {
      setSelectedCategory(categorySlug)
    }
  }

  return (
    <div className="w-full flex flex-col gap-12">
      {/* 1. Category Selection Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-warm-stone font-bold">
            Filter by Category
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-mono font-bold text-aged-brass hover:text-deep-spruce dark:hover:text-white transition-colors cursor-pointer"
            >
              Clear Filter [×]
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedCategories.map(([slug, info]) => {
            const isActive = selectedCategory === slug
            const count = categoryCounts[slug] || 0
            
            const theme = CATEGORY_THEME[slug] || {
              bgLight: 'bg-warm-limestone/40',
              bgDark: 'dark:bg-slate-900/50',
              textLight: 'text-deep-spruce',
              textDark: 'dark:text-aged-brass',
              borderLight: 'border-warm-limestone/40',
              borderDark: 'dark:border-warm-limestone/10',
              glow: 'hover:shadow-warm-limestone/10',
              activeBg: 'bg-deep-spruce dark:bg-[#203633]',
              activeBorder: 'border-deep-spruce dark:border-aged-brass',
              activeText: 'text-ivory-paper dark:text-aged-brass',
            }

            return (
              <button
                key={slug}
                onClick={() => handleCategoryClick(slug)}
                className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 group cursor-pointer hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] ${
                  isActive
                    ? `${theme.activeBg} ${theme.activeBorder} ${theme.activeText} shadow-md ring-2 ring-aged-brass/30`
                    : `bg-white/60 dark:bg-soft-black/40 backdrop-blur-md border-white/60 dark:border-white/5 hover:border-aged-brass text-soft-black dark:text-ivory-paper ${theme.glow}`
                }`}
              >
                {/* Icon Container (Squircle) */}
                <div className={`p-2.5 rounded-xl mb-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-white/10' 
                    : `${theme.bgLight} ${theme.bgDark} ${theme.textLight} ${theme.textDark} group-hover:scale-110 group-hover:shadow-sm`
                }`}>
                  {info.icon}
                </div>

                <span className={`font-serif text-sm font-bold tracking-tight mb-1 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-deep-spruce dark:text-ivory-paper group-hover:text-aged-brass'
                }`}>
                  {info.label}
                </span>

                <span className={`font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-white/60' : 'text-warm-stone group-hover:text-warm-stone/80'
                }`}>
                  {count} {count === 1 ? 'Listing' : 'Listings'}
                </span>
                
                {/* Active Indicator Pin */}
                {isActive && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-aged-brass animate-pulse shadow-sm" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Interactive Search Bar */}
      <div className="relative w-full max-w-[1200px] mx-auto bg-white dark:bg-blue-black border border-warm-limestone/65 dark:border-warm-limestone/15 p-2 rounded-sm shadow-sm flex items-center gap-3">
        <span className="text-warm-stone p-2 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search listings by name, category description, neighborhood, or services..."
          className="w-full bg-transparent border-0 text-sm font-sans focus:outline-none focus:ring-0 text-soft-black dark:text-ivory-paper placeholder-warm-stone/70 py-2.5"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-2 text-warm-stone hover:text-aged-brass transition-colors font-mono text-xs cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Listings Grid Header */}
      <div className="flex items-center justify-between border-b border-warm-limestone/40 dark:border-warm-limestone/15 pb-4 max-w-[1200px] mx-auto w-full">
        <span className="font-mono text-[10px] uppercase tracking-widest text-warm-stone font-bold">
          {selectedCategory ? `${CATEGORY_LABELS[selectedCategory]} Listings` : 'All Browseable Listings'}
        </span>
        <span className="font-mono text-[10px] text-warm-stone">
          Showing {filteredListings.length} of {listings.length} results
        </span>
      </div>

      {/* 4. Results Grid Container */}
      <div className="max-w-[1200px] mx-auto w-full">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredListings.map((item: any) => {
              const categoryLabel = CATEGORY_LABELS[item.category] || item.category
              const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood

              return (
                <DirectoryCard
                  key={item.id}
                  item={item}
                  categoryLabel={categoryLabel}
                  neighborhoodLabel={neighborhoodLabel}
                />
              )
            })}
          </div>
        ) : (
          <div className="py-24 text-center text-warm-stone bg-white dark:bg-blue-black border border-warm-limestone/40 dark:border-warm-limestone/15 rounded-sm p-8 shadow-sm">
            <svg className="w-10 h-10 mx-auto text-warm-stone/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-serif italic mb-2">No matching businesses found.</p>
            <p className="text-xs font-mono text-warm-stone max-w-sm mx-auto mb-6">
              Try adjusting your search terms or clearing the category filter to browse all listings.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery('')
              }}
              className="text-xs font-mono font-bold uppercase tracking-widest text-ivory-paper bg-deep-spruce hover:bg-oxblood-brown dark:bg-[#203633] dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black border border-deep-spruce/20 dark:border-aged-brass/35 px-4 py-2 rounded-sm transition-all duration-300 cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
