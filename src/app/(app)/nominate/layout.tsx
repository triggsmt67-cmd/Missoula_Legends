import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nominate a Legend',
  description: 'Suggest a local business or neighborhood cornerstone to be featured in the Missoula Legends directory.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/nominate' },
}

export default function NominateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
