import { prisma } from '@/lib/db'
import type { Event as EvType } from '@/types'

export async function listEvents(): Promise<EvType[]> {
  const items = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  return items.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    dateISO: e.date.toISOString(),
    bannerUrl: e.bannerUrl ?? undefined,
    inviteLimit: e.inviteLimit ?? null,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))
}

export async function getEvent(id: string): Promise<EvType | undefined> {
  const e = await prisma.event.findUnique({ where: { id } })
  if (!e) return undefined
  return {
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    dateISO: e.date.toISOString(),
    bannerUrl: e.bannerUrl ?? undefined,
    inviteLimit: e.inviteLimit ?? null,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }
}

export async function createEvent(input: Omit<EvType, 'id' | 'createdAt' | 'updatedAt'>): Promise<EvType> {
  const created = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      location: input.location,
      date: new Date(input.dateISO),
      inviteLimit: input.inviteLimit ?? null,
      createdBy: input.createdBy,
    }
  })
  return {
    id: created.id,
    title: created.title,
    description: created.description ?? undefined,
    location: created.location ?? undefined,
    dateISO: created.date.toISOString(),
    bannerUrl: created.bannerUrl ?? undefined,
    inviteLimit: created.inviteLimit ?? null,
    createdBy: created.createdBy,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  }
}

export async function updateEventBanner(id: string, bannerUrl: string): Promise<EvType | undefined> {
  const updated = await prisma.event.update({ where: { id }, data: { bannerUrl } })
  return {
    id: updated.id,
    title: updated.title,
    description: updated.description ?? undefined,
    location: updated.location ?? undefined,
    dateISO: updated.date.toISOString(),
    bannerUrl: updated.bannerUrl ?? undefined,
    inviteLimit: updated.inviteLimit ?? null,
    createdBy: updated.createdBy,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}

export async function deleteEvent(id: string): Promise<void> {
  await prisma.event.delete({ where: { id } })
}

export async function listEventsForUser(userId: string): Promise<EvType[]> {
  const items = await prisma.event.findMany({ where: { createdBy: userId }, orderBy: { date: 'asc' } })
  return items.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    dateISO: e.date.toISOString(),
    bannerUrl: e.bannerUrl ?? undefined,
    inviteLimit: e.inviteLimit ?? null,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))
}

export async function listEventsForPromoter(userId: string, email?: string | null): Promise<EvType[]> {
  const where: any = {
    promoters: {
      some: {
        OR: [
          userId ? { userId } : undefined,
          email ? { email: email.toLowerCase() } : undefined,
        ].filter(Boolean),
      },
    },
  }
  const items = await prisma.event.findMany({ where, orderBy: { date: 'asc' } })
  return items.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    dateISO: e.date.toISOString(),
    bannerUrl: e.bannerUrl ?? undefined,
    inviteLimit: e.inviteLimit ?? null,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))
}

export async function updateEvent(
  id: string,
  data: Partial<Pick<EvType, 'title' | 'description' | 'location' | 'dateISO' | 'inviteLimit'>>
): Promise<EvType | undefined> {
  const payload: any = {}
  if (typeof data.title !== 'undefined') payload.title = data.title
  if (typeof data.description !== 'undefined') payload.description = data.description
  if (typeof data.location !== 'undefined') payload.location = data.location
  if (typeof data.dateISO !== 'undefined') payload.date = new Date(data.dateISO)
  if (typeof data.inviteLimit !== 'undefined') payload.inviteLimit = data.inviteLimit
  const updated = await prisma.event.update({ where: { id }, data: payload })
  return {
    id: updated.id,
    title: updated.title,
    description: updated.description ?? undefined,
    location: updated.location ?? undefined,
    dateISO: updated.date.toISOString(),
    bannerUrl: updated.bannerUrl ?? undefined,
    inviteLimit: updated.inviteLimit ?? null,
    createdBy: updated.createdBy,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}
