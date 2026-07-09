import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Business Update',
  description: 'Own or manage a business listed on Missoula Legends? Use this form to request an update, correction, credit change, or removal.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/business-update' },
}

export default function BusinessUpdateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
