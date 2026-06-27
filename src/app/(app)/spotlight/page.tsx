import type { Metadata } from 'next'
import SpotlightPageClient from './SpotlightClient'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Local Legends Spotlight | Missoula Legends',
  description: 'Every month we select one local Missoula business and put our marketing weight behind it — professional features and partner kits.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/spotlight' },
}

export default function SpotlightPage() {
  return <SpotlightPageClient />
}
