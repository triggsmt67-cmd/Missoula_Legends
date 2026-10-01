'use client'

import type { ComponentProps } from 'react'

type Props = ComponentProps<'a'> & { sponsorName: string; placement: string }

export function SponsorTrackingLink({ sponsorName, placement, onClick, ...props }: Props) {
  return <a {...props} onClick={(event) => {
    onClick?.(event)
    const analytics = window as Window & { gtag?: (...args: unknown[]) => void }
    analytics.gtag?.('event', 'sponsor_click', {
      sponsor_name: sponsorName,
      placement,
      destination_url: props.href,
    })
  }} />
}
