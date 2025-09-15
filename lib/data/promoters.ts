import { prisma } from '@/lib/db'

export type Promoter = {
  id: string
  eventId: string
  email: string
  userId?: string
  createdAt: string
}

export async function listPromoters(eventId: string): Promise<Promoter[]> {
  const items = await prisma.eventPromoter.findMany({ where: { eventId }, orderBy: { createdAt: 'desc' } })
  return items.map(p => ({ id: p.id, eventId: p.eventId, email: p.email, userId: p.userId ?? undefined, createdAt: p.createdAt.toISOString() }))
}

export async function addPromoter(eventId: string, email: string): Promise<Promoter> {
  const created = await prisma.eventPromoter.upsert({
    where: { eventId_email: { eventId, email: email.toLowerCase() } },
    create: { eventId, email: email.toLowerCase() },
    update: {},
  })
  return { id: created.id, eventId: created.eventId, email: created.email, userId: created.userId ?? undefined, createdAt: created.createdAt.toISOString() }
}

export async function removePromoter(id: string): Promise<void> {
  await prisma.eventPromoter.delete({ where: { id } })
}

