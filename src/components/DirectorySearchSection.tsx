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
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 11.25a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
  'shopping': {
    label: 'Shopping',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  'lifestyle': {
    label: 'Lifestyle',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.684A1.125 1.125 0 003 6.69v11.22c0 .425.24.815.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0l5.375-2.688a1.125 1.125 0 011.006 0z" />
      </svg>
    ),
  },
  'automotive': {
    label: 'Automotive',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3m12 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.75M9 15h9.75M9 15a1.5 1.5 0 11-3 0m3 0H3.75M9 15V9m9.75 6v-3.75m0 0a1.5 1.5 0 00-1.5-1.5H12M18.75 11.25v-3.75m0 3.75h1.5m-1.5-3.75a1.5 1.5 0 00-1.5-1.5H15M18.75 7.5h1.5m-3 0V3.75m0 3.75H12M3 15V9.75" />
      </svg>
    ),
  },
  'professional-services': {
    label: 'Professional Services',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v2.63c0 .82-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.68-1.5-1.5v-2.63m18-4.5V7.125c0-.828-.672-1.5-1.5-1.5H3.75c-.828 0-1.5.672-1.5 1.5V9.65m18 0A11.954 11.954 0 0112 10.5c-2.905 0-5.63-.615-8.083-1.725m16.083 0V9.65M3.75 5.625h16.5M3.75 2.25h16.5" />
      </svg>
    ),
  },
  'health-wellness': {
    label: 'Health & Wellness',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  'arts-culture': {
    label: 'Arts & Culture',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.25 8.25 0 015.362-4.386zM15.362 5.214A8.252 8.252 0 0012 3 8.25 8.25 0 006.038 7.048M15.362 5.214L17 3M6.038 7.048L4 5" />
      </svg>
    ),
  },
  'home-lodging': {
    label: 'Home & Lodging',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  'septic-excavation': {
    label: 'Septic & Excavation',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M6 6l12 12M6 18L12 12" />
      </svg>
    ),
  },
  'auto-repair': {
    label: 'Auto Repair',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 1019.4 18.85l-5.83-5.83M11.42 15.17a4.99 4.99 0 01-7.07-7.07c1.7-1.7 4.38-1.92 6.32-.67l-2.83 2.83a2 2 0 000 2.83l.08.08a2 2 0 002.83 0l2.83-2.83c1.25 1.94 1.03 4.62-.67 6.32z" />
      </svg>
    ),
  },
  'plumbing-hvac': {
    label: 'Plumbing & HVAC',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v2.63c0 .82-.67 1.5-1.5 1.5h-5.25v2.25c0 .41-.34.75-.75.75h-1.5a.75.75 0 01-.75-.75v-2.25H5.25c-.83 0-1.5-.68-1.5-1.5v-2.63M20.25 9.75V7.13c0-.83-.67-1.5-1.5-1.5h-5.25V3.38c0-.41-.34-.75-.75-.75h-1.5a.75.75 0 01-.75.75v2.25H5.25c-.83 0-1.5.67-1.5 1.5v2.63M3.75 12h16.5" />
      </svg>
    ),
  },
  'electrical': {
    label: 'Electrical',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  'towing': {
    label: 'Towing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  'welding-fabrication': {
    label: 'Welding & Fabrication',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 1019.4 18.85l-5.83-5.83M11.42 15.17a4.99 4.99 0 01-7.07-7.07c1.7-1.7 4.38-1.92 6.32-.67l-2.83 2.83a2 2 0 000 2.83l.08.08a2 2 0 002.83 0l2.83-2.83c1.25 1.94 1.03 4.62-.67 6.32z" />
      </svg>
    ),
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
}

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
        counts[item.category] = (counts[item.category] || 0) + 1
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
      if (selectedCategory && item.category !== selectedCategory) {
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
        const categoryMatch = categoryLabel.toLowerCase().includes(query)
        
        return nameMatch || descMatch || neighborMatch || categoryMatch
      }
      return true
    })

    // Sort alphabetically by Category label, then by Business Name
    return filtered.sort((a, b) => {
      const catA = CATEGORY_LABELS[a.category] || a.category || ''
      const catB = CATEGORY_LABELS[b.category] || b.category || ''
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

            return (
              <button
                key={slug}
                onClick={() => handleCategoryClick(slug)}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer ${
                  isActive
                    ? 'bg-deep-spruce dark:bg-[#203633] border-deep-spruce dark:border-aged-brass text-ivory-paper dark:text-aged-brass scale-[1.01]'
                    : `bg-white/50 dark:bg-soft-black/20 backdrop-blur-md border-white/60 dark:border-white/5 hover:border-aged-brass/70 text-soft-black dark:text-ivory-paper`
                }`}
              >
                {/* Icon Circle */}
                <div className={`p-2 rounded-full mb-3 transition-colors duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-warm-limestone/40 dark:bg-slate-900/50 text-deep-spruce dark:text-aged-brass group-hover:bg-aged-brass/10'
                }`}>
                  {info.icon}
                </div>

                <span className={`font-serif text-sm font-bold tracking-tight mb-1 transition-colors ${
                  isActive ? 'text-white dark:text-aged-brass' : 'text-deep-spruce dark:text-ivory-paper group-hover:text-aged-brass'
                }`}>
                  {info.label}
                </span>

                <span className={`font-mono text-[9px] uppercase tracking-wider ${
                  isActive ? 'text-ivory-paper/60' : 'text-warm-stone'
                }`}>
                  {count} {count === 1 ? 'Listing' : 'Listings'}
                </span>
                
                {/* Active Indicator Pin */}
                {isActive && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-aged-brass animate-pulse" />
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
