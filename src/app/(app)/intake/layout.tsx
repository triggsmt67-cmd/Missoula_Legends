import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAuthenticatedPayloadUser } from '@/lib/payload-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Curator Intake',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function IntakeLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuthenticatedPayloadUser()

  if (!user) {
    redirect('/admin/login?redirect=/intake')
  }

  return children
}
