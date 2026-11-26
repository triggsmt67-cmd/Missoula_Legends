import { createLocalReq, type Payload } from 'payload'

export type SyncedEvent = {
  description: string
  externalLink?: string
  featuredImage?: string | number
  schedule: string
  title: string
}

/** Keep the current calendar intact until its entire replacement can commit. */
export async function replaceEvents(payload: Payload, events: SyncedEvent[]) {
  if (events.length === 0) throw new Error('Cannot replace the calendar with no events.')

  const transactionID = await payload.db.beginTransaction({ isolationLevel: 'serializable' })
  if (transactionID == null) throw new Error('Calendar replacement requires a database transaction.')

  try {
    const req = await createLocalReq({ req: { transactionID } }, payload)
    const previous = await payload.find({
      collection: 'events', depth: 0, pagination: false, overrideAccess: true, req,
    })

    for (const event of events) {
      await payload.create({ collection: 'events', data: event, overrideAccess: true, req })
    }

    const previousIds = previous.docs.map((event) => event.id)
    if (previousIds.length > 0) {
      const result = await payload.delete({
        collection: 'events', where: { id: { in: previousIds } }, overrideAccess: true, req,
      })
      if (result.errors.length > 0) throw new Error('Unable to replace all previous events.')
    }

    // Media may be referenced elsewhere. Replacing events never deletes blobs.
    await payload.db.commitTransaction(transactionID)
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  }
}
