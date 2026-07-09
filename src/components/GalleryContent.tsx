'use client'

import { useState, useEffect, useCallback } from 'react'
import { SafeImage } from '@/components/SafeImage'
import { decodeUrl } from '@/lib/schema-utils'

const CATEGORY_LABELS: Record<string, string> = {
  neighborhoods: 'Neighborhoods & Streets',
  business: 'Local Business',
  events: 'Events & Community',
  nature: 'Nature & Outdoors',
  history: 'History & Archival',
  'food-drink': 'Food & Drink',
  people: 'People of Missoula',
}

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  downtown: 'Downtown',
  'hip-strip': 'Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  northside: 'Northside',
  westside: 'Westside',
  rattlesnake: 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  lolo: 'Lolo',
  'greater-missoula': 'Greater Missoula Area',
}

interface PhotoProps {
  id: string
  photo?: {
    url?: string
    alt?: string
    width?: number
    height?: number
    sizes?: {
      featureHero?: { url?: string }
      thumbnail?: { url?: string }
    }
  }
  caption?: string
  photographerName?: string
  photographerInstagram?: string | null
  neighborhood?: string
  category?: string
  dateTaken?: string | null
  featured?: boolean
}

interface GalleryContentProps {
  photos: PhotoProps[]
  featuredPhoto: PhotoProps | null
  activeCategory?: string
}

export function GalleryContent({ photos, featuredPhoto, activeCategory }: GalleryContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Construct the full list of photos in display order for navigation
  const displayPhotos = featuredPhoto ? [featuredPhoto, ...photos] : photos

  const openLightbox = (photoId: string) => {
    const idx = displayPhotos.findIndex((p) => p.id === photoId)
    if (idx !== -1) {
      setLightboxIndex(idx)
    }
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < displayPhotos.length - 1 ? prev + 1 : 0))
    }
  }, [lightboxIndex, displayPhotos.length])

  const prevPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayPhotos.length - 1))
    }
  }, [lightboxIndex, displayPhotos.length])

  // Keyboard navigation & lock scroll
  useEffect(() => {
    if (lightboxIndex === null) return

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto])

  const activePhoto = lightboxIndex !== null ? displayPhotos[lightboxIndex] : null

  return (
    <>
      {/* ─── FEATURED PHOTO ─────────────────────────────────────────────────── */}
      {featuredPhoto && !activeCategory && (
        <div className="mb-12">
          <div 
            onClick={() => openLightbox(featuredPhoto.id)}
            className="group relative overflow-hidden rounded-[2rem] bg-deep-spruce border border-warm-limestone/30 dark:border-warm-limestone/10 shadow-xl cursor-pointer"
          >
            <div className="relative aspect-[21/9] w-full">
              <SafeImage
                src={decodeUrl(featuredPhoto.photo?.sizes?.featureHero?.url) || decodeUrl(featuredPhoto.photo?.url) || '/media/missoula-hero-twilight.webp'}
                alt={featuredPhoto.photo?.alt || featuredPhoto.caption || ''}
                fill
                sizes="(max-width: 768px) 100vw, 1320px"
                className="object-cover object-center scale-100 group-hover:scale-[1.015] transition-transform duration-1000"
                fallbackSrc="/media/missoula-hero-twilight.webp"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a14]/90 via-transparent to-transparent" />
            </div>

            {/* Featured overlay caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-[70ch]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-aged-brass text-[#17231D] font-mono text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md">
                      ★ Featured
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 font-bold">
                      {featuredPhoto.category ? CATEGORY_LABELS[featuredPhoto.category] || featuredPhoto.category : ''}
                    </span>
                  </div>
                  <p className="text-white font-serif text-lg sm:text-xl font-normal leading-snug mb-3">
                    "{featuredPhoto.caption}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                      📷 {featuredPhoto.photographerName}
                    </span>
                    {featuredPhoto.photographerInstagram && (
                      <>
                        <span className="text-white/25 text-xs">·</span>
                        <span className="text-aged-brass text-xs font-mono">{featuredPhoto.photographerInstagram}</span>
                      </>
                    )}
                    {featuredPhoto.dateTaken && (
                      <>
                        <span className="text-white/25 text-xs">·</span>
                        <span className="text-white/40 text-xs font-mono">{featuredPhoto.dateTaken}</span>
                      </>
                    )}
                  </div>
                </div>
                {featuredPhoto.neighborhood && (
                  <span className="flex-shrink-0 text-[10px] font-mono uppercase tracking-wider text-white/40 border border-white/15 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                    {NEIGHBORHOOD_LABELS[featuredPhoto.neighborhood] || featuredPhoto.neighborhood}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION HEADER ─────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-deep-spruce dark:text-ivory-paper">
            {activeCategory ? CATEGORY_LABELS[activeCategory] : 'The Collection'}
          </h2>
          <div className="h-px flex-1 bg-warm-limestone/50 dark:bg-warm-limestone/15" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-warm-stone font-bold flex-shrink-0">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </span>
        </div>
      )}

      {/* ─── MASONRY GRID ───────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {photos.map((photo, index) => {
            const imgUrl = decodeUrl(photo.photo?.url) || decodeUrl(photo.photo?.sizes?.featureHero?.url) || '/media/missoula-hero-twilight.webp'
            const altText = photo.photo?.alt || photo.caption || ''
            
            const hasDimensions = !!(photo.photo?.width && photo.photo?.height)
            const aspectRatio = photo.photo?.width && photo.photo?.height
              ? `${photo.photo.width} / ${photo.photo.height}`
              : undefined

            // Alternate aspect ratios for seed photos
            const aspectClass = index % 3 === 0
              ? 'aspect-[4/5]'
              : index % 3 === 1
              ? 'aspect-[4/3]'
              : 'aspect-square'

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo.id)}
                className="break-inside-avoid group relative overflow-hidden rounded-[1.5rem] bg-warm-limestone/20 dark:bg-warm-limestone/5 border border-warm-limestone/40 dark:border-warm-limestone/10 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <div 
                  className={`relative w-full ${!hasDimensions ? aspectClass : ''}`}
                  style={aspectRatio ? { aspectRatio } : undefined}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={altText}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
                    className="object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-700"
                    fallbackSrc="/media/missoula-hero-twilight.webp"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a14]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Caption overlay — appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-serif text-sm leading-snug mb-2 line-clamp-2">
                    "{photo.caption}"
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white/70 text-[10px] font-mono uppercase tracking-wider">
                      📷 {photo.photographerName}
                    </span>
                    {photo.photographerInstagram && (
                      <span className="text-aged-brass text-[10px] font-mono">{photo.photographerInstagram}</span>
                    )}
                  </div>
                </div>

                {/* Always-visible bottom info strip */}
                <div className="bg-[#faf8f4]/95 dark:bg-[#17231D]/95 backdrop-blur-sm px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-deep-spruce dark:text-ivory-paper text-xs font-serif font-semibold truncate leading-tight">
                      {photo.photographerName}
                    </p>
                    {photo.dateTaken && (
                      <p className="text-warm-stone text-[10px] font-mono uppercase tracking-wider mt-0.5">
                        {photo.dateTaken}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {photo.category && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-aged-brass font-bold">
                        {CATEGORY_LABELS[photo.category] || photo.category}
                      </span>
                    )}
                    {photo.neighborhood && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-warm-stone/70">
                        {NEIGHBORHOOD_LABELS[photo.neighborhood] || photo.neighborhood}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── LIGHTBOX MODAL ─────────────────────────────────────────────────── */}
      {activePhoto && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in">
          {/* Close Backdrop Click Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox} />

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10 z-30 group"
            aria-label="Close lightbox"
          >
            <svg className="w-7 h-7 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevPhoto()
            }}
            className="absolute left-4 sm:left-6 text-white/50 hover:text-white transition-all p-3 rounded-full hover:bg-white/10 z-30 group"
            aria-label="Previous photo"
          >
            <svg className="w-8 h-8 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextPhoto()
            }}
            className="absolute right-4 sm:right-6 text-white/50 hover:text-white transition-all p-3 rounded-full hover:bg-white/10 z-30 group"
            aria-label="Next photo"
          >
            <svg className="w-8 h-8 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Lightbox Content Container */}
          <div className="relative w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] flex flex-col items-center gap-6 z-10 animate-scale-up">
            {/* Image Box */}
            <div className="relative max-h-[70vh] w-full flex items-center justify-center overflow-hidden">
              <img
                src={decodeUrl(activePhoto.photo?.url) || decodeUrl(activePhoto.photo?.sizes?.featureHero?.url) || '/media/missoula-hero-twilight.webp'}
                alt={activePhoto.photo?.alt || activePhoto.caption || ''}
                className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/media/missoula-hero-twilight.webp';
                }}
              />
            </div>

            {/* Info panel below the image */}
            <div className="w-full text-center max-w-[800px] px-4 animate-fade-in-up">
              {activePhoto.caption && (
                <p className="text-white font-serif text-lg sm:text-xl md:text-2xl font-light italic leading-relaxed mb-4">
                  "{activePhoto.caption}"
                </p>
              )}

              <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-white/70 font-mono uppercase tracking-wider">
                <span className="text-aged-brass font-bold">
                  📷 {activePhoto.photographerName}
                </span>

                {activePhoto.photographerInstagram && (
                  <>
                    <span className="text-white/20">•</span>
                    <a 
                      href={`https://instagram.com/${activePhoto.photographerInstagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aged-brass hover:underline transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {activePhoto.photographerInstagram}
                    </a>
                  </>
                )}

                {activePhoto.neighborhood && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-white/55">
                      {NEIGHBORHOOD_LABELS[activePhoto.neighborhood] || activePhoto.neighborhood}
                    </span>
                  </>
                )}

                {activePhoto.dateTaken && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40">
                      {activePhoto.dateTaken}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
