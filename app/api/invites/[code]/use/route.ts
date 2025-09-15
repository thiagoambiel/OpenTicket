import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { markInviteUsed } from '@/lib/data/invites'
import { isOrganizer } from '@/lib/auth'

export async function POST(_req: Request, { params }: { params: { code: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const organizer = await isOrganizer()
  if (!organizer) return new NextResponse('Forbidden', { status: 403 })

  const res = await markInviteUsed(params.code)
  if (!res.ok) {
    if (res.reason === 'not_found') return new NextResponse('Not found', { status: 404 })
    if (res.reason === 'already_used') return new NextResponse('Already used', { status: 409 })
    if (res.reason === 'cancelled') return new NextResponse('Cancelled', { status: 422 })
  }
  return NextResponse.json({ ok: true, invite: res.invite })
}
