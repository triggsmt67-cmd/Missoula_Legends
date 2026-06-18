import React from 'react'

interface MapComponentProps {
  address: string
  businessName?: string
}

export function MapComponent({ address, businessName }: MapComponentProps) {
  if (!address) return null

  const encodedAddress = encodeURIComponent(address)
  // Standard Google Maps embed URL
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="w-full aspect-[4/3] md:aspect-[16/10] relative bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 p-2 rounded-sm shadow-sm">
      <iframe
        title={`Map location of ${businessName || 'Business'}`}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-[30%] contrast-[110%] opacity-90 dark:opacity-85 rounded-none w-full h-full"
      />
    </div>
  )
}
