import { prisma } from '@/lib/db'
import type { Invite } from '@/types'

export async function listInvitesForEmail(email: string): Promise<Invite[]> {
  const items = await prisma.invite.findMany({ where: { recipientEmail: email.toLowerCase() } })
  return items.map(toInvite)
}

export async function getInviteByCode(code: string): Promise<Invite | undefined> {
  const i = await prisma.invite.findUnique({ where: { code } })
  return i ? toInvite(i) : undefined
}

export async function createInvites(eventId: string, items: Array<{ email: string; nickname?: string }>): Promise<Invite[]> {
  const created = await prisma.$transaction(items.map(it => prisma.invite.create({
    data: {
      eventId,
      recipientEmail: it.email.toLowerCase(),
      nickname: it.nickname,
    }
  })))
  return created.map(toInvite)
}

export async function updateInvite(code: string, patch: Partial<Invite>): Promise<Invite | undefined> {
  const i = await prisma.invite.update({ where: { code }, data: {
    nickname: patch.nickname,
    status: patch.status as any,
  } })
  return toInvite(i)
}

export async function markInviteUsed(code: string): Promise<{ ok: true; invite: Invite } | { ok: false; reason: 'not_found' | 'already_used' | 'cancelled' }> {
  const inv = await prisma.invite.findUnique({ where: { code } })
  if (!inv) return { ok: false, reason: 'not_found' }
  if (inv.status === 'used') return { ok: false, reason: 'already_used' }
  if (inv.status === 'cancelled') return { ok: false, reason: 'cancelled' }
  const updated = await prisma.invite.update({ where: { code }, data: { status: 'used', usedAt: new Date() } })
  return { ok: true, invite: toInvite(updated) }
}

function toInvite(i: any): Invite {
  return {
    code: i.code,
    eventId: i.eventId,
    recipientEmail: i.recipientEmail,
    recipientId: i.recipientId ?? undefined,
    nickname: i.nickname ?? undefined,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  }
}
