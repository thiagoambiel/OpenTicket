import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getInviteByCode } from '@/lib/data/invites'
import { getEvent } from '@/lib/data/events'
import { isOrganizer } from '@/lib/auth'

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const organizer = await isOrganizer()
  if (!organizer) return new NextResponse('Forbidden', { status: 403 })

  const inv = await getInviteByCode(params.code)
  if (!inv) return new NextResponse('Not found', { status: 404 })
  const ev = await getEvent(inv.eventId)
  return NextResponse.json({
    code: inv.code,
    status: inv.status,
    eventId: inv.eventId,
    eventTitle: ev?.title || 'Evento',
    nickname: inv.nickname,
    recipientEmail: inv.recipientEmail,
  })
}
