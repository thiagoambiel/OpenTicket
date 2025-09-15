import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createInvites } from '@/lib/data/invites'
import { canGenerateInvites } from '@/lib/permissions'
import { prisma } from '@/lib/db'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const allowed = await canGenerateInvites(params.id)
  if (!allowed) return new NextResponse('Forbidden', { status: 403 })
  const body = await _req.json()
  const invites = Array.isArray(body?.invites) ? body.invites : []
  if (invites.length === 0) return new NextResponse('No invites', { status: 400 })
  // enforce event invite limit
  const evt = await prisma.event.findUnique({ where: { id: params.id }, select: { inviteLimit: true, _count: { select: { invites: true } } } })
  if (!evt) return new NextResponse('Event not found', { status: 404 })
  if (typeof evt.inviteLimit === 'number') {
    const remaining = evt.inviteLimit - evt._count.invites
    if (remaining <= 0) return new NextResponse('Invite limit reached', { status: 422 })
    if (invites.length > remaining) return new NextResponse(`Invite limit exceeded. Remaining: ${remaining}`, { status: 422 })
  }
  const created = await createInvites(params.id, invites.map((i: any) => ({ email: i.email, nickname: i.nickname })))
  return NextResponse.json({ invites: created })
}
