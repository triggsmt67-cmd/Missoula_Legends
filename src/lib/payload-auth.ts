import 'server-only'

import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export async function getAuthenticatedPayloadUser() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  return { payload, user }
}

export async function requirePayloadUser() {
  const auth = await getAuthenticatedPayloadUser()

  if (!auth.user) {
    throw new Error('Unauthorized')
  }

  return auth
}
