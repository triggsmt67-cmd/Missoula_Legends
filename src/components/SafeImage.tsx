'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

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
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imageSrc = !src || failedSrc === src ? fallbackSrc : src

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || ''}
      onError={() => {
        if (src && imageSrc === src) setFailedSrc(src)
      }}
    />
  )
}
