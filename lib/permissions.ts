import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { isOrganizer } from './auth'

export async function getCurrentUserInfo() {
  const user = await currentUser()
  if (!user) return undefined
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase()
  return { id: user.id, email }
}

export async function isEventAdmin(eventId: string): Promise<boolean> {
  const organizer = await isOrganizer()
  if (organizer) return true
  const user = await getCurrentUserInfo()
  if (!user) return false
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { createdBy: true } })
  if (!event) return false
  return event.createdBy === user.id
}

export async function canGenerateInvites(eventId: string): Promise<boolean> {
  if (await isEventAdmin(eventId)) return true
  const user = await getCurrentUserInfo()
  if (!user) return false
  const promo = await prisma.eventPromoter.findFirst({
    where: {
      eventId,
      OR: [
        user.email ? { email: user.email } : undefined,
        { userId: user.id },
      ].filter(Boolean) as any,
    },
  })
  return !!promo
}

