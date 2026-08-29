import type { Metadata } from 'next'
import SpotlightPageClient from './SpotlightClient'
import { getActiveSponsorPlacement } from '@/lib/sponsorship'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Local Legends Spotlight',
  description: 'Every month we select one local Missoula business and put our marketing weight behind it — professional features and partner kits.',
  alternates: { canonical: '/spotlight' },
}

export default async function SpotlightPage() {
  const spotlightPlacement = await getActiveSponsorPlacement({
    placementKey: 'spotlight-program',
  })

  return <SpotlightPageClient sponsorPlacement={spotlightPlacement} />
}
