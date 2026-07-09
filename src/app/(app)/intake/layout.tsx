import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding Intake',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/intake',
  },
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
