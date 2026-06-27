import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nominate a Legend | Missoula Legends',
  description: 'Suggest a local business or neighborhood cornerstone to be featured in the Missoula Legends directory.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/nominate' },
}

export default function NominateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
