import type { Metadata } from 'next'
import SpotlightPageClient from './SpotlightClient'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Local Legends Spotlight',
  description: 'Every month we select one local Missoula business and put our marketing weight behind it — professional features and partner kits.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/spotlight' },
}

export default function SpotlightPage() {
  return <SpotlightPageClient />
}
