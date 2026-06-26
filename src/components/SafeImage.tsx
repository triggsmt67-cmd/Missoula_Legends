'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = '/media/placeholder.jpg',
  alt,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false)

  // Reset error state if src changes
  useEffect(() => {
    setError(false)
  }, [src])

  const imageSrc = !src || error ? fallbackSrc : src

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || ''}
      onError={() => setError(true)}
    />
  )
}
